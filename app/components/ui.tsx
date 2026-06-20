import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
};

const buttonStyles = {
  primary:
    "bg-[#0B3E9F] text-white shadow-sm shadow-[#0B3E9F]/20 hover:bg-[#00173C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(0,158,167,0.24)]",
  secondary: "border border-[#DCE7F3] bg-white text-[#00173C] hover:border-[#009EA7] hover:bg-[#F8FAFC]",
  ghost: "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#00173C]",
  danger: "border border-red-200 bg-white text-[#DC2626] hover:bg-red-50",
};

export function Button({
  children,
  href,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${buttonStyles[variant]} disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`vp-card rounded-2xl p-5 ${className}`}>{children}</section>;
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "indigo" | "green" | "amber" | "red" | "slate";
}) {
  const tones = {
    blue: "bg-[rgba(0,158,167,0.10)] text-[#008787]",
    indigo: "bg-[rgba(0,158,167,0.10)] text-[#008787]",
    green: "bg-[rgba(0,158,167,0.10)] text-[#008787]",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-red-50 text-red-700",
    slate: "bg-[rgba(0,158,167,0.10)] text-[#00173C]",
  };

  return <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 rounded-full bg-[#DCE7F3]">
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-[#0B3E9F] to-[#009EA7]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#008787]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#00173C] sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">{description}</p> : null}
    </div>
  );
}
