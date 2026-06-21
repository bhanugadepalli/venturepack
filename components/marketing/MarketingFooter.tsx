import Link from "next/link";
import { VenturePackLogo } from "@/components/VenturePackLogo";

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { href: "/use-cases", label: "Student founders" },
      { href: "/use-cases", label: "First-time founders" },
      { href: "/use-cases", label: "Accelerators" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/security", label: "Security practices" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#DCE7F3] bg-white px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="inline-flex rounded-xl p-1 hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[rgba(0,158,167,0.28)]">
            <VenturePackLogo width={170} height={46} className="h-9 w-auto" />
          </Link>
          <p className="mt-4 text-sm font-semibold text-[#00173C]">VenturePack</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#64748B]">
            VenturePack is not a law firm and does not provide legal advice.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-bold text-[#00173C]">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#64748B]">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link href={link.href} className="hover:text-[#00173C]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
