import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

type SignupFieldErrors = Partial<{
  name: string;
  email: string;
  password: string;
  acceptedTerms: string;
}>;

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
      acceptedTerms?: unknown;
    };
    const name = stringValue(body.name);
    const email = stringValue(body.email).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const acceptedTerms = body.acceptedTerms === true;
    const fieldErrors: SignupFieldErrors = {};

    if (!name) {
      fieldErrors.name = "Enter your name.";
    }

    if (!isValidEmail(email)) {
      fieldErrors.email = "Enter a valid email address.";
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      fieldErrors.password = "Password does not meet the required rules.";
    }

    if (!acceptedTerms) {
      fieldErrors.acceptedTerms = "Please accept the terms and privacy notice.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors,
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          ok: false,
          fieldErrors: {
            email: "An account with this email already exists. Try logging in or resetting your password.",
          },
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        termsAcceptedVersion: "v1",
        privacyAcceptedVersion: "v1",
        authStatus: "active",
        accountStatus: "active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        authStatus: true,
        accountStatus: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong creating your account. Please try again.",
      },
      { status: 500 },
    );
  }
}
