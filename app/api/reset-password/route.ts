import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { sendPasswordResetEmail } from "@/src/lib/email";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email || "");

    const safeResponse = {
      ok: true,
      message:
        "If an account exists for that email, a password reset link has been sent.",
    };

    if (!email) {
      return NextResponse.json(safeResponse);
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(safeResponse);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const appUrl = process.env.APP_URL || "http://:3000";
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    if (process.env.NODE_ENV !== "production") {
      console.log("VenturePack password reset URL:", resetUrl);
    }

    await sendPasswordResetEmail({
      to: email,
      resetUrl,
    });

    return NextResponse.json(safeResponse);
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
  }
}