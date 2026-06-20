export function InfoCard({
  title,
  children,
  accent = false,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${accent ? "border-[#009EA7]/40 bg-[rgba(0,158,167,0.10)]" : "border-[#DCE7F3] bg-white"}`}>
      <h2 className="text-lg font-bold text-[#00173C]">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-[#64748B]">{children}</div>
    </section>
  );
}
