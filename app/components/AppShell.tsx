"use client";

import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { dashboardCopy } from "@/src/content/dashboardCopy";
import { clearCompanyProfile } from "@/src/lib/storage";
import { VenturePackLogo } from "@/components/VenturePackLogo";

const navItems = [
  { href: "/app", label: "Dashboard", group: "Workspace" },
  { href: "/app/onboarding", label: "Onboarding", group: "Workspace" },
  { href: "/app/checklist", label: "Adaptive Checklist", group: "Workspace" },
  { href: "/app/company", label: "Company", group: "Workspace" },
  { href: "/app/matters", label: dashboardCopy.sidebar.items.overview, group: dashboardCopy.sidebar.sectionLabel },
  { href: "/app/counsel-packet", label: dashboardCopy.sidebar.items.counselPacket, group: dashboardCopy.sidebar.sectionLabel },
  { href: "/app/attorney-match", label: dashboardCopy.sidebar.items.attorneyMatching, group: dashboardCopy.sidebar.sectionLabel },
  { href: "/app/settings", label: "Settings", group: "Account" },
  { href: "/app/billing", label: "Billing", group: "Account" },
  { href: "/admin", label: "Admin", group: "Admin" },
  { href: "/admin/sources", label: "Sources", group: "Admin" },
  { href: "/admin/risk-rules", label: "Risk rules", group: "Admin" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userLabel, setUserLabel] = useState("");

  useEffect(() => {
    getSession().then((session) => {
      setUserLabel(session?.user?.name || session?.user?.email || "");
    });
  }, []);

  function clearDemoData() {
    clearCompanyProfile();
    router.push("/app/onboarding");
    router.refresh();
  }

  function handleSignOut() {
    signOut({ redirectTo: "/login" });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#00173C]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-[#DCE7F3] bg-white/95 shadow-xl shadow-[#00173C]/[0.03] backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-6">
            <div>
              <Link href="/" className="inline-flex rounded-xl p-1 hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[rgba(0,158,167,0.28)]">
                <VenturePackLogo width={150} height={40} className="h-8 w-auto max-w-[150px]" />
              </Link>
              <p className="mt-2 hidden text-xs font-medium text-[#64748B] lg:block">Prepare before the first legal conversation.</p>
            </div>
            <span className="rounded-full border border-[rgba(0,158,167,0.18)] bg-[rgba(0,158,167,0.10)] px-2.5 py-1 text-xs font-semibold text-[#008787]">MVP</span>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-5 pb-4 lg:flex-1 lg:flex-col lg:px-4 lg:pb-6">
            {["Workspace", dashboardCopy.sidebar.sectionLabel, "Account", "Admin"].map((group) => (
              <div key={group} className="flex gap-2 lg:flex-col">
                <p className="hidden px-3 pt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#94A3B8] lg:block">{group}</p>
                {navItems.filter((item) => item.group === group).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
                      pathname === item.href
                        ? "border border-[rgba(0,158,167,0.22)] bg-[rgba(0,158,167,0.10)] text-[#0B3E9F] shadow-sm"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#00173C]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="border-t border-[#DCE7F3] p-4">
            <div className="mb-4 rounded-2xl border border-[#DCE7F3] bg-[#F8FAFC] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Signed in</p>
              <p className="mt-1 truncate text-sm font-bold text-[#00173C]">{userLabel || "VenturePack user"}</p>
            </div>
            <button
              type="button"
              onClick={clearDemoData}
              className="w-full rounded-xl border border-[#DCE7F3] px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[rgba(0,158,167,0.10)] hover:text-[#00173C]"
            >
              Clear demo data
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-3 w-full rounded-xl bg-[#00173C] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0B3E9F] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)]"
            >
              Sign out
            </button>
            <p className="mt-3 text-xs leading-5 text-[#64748B]">
              Resets local onboarding answers and returns to the preparation form.
            </p>
          </div>
        </aside>
        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="mb-5 lg:hidden">
            <button
              type="button"
              onClick={clearDemoData}
              className="w-full rounded-md border border-[#DCE7F3] bg-white px-3 py-2 text-sm font-semibold text-[#00173C]"
            >
              Clear demo data
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
