import type { AttorneyMatchRequest } from "@/src/types/attorneyMatch";
import type { CompanyProfile } from "@/src/types/company";
import type { Matter } from "@/src/types/matter";

const companyProfileKey = "venturepack:company-profile";
const legacyCompanyProfileKey = "venturepack:onboarding";
const mattersKey = "venturepack:matters";
const attorneyMatchRequestKey = "venturepack:attorney-match-request";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function saveCompanyProfile(profile: CompanyProfile) {
  writeJson(companyProfileKey, profile);
}

export function getCompanyProfile(): CompanyProfile | null {
  return readJson<CompanyProfile>(companyProfileKey) ?? readJson<CompanyProfile>(legacyCompanyProfileKey);
}

export function clearCompanyProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(companyProfileKey);
  window.localStorage.removeItem(legacyCompanyProfileKey);
}

export function saveMatters(matters: Matter[]) {
  writeJson(mattersKey, matters);
}

export function getMatters(): Matter[] {
  return readJson<Matter[]>(mattersKey) ?? [];
}

export function saveAttorneyMatchRequest(request: AttorneyMatchRequest) {
  writeJson(attorneyMatchRequestKey, request);
}

export function getAttorneyMatchRequest(): AttorneyMatchRequest | null {
  return readJson<AttorneyMatchRequest>(attorneyMatchRequestKey);
}
