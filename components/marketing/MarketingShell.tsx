import { MarketingFooter } from "./MarketingFooter";
import { MarketingHeader } from "./MarketingHeader";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#00173C]">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </main>
  );
}
