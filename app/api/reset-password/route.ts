import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function validatePassword(password: string): { isValid: boolean; reason?: string } {
  const MIN_LENGTH = 8;

  if (password.length < MIN_LENGTH) {
    return { isValid: false, reason: `Password must be at least ${MIN_LENGTH} characters.` };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, reason: "Password must contain at least one uppercase letter." };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, reason: "Password must contain at least one lowercase letter." };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, reason: "Password must contain at least one number." };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, reason: "Password must contain at least one special character (!@#$%^&*...)." };
  }

  return { isValid: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawToken = typeof body.token === "string" ? body.token.trim() : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!rawToken) {
      return NextResponse.json(
        { ok: false, error: "This password reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { ok: false, error: passwordValidation.reason },
        { status: 400 },
      );
    }

    const tokenHash = hashToken(rawToken);
    const now = new Date();

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("RESET_PASSWORD_USER_FOUND", Boolean(resetToken?.userId));
    }

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= now) {
      return NextResponse.json(
        { ok: false, error: "This password reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash: newPasswordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: { not: resetToken.id },
        },
        data: { usedAt: now },
      }),
    ]);

    if (process.env.NODE_ENV !== "production") {
      console.log("RESET_PASSWORD_UPDATED_USER_ID", resetToken.userId);
    }

    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { ok: false, error: "Something went wrong resetting your password." },
      { status: 500 },
    );
  }
}
