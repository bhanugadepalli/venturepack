"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VenturePackLogo } from "@/components/VenturePackLogo";

type ResetPasswordResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

function getPasswordRules(password: string) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function PasswordRuleItem({
  passed,
  children,
}: {
  passed: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={`flex items-center gap-2 ${passed ? "text-[#008787]" : "text-[#64748B]"}`}>
      <span
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
          passed ? "bg-[rgba(0,158,167,0.12)] text-[#009EA7]" : "border border-[#DCE7F3] bg-white text-transparent"
        }`}
      >
        OK
      </span>
      {children}
    </li>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-xl shadow-slate-200/60">
          <p className="text-sm font-medium text-[#64748B]">Loading reset form...</p>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRules = useMemo(
    () => getPasswordRules(newPassword),
    [newPassword]
  );

  const passwordIsValid = Object.values(passwordRules).every(Boolean);

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const formIsValid = token.length > 0 && passwordIsValid && passwordsMatch;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!formIsValid) {
      setError("Please complete all password rules.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = (await response.json()) as ResetPasswordResponse;

      if (!response.ok || !data.ok) {
        setError(data.error || "Something went wrong resetting your password.");
        return;
      }

      router.push(
        "/login?message=" +
          encodeURIComponent("Password updated. Please sign in.")
      );
    } catch {
      setError("Something went wrong resetting your password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex justify-center rounded-xl p-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(0,158,167,0.28)]">
            <VenturePackLogo width={220} height={74} priority className="h-12 w-auto" />
          </Link>
          <p className="mt-2 text-sm text-[#64748B]">
            Choose a new password.
          </p>
        </div>

        <div className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-xl shadow-slate-200/60">
          <h1 className="text-2xl font-bold text-[#00173C]">
            Reset password
          </h1>

          <p className="mt-4 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
            VenturePack is not a law firm and does not provide legal advice.
          </p>

          {!token && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              This reset link is missing a token. Please request a new reset
              link.
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#00173C]">
                New password
              </label>

              <div className="vp-input mt-1 flex rounded-lg focus-within:border-[#009EA7]">
                <input
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-l-lg px-3 py-2 text-[#00173C] outline-none"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="rounded-r-lg px-3 text-sm text-[#64748B] hover:text-[#00173C]"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <ul className="mt-3 space-y-1.5 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-3 text-xs">
                <PasswordRuleItem passed={passwordRules.minLength}>
                  At least 8 characters
                </PasswordRuleItem>
                <PasswordRuleItem passed={passwordRules.uppercase}>
                  At least one uppercase letter
                </PasswordRuleItem>
                <PasswordRuleItem passed={passwordRules.lowercase}>
                  At least one lowercase letter
                </PasswordRuleItem>
                <PasswordRuleItem passed={passwordRules.number}>
                  At least one number
                </PasswordRuleItem>
                <PasswordRuleItem passed={passwordRules.special}>
                  At least one special character
                </PasswordRuleItem>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00173C]">
                Confirm new password
              </label>

              <div className="vp-input mt-1 flex rounded-lg focus-within:border-[#009EA7]">
                <input
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-l-lg px-3 py-2 text-[#00173C] outline-none"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="rounded-r-lg px-3 text-sm text-[#64748B] hover:text-[#00173C]"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match.
                </p>
              )}

              {passwordsMatch && (
                <p className="mt-1 text-xs text-[#008787]">
                  Passwords match.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!formIsValid || isSubmitting}
              className="w-full rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-4 py-2.5 font-semibold text-white hover:bg-[#00173C] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </form>

          <div className="mt-6 text-sm">
            <Link href="/login" className="font-semibold text-[#008787] hover:text-[#00173C]">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
