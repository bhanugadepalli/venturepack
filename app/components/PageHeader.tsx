export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8 rounded-3xl border border-[#DCE7F3] bg-white p-6 shadow-sm sm:p-7">
      {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#008787]">{eyebrow}</p> : null}
      <h1 className="text-3xl font-bold tracking-tight text-[#00173C] sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-[#64748B]">{description}</p>
    </header>
  );
}
