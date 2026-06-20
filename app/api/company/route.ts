import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { normalizeCompanyProfile, stringToBoolean } from "@/src/lib/companyProfileMapper";
import type { CompanyProfile } from "@/src/types/company";

function profileFromCompany(company: {
  companyName: string | null;
  businessDescription: string | null;
  productDescription: string | null;
  developmentStage: string | null;
  revenueStatus: string | null;
  primaryOperatingLocation: string | null;
  expectedCustomerLocations: string | null;
  existingEntityStatus: string | null;
  entityType: string | null;
  operatesOutsideUS: boolean;
  regulatedIndustry: boolean;
  customersExist: boolean;
  contractorsUsed: boolean;
  personalInfoCollected: boolean;
  expectsToRaiseMoney: string | null;
  moneyAlreadyAccepted: boolean;
  investorMeetingScheduled: boolean;
  outsideCounselExists: boolean;
  primaryPreparationReason: string | null;
  founderQuestions: string | null;
  knownDeadlines: string | null;
  documentsAvailable: string | null;
  approximateLegalBudget: string | null;
  preferredCommunication: string | null;
  updatedAt: Date;
}): CompanyProfile {
  return normalizeCompanyProfile({
    companyName: company.companyName ?? "",
    businessDescription: company.businessDescription ?? "",
    productOrService: company.productDescription ?? "",
    developmentStage: company.developmentStage ?? "",
    revenueStatus: company.revenueStatus ?? "",
    formationLocation: company.primaryOperatingLocation ?? "",
    expectedCustomerLocations: company.expectedCustomerLocations ?? "",
    entityStatus: company.existingEntityStatus ?? "",
    entityType: company.entityType ?? "",
    operatesOutsideUs: company.operatesOutsideUS ? "Yes" : "No",
    regulatedIndustry: company.regulatedIndustry ? "Yes" : "No",
    customersExist: company.customersExist ? "Yes" : "No",
    contractorsUsed: company.contractorsUsed ? "Yes" : "No",
    personalInformationCollected: company.personalInfoCollected ? "Yes" : "No",
    expectsToRaise: company.expectsToRaiseMoney ?? "",
    moneyAlreadyAccepted: company.moneyAlreadyAccepted ? "Yes" : "No",
    investorMeetingScheduled: company.investorMeetingScheduled ? "Yes" : "No",
    outsideCounselExists: company.outsideCounselExists ? "Yes" : "No",
    priorityMatter: company.primaryPreparationReason ?? "",
    counselQuestions: company.founderQuestions ?? "",
    deadline: company.knownDeadlines ?? "",
    documentInventory: company.documentsAvailable ?? "",
    legalBudget: company.approximateLegalBudget ?? "",
    communicationFormat: company.preferredCommunication ?? "",
    submittedAt: company.updatedAt.toISOString(),
  });
}

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Authentication required.",
    },
    { status: 401 },
  );
}

export async function GET() {
  try {
    const ownerId = await getAuthenticatedUserId();

    if (!ownerId) {
      return unauthorizedResponse();
    }

    const company = await prisma.company.findFirst({
      where: { ownerId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      company: company ? profileFromCompany(company) : null,
    });
  } catch {
    return NextResponse.json(
      {
        company: null,
        error: "Unable to load company workspace.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const ownerId = await getAuthenticatedUserId();

    if (!ownerId) {
      return unauthorizedResponse();
    }

    const profile = normalizeCompanyProfile(await request.json());
    const submittedProfile = {
      ...profile,
      submittedAt: profile.submittedAt || new Date().toISOString(),
    };
    const existingCompany = await prisma.company.findFirst({
      where: { ownerId },
      orderBy: { updatedAt: "desc" },
    });
    const data = {
      ownerId,
      companyName: submittedProfile.companyName || null,
      proposedCompanyName: submittedProfile.companyName || null,
      businessDescription: submittedProfile.businessDescription || null,
      productDescription: submittedProfile.productOrService || null,
      developmentStage: submittedProfile.developmentStage || null,
      revenueStatus: submittedProfile.revenueStatus || null,
      primaryOperatingLocation: submittedProfile.formationLocation || null,
      expectedCustomerLocations: submittedProfile.expectedCustomerLocations || null,
      existingEntityStatus: submittedProfile.entityStatus || null,
      entityType: submittedProfile.entityType || null,
      formationState: submittedProfile.formationLocation || null,
      operatesOutsideUS: stringToBoolean(submittedProfile.operatesOutsideUs) ?? false,
      regulatedIndustry: stringToBoolean(submittedProfile.regulatedIndustry) ?? false,
      customersExist: stringToBoolean(submittedProfile.customersExist) ?? false,
      contractorsUsed: stringToBoolean(submittedProfile.contractorsUsed) ?? false,
      ipInvolved: Boolean(submittedProfile.ipSummary.trim()),
      personalInfoCollected: stringToBoolean(submittedProfile.personalInformationCollected) ?? false,
      expectsToRaiseMoney: submittedProfile.expectsToRaise || null,
      moneyAlreadyAccepted: stringToBoolean(submittedProfile.moneyAlreadyAccepted) ?? false,
      investorMeetingScheduled: stringToBoolean(submittedProfile.investorMeetingScheduled) ?? false,
      outsideCounselExists: stringToBoolean(submittedProfile.outsideCounselExists) ?? false,
      primaryPreparationReason: submittedProfile.priorityMatter || null,
      founderQuestions: submittedProfile.counselQuestions || submittedProfile.founderQuestions || null,
      knownDeadlines: submittedProfile.deadline || null,
      documentsAvailable: submittedProfile.documentInventory || null,
      approximateLegalBudget: submittedProfile.legalBudget || null,
      preferredCommunication: submittedProfile.communicationFormat || null,
    };
    const company = existingCompany
      ? await prisma.company.update({
          where: { id: existingCompany.id },
          data,
        })
      : await prisma.company.create({
          data,
        });

    return NextResponse.json({
      company: profileFromCompany(company),
    });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to save company workspace.",
      },
      { status: 500 },
    );
  }
}
