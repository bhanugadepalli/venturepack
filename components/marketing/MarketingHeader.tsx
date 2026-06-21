import Link from "next/link";
import { VenturePackLogo } from "@/components/VenturePackLogo";

const productLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/features", label: "Features" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/security", label: "Security" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export function MarketingHeader() {
  return (
    <header className="border-b border-[#DCE7F3] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:px-8 md:py-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link href="/" className="flex shrink-0 rounded-xl p-1 hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[rgba(0,158,167,0.28)]">
            <VenturePackLogo
              width={520}
              height={180}
              priority
              className="h-20 w-auto max-w-[72vw] sm:h-24 md:h-32 lg:h-36"
            />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#00173C] hover:bg-[#F8FAFC]">
              Sign In
            </Link>
            <Link href="/signup" className="rounded-xl bg-[#0B3E9F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00173C] focus:outline-none focus:ring-4 focus:ring-[rgba(0,158,167,0.24)]">
              Start Preparing
            </Link>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#64748B]">
          {productLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#00173C]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
