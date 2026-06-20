import type { AttorneyMatchRequest } from "@/src/types/attorneyMatch";

export async function fetchAttorneyMatchRequest(): Promise<AttorneyMatchRequest | null> {
  const response = await fetch("/api/attorney-match", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { request: AttorneyMatchRequest | null };
  return payload.request;
}

export async function saveAttorneyMatchRequestToApi(
  request: AttorneyMatchRequest,
): Promise<AttorneyMatchRequest> {
  const response = await fetch("/api/attorney-match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Unable to save attorney match request.");
  }

  const payload = (await response.json()) as { request: AttorneyMatchRequest };
  return payload.request;
}
