"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { VenturePackLogo } from "@/components/VenturePackLogo";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      if (result?.ok) {
        console.log("Login successful, redirecting to /app");
        router.push("/app");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-8 text-[#00173C] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="mx-auto flex w-fit rounded-xl p-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(0,158,167,0.28)]">
          <VenturePackLogo width={220} height={59} priority className="h-12 w-auto" />
        </Link>
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#008787]">
            Founder preparation
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back to your preparation workspace.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#64748B]">
            Continue organizing company information, matter notes, and counsel packet details before your next
            conversation with counsel.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Preparation completion", "Matter organization", "Counsel packet preview", "Attorney matching request"].map(
              (item) => (
                <div key={item} className="rounded-2xl border border-[#DCE7F3] bg-white p-4 text-sm font-semibold text-[#334155] shadow-sm">
                  {item}
                </div>
              ),
            )}
          </div>
          <div className="mt-6 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
            VenturePack is not a law firm and does not provide legal advice.
          </div>
        </section>

        <section className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="border-b border-[#DCE7F3] pb-5">
            <h2 className="text-2xl font-bold">Log in</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Use your VenturePack account email and password.
            </p>
          </div>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-[#00173C]">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="vp-input mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm font-medium text-[#00173C]">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="vp-input mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none"
              />
            </label>
            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Signing in..." : "Log in"}
            </button>
          </form>
          <div className="mt-5 flex flex-col gap-2 border-t border-[#DCE7F3] pt-5 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
            <Link href="/signup" className="font-semibold text-[#008787] hover:text-[#00173C]">
              Create account
            </Link>
            <Link href="/forgot-password" className="font-semibold text-[#008787] hover:text-[#00173C]">
              Forgot password?
            </Link>
            <Link href="/" className="font-semibold text-[#00173C] hover:text-[#00173C]">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
