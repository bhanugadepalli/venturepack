import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

function validatePassword(password: string): { isValid: boolean } {
  const MIN_LENGTH = 8;

  if (password.length < MIN_LENGTH) {
    return { isValid: false };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false };
  }

  return { isValid: true };
}

export async function POST(request: Request) {
  try {
    // Get authenticated user session
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          ok: false,
          error: "You must be logged in to change your password.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      currentPassword?: unknown;
      newPassword?: unknown;
    };

    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please fill in all fields.",
        },
        { status: 400 },
      );
    }

    // Validate new password meets requirements
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          ok: false,
          error: "Password does not meet the required rules.",
        },
        { status: 400 },
      );
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unable to verify your account.",
        },
        { status: 400 },
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          ok: false,
          error: "Current password is incorrect.",
        },
        { status: 400 },
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json(
      {
        ok: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to change your password. Please try again.",
      },
      { status: 500 },
    );
  }
}
