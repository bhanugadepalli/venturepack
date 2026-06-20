import type { CompanyProfile } from "@/src/types/company";

export async function fetchCompanyProfile(): Promise<CompanyProfile | null> {
  const response = await fetch("/api/company", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { company: CompanyProfile | null };
  return payload.company;
}

export async function saveCompanyProfileToApi(profile: CompanyProfile): Promise<CompanyProfile> {
  const response = await fetch("/api/company", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error("Unable to save company workspace.");
  }

  const payload = (await response.json()) as { company: CompanyProfile };
  return payload.company;
}
