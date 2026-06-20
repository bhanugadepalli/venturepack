import type { Matter } from "@/src/types/matter";

export async function fetchMatters(): Promise<Matter[]> {
  const response = await fetch("/api/matters", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { matters: Matter[] };
  return payload.matters;
}

export async function createMatter(input: Omit<Matter, "id" | "createdAt">): Promise<Matter> {
  const response = await fetch("/api/matters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Unable to save matter.");
  }

  const payload = (await response.json()) as { matter: Matter };
  return payload.matter;
}
