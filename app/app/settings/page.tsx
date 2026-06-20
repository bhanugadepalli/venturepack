import { auth } from "@/auth";
import Link from "next/link";
import { DeleteAccountRequestButton } from "../../components/DeleteAccountRequestButton";
import { PageHeader } from "../../components/PageHeader";

const settingsSections = [
  {
    title: "Password and authentication",
    description: "Password changes, multi-factor settings, and sign-in safeguards will be managed here.",
    rows: [
      { label: "Password", value: "Update your password", link: "/app/change-password" },
      { label: "Multi-factor authentication", value: "Not enabled in this MVP", link: null },
    ],
  },
  {
    title: "Active sessions placeholder",
    description: "A future version will show recent sessions and device activity for this account.",
    rows: [{ label: "Session management", value: "Current session controls are limited to sign out", link: null }],
  },
  {
    title: "Data export placeholder",
    description: "A future export will package company preparation data, matters, and packet history.",
    rows: [{ label: "Export format", value: "Structured export workflow coming soon", link: null }],
  },
];

export default async function SettingsPage() {
  const session = await auth();
  const userName = session?.user?.name || "Not provided";
  const userEmail = session?.user?.email || "Not provided";

  return (
    <>
      <PageHeader
        eyebrow="Account settings"
        title="Settings"
        description="Manage account basics, authentication preferences, and future data controls for your VenturePack workspace."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <section className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
            <div className="border-b border-[#DCE7F3] pb-4">
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Your VenturePack account identity for workspace access and future notifications.
              </p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileField label="Name" value={userName} />
              <ProfileField label="Email" value={userEmail} />
            </div>
          </section>

          {settingsSections.map((section) => (
            <section key={section.title} className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
              <div className="border-b border-[#DCE7F3] pb-4">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{section.description}</p>
              </div>
              <div className="mt-5 grid gap-3">
                {section.rows.map(({ label, value, link }) => (
                  <div key={label}>
                    {link ? (
                      <Link href={link} className="block rounded-md border border-[#DCE7F3] bg-[#F8FAFC] p-4 hover:bg-[rgba(0,158,167,0.10)] transition-colors">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
                        <p className="mt-1 break-words text-sm font-semibold text-[#008787]">{value} →</p>
                      </Link>
                    ) : (
                      <ProfileField label={label} value={value} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-[#DCE7F3] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Account deletion request placeholder</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              This MVP records the request state in the interface only. No account or workspace data is deleted.
            </p>
            <div className="mt-5">
              <DeleteAccountRequestButton />
            </div>
          </section>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            Account deletion will later include a recovery period and backup expiration schedule.
          </div>
        </aside>
      </div>
    </>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#DCE7F3] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#00173C]">{value}</p>
    </div>
  );
}
