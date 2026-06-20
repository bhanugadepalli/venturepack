"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { FormEvent, ChangeEvent } from "react";

type ChangePasswordErrors = Partial<{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  form: string;
}>;

const PASSWORD_MIN_LENGTH = 8;

function validatePassword(password: string): {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
} {
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  return {
    isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRules = useMemo(() => validatePassword(formData.newPassword), [formData.newPassword]);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0;

  const isFormValid =
    formData.currentPassword.length > 0 &&
    passwordRules.isValid &&
    passwordsMatch;

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ChangePasswordErrors = {};

    if (!formData.currentPassword) {
      nextErrors.currentPassword = "Enter your current password.";
    }

    if (!passwordRules.isValid) {
      nextErrors.newPassword = "Password does not meet the required rules.";
    }

    if (!passwordsMatch) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setErrors({ form: payload.error ?? "Unable to change your password. Please try again." });
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/app/settings");
      }, 2000);
    } catch {
      setErrors({ form: "Unable to change your password. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-6 py-8 text-[#00173C] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <Link href="/app/settings" className="text-sm font-semibold text-[#008787] hover:text-[#00173C]">
            ← Back to settings
          </Link>
          <div className="mt-8 rounded-lg border border-[#DCE7F3] bg-white p-6 shadow-sm">
            <div className="rounded-md border border-green-200 bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-900">Password changed successfully</p>
              <p className="mt-2 text-sm text-green-800">
                Your password has been updated. Redirecting to settings...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-8 text-[#00173C] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/app/settings" className="text-sm font-semibold text-[#008787] hover:text-[#00173C]">
          ← Back to settings
        </Link>

        <section className="mt-8 rounded-lg border border-[#DCE7F3] bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-[#DCE7F3] pb-5">
            <h1 className="text-3xl font-semibold">Change password</h1>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Update your VenturePack account password to keep your workspace secure.
            </p>
          </div>

          <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
            {/* Current Password */}
            <div>
              <label className="text-sm font-medium text-[#00173C]">
                Current password
                <div className="relative mt-2">
                  <input
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#009EA7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#00173C]"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.596m16.807 16.807L6.404 6.404m0 0A5.972 5.972 0 012.5 12c0 4.478 3.791 8.268 8 8.975m0 0a8.999 8.999 0 0016-16" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
              {errors.currentPassword ? (
                <span className="mt-2 block text-sm font-medium text-red-700">{errors.currentPassword}</span>
              ) : null}
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-[#00173C]">
                New password
                <div className="relative mt-2">
                  <input
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#009EA7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#00173C]"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.596m16.807 16.807L6.404 6.404m0 0A5.972 5.972 0 012.5 12c0 4.478 3.791 8.268 8 8.975m0 0a8.999 8.999 0 0016-16" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {/* Password Rules Checklist */}
              <div className="mt-3 rounded-md border border-[#DCE7F3] bg-[#F8FAFC] p-3">
                <p className="text-xs font-semibold text-[#00173C]">Password must include:</p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-center gap-2 text-xs text-[#64748B]">
                    {passwordRules.hasMinLength ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-3 w-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#DCE7F3] bg-white" />
                    )}
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#64748B]">
                    {passwordRules.hasUppercase ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-3 w-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#DCE7F3] bg-white" />
                    )}
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#64748B]">
                    {passwordRules.hasLowercase ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-3 w-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#DCE7F3] bg-white" />
                    )}
                    At least one lowercase letter
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#64748B]">
                    {passwordRules.hasNumber ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-3 w-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#DCE7F3] bg-white" />
                    )}
                    At least one number
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#64748B]">
                    {passwordRules.hasSpecialChar ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-3 w-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#DCE7F3] bg-white" />
                    )}
                    At least one special character (!@#$%^&*...)
                  </li>
                </ul>
              </div>

              {errors.newPassword ? (
                <span className="mt-2 block text-sm font-medium text-red-700">{errors.newPassword}</span>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-[#00173C]">
                Confirm new password
                <div className="relative mt-2">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#009EA7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#00173C]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.596m16.807 16.807L6.404 6.404m0 0A5.972 5.972 0 012.5 12c0 4.478 3.791 8.268 8 8.975m0 0a8.999 8.999 0 0016-16" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
              {formData.confirmPassword && !passwordsMatch ? (
                <span className="mt-2 block text-sm font-medium text-red-700">Passwords must match</span>
              ) : null}
              {errors.confirmPassword ? (
                <span className="mt-2 block text-sm font-medium text-red-700">{errors.confirmPassword}</span>
              ) : null}
            </div>

            {/* Error Messages */}
            {errors.form ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
                {errors.form}
              </p>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="rounded-xl bg-[#0B3E9F] px-5 py-3 focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] text-sm font-semibold text-white hover:bg-[#00173C] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Updating password..." : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
