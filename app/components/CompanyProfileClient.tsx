"use client";

import { useEffect, useState } from "react";
import { fetchCompanyProfile } from "@/src/lib/companyApi";
import type { CompanyProfile } from "@/src/types/company";
import { EmptyState } from "./EmptyState";
import { InfoCard } from "./InfoCard";
import { Badge, Button } from "./ui";

function valueOrBadge(value: string) {
  return value ? <span>{value}</span> : <Badge tone="amber">Missing</Badge>;
}

export function CompanyProfileClient() {
  const [data, setData] = useState<CompanyProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      fetchCompanyProfile()
        .then(setData)
        .finally(() => setLoaded(true));
    });
  }, []);

  if (!loaded) {
    return <div className="h-48 rounded-lg border border-[#DCE7F3] bg-white" />;
  }

  if (!data) {
    return <EmptyState title="Complete onboarding to create your company preparation workspace." />;
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button href="/app/onboarding">Edit onboarding</Button>
      </div>
      <section className="grid gap-5 lg:grid-cols-3">
      <InfoCard title="Company basics" accent>
        <p>Name: {valueOrBadge(data.companyName)}</p>
        <p>Entity status: {valueOrBadge(data.entityStatus)}</p>
        <p>Entity type: {valueOrBadge(data.entityType)}</p>
        <p>Operating location: {valueOrBadge(data.formationLocation)}</p>
        <p>Expected customer locations: {valueOrBadge(data.expectedCustomerLocations)}</p>
        <p>Development stage: {valueOrBadge(data.developmentStage)}</p>
        <p>Revenue status: {valueOrBadge(data.revenueStatus)}</p>
        <p className="mt-3">{data.businessDescription || "No business description submitted."}</p>
        <p className="mt-3">{data.productOrService || "No product or service notes submitted."}</p>
      </InfoCard>
      <InfoCard title="Founder information">
        <p>Founders: {valueOrBadge(data.founderNames)}</p>
        <p>Roles: {valueOrBadge(data.founderRoles)}</p>
        <p>Other founders: {valueOrBadge(data.otherFounders)}</p>
        <p>Ownership discussed: {valueOrBadge(data.ownershipDiscussed)}</p>
        <p>Ownership written down: {valueOrBadge(data.ownershipWrittenDown)}</p>
      </InfoCard>
      <InfoCard title="Ownership information">{data.ownershipSummary || "No ownership notes submitted."}</InfoCard>
      <InfoCard title="Intellectual property">{data.ipSummary || "No intellectual property notes submitted."}</InfoCard>
      <InfoCard title="Contractors and employees">
        <p>Contractors used: {data.contractorsUsed || "Not provided"}</p>
        <p className="mt-3">{data.contractorsSummary || "No contributor notes submitted."}</p>
      </InfoCard>
      <InfoCard title="Customer activity">
        <p>Customers exist: {data.customersExist || "Not provided"}</p>
        <p className="mt-3">{data.customerActivity || "No customer activity submitted."}</p>
      </InfoCard>
      <InfoCard title="Privacy and data practices">
        <p>Personal information collected: {data.personalInformationCollected || "Not provided"}</p>
        <p>Regulated industry: {data.regulatedIndustry || "Not provided"}</p>
        <p>Operates outside US: {data.operatesOutsideUs || "Not provided"}</p>
        <p className="mt-3">{data.dataPractices || "No data practice notes submitted."}</p>
      </InfoCard>
      <InfoCard title="Fundraising preparation">
        <p>Expects to raise: {data.expectsToRaise || "Not provided"}</p>
        <p>Money already accepted: {data.moneyAlreadyAccepted || "Not provided"}</p>
        <p>Investor meeting scheduled: {data.investorMeetingScheduled || "Not provided"}</p>
        <p>Target: {data.fundraisingTarget || "Not provided"}</p>
        <p>Investor conversations: {data.investorConversations || "Not provided"}</p>
        <p>Materials: {data.fundraisingMaterials || "Not provided"}</p>
        <p>Timeline: {data.fundraisingTimeline || "Not provided"}</p>
      </InfoCard>
      <InfoCard title="Corporate records">{data.documentInventory || "No document inventory submitted."}</InfoCard>
      <InfoCard title="Counsel preparation">
        <p>Outside counsel exists: {data.outsideCounselExists || "Not provided"}</p>
        <p>Primary reason: {data.priorityMatter || "Not provided"}</p>
        <p>Deadline: {data.deadline || "Not provided"}</p>
        <p>Budget: {data.legalBudget || "Not provided"}</p>
        <p>Communication format: {data.communicationFormat || "Not provided"}</p>
        <p className="mt-3">Questions: {data.counselQuestions || "No questions submitted."}</p>
      </InfoCard>
      </section>
    </>
  );
}
