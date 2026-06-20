"use client";

import Link from "next/link";
import { useState } from "react";
import { VenturePackLogo } from "@/components/VenturePackLogo";

type ForgotPasswordResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = (await response.json()) as ForgotPasswordResponse;

      if (!response.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setMessage(
        data.message ||
          "If an account exists for that email, a password reset link has been sent."
      );
    } catch {
      setError("Something went wrong. Please try again.");
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
            Reset your password securely.
          </p>
        </div>

        <div className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-xl shadow-slate-200/60">
          <h1 className="text-2xl font-bold text-[#00173C]">
            Forgot password
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
            Enter your email and we will send a reset link if an account exists.
          </p>

          <p className="mt-4 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
            VenturePack is not a law firm and does not provide legal advice.
          </p>

          {message && (
            <div className="mt-4 rounded-lg border border-[rgba(0,158,167,0.22)] bg-[rgba(0,158,167,0.10)] p-3 text-sm text-[#008787]">
              {message}
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
                Email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="vp-input mt-1 w-full rounded-lg px-3 py-2 text-[#00173C] outline-none"
                placeholder="akhil@example.com"
                type="email"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || email.trim().length === 0}
              className="w-full rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-4 py-2.5 font-semibold text-white hover:bg-[#00173C] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
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
