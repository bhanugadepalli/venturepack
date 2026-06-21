"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { VenturePackLogo } from "@/components/VenturePackLogo";

type SignupErrors = Partial<{
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: string;
  form: string;
}>;

// Password validation rules
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = useMemo(() => validatePassword(formData.password), [formData.password]);
  const emailIsValid = isValidEmail(formData.email);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;

  const isFormValid =
    formData.name.trim().length > 0 &&
    emailIsValid &&
    passwordRules.isValid &&
    passwordsMatch &&
    formData.acceptedTerms;

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: SignupErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Enter your name.";
    }

    if (!emailIsValid) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!passwordRules.isValid) {
      nextErrors.password = "Password does not meet the required rules.";
    }

    if (!passwordsMatch) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    if (!formData.acceptedTerms) {
      nextErrors.acceptedTerms = "Please accept the terms and privacy notice.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          acceptedTerms: formData.acceptedTerms,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; fieldErrors?: SignupErrors };

      if (!response.ok || !payload.ok) {
        setErrors(payload.fieldErrors ?? { form: payload.error ?? "Something went wrong creating your account. Please try again." });
        return;
      }

      router.push("/login?message=Account+created.+Please+sign+in.");
    } catch {
      setErrors({ form: "Something went wrong creating your account. Please try again." });
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
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 py-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#008787]">
            Founder workspace
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Create your VenturePack account.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#64748B]">
            Organize startup preparation details, create focused matters, and prepare better questions before speaking
            with counsel.
          </p>
          <div className="mt-8 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-5 text-sm leading-6 text-[#64748B]">
            VenturePack is not a law firm and does not provide legal advice.
          </div>
        </section>

        <section className="rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="border-b border-[#DCE7F3] pb-5">
            <h2 className="text-2xl font-bold">Sign up</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              Use your email and password to create a founder preparation workspace.
            </p>
          </div>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-[#00173C]">
                Name
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 text-sm outline-none focus:border-[#009EA7]"
                />
              </label>
              {errors.name ? <span className="mt-2 block text-sm font-medium text-red-700">{errors.name}</span> : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[#00173C]">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 text-sm outline-none focus:border-[#009EA7]"
                />
              </label>
              {errors.email ? <span className="mt-2 block text-sm font-medium text-red-700">{errors.email}</span> : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[#00173C]">
                Password
                <div className="relative mt-2">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#009EA7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#00173C]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
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

              {/* Password rules checklist */}
              <div className="mt-3 rounded-md border border-[#DCE7F3] bg-[#F8FAFC] p-3">
                <p className="text-xs font-semibold text-[#00173C]">Password must include:</p>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-center gap-2 text-xs text-[#64748B]">
                    {passwordRules.hasMinLength ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(0,158,167,0.12)]">
                        <svg className="h-3 w-3 text-[#009EA7]" fill="currentColor" viewBox="0 0 20 20">
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
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(0,158,167,0.12)]">
                        <svg className="h-3 w-3 text-[#009EA7]" fill="currentColor" viewBox="0 0 20 20">
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
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(0,158,167,0.12)]">
                        <svg className="h-3 w-3 text-[#009EA7]" fill="currentColor" viewBox="0 0 20 20">
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
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(0,158,167,0.12)]">
                        <svg className="h-3 w-3 text-[#009EA7]" fill="currentColor" viewBox="0 0 20 20">
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
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(0,158,167,0.12)]">
                        <svg className="h-3 w-3 text-[#009EA7]" fill="currentColor" viewBox="0 0 20 20">
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

              {errors.password ? <span className="mt-2 block text-sm font-medium text-red-700">{errors.password}</span> : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[#00173C]">
                Confirm password
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
              {errors.confirmPassword ? <span className="mt-2 block text-sm font-medium text-red-700">{errors.confirmPassword}</span> : null}
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-[#DCE7F3] p-4 text-sm leading-6 text-[#334155]">
              <input
                name="acceptedTerms"
                type="checkbox"
                checked={formData.acceptedTerms}
                onChange={handleInputChange}
                className="mt-1 size-4 accent-[#009EA7]"
              />
              <span>I accept the VenturePack terms and privacy notice.</span>
            </label>
            {errors.acceptedTerms ? <p className="text-sm font-medium text-red-700">{errors.acceptedTerms}</p> : null}
            {errors.form ? (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
                {errors.form}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="rounded-xl bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00173C] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
          <div className="mt-5 space-y-3 border-t border-[#DCE7F3] pt-5 text-sm text-[#64748B]">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#008787] hover:text-[#00173C]">
                Sign in
              </Link>
            </p>
            <p>
              <Link href="/forgot-password" className="font-semibold text-[#008787] hover:text-[#00173C]">
                Forgot your password?
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
