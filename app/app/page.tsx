import { DashboardClient } from "../components/DashboardClient";
import { PageHeader } from "../components/PageHeader";
import { auth } from "@/auth";
import { dashboardCopy } from "@/src/content/dashboardCopy";
import { getAdaptiveChecklistDashboardData } from "@/src/lib/adaptiveChecklistDashboard";
import { prisma } from "@/src/lib/prisma";
import type { AdaptiveChecklistDashboardViewData } from "../components/DashboardClient";

const emptyChecklistDashboardData: AdaptiveChecklistDashboardViewData = {
  hasSession: false,
  session: null,
  ventureProgress: 0,
  topMissingFacts: [],
};

async function getChecklistDashboardViewData(): Promise<AdaptiveChecklistDashboardViewData> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return emptyChecklistDashboardData;
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });

  if (!company) {
    return emptyChecklistDashboardData;
  }

  const checklistData = await getAdaptiveChecklistDashboardData({
    userId,
    companyId: company.id,
  });

  if (!checklistData.hasSession || !checklistData.session) {
    return emptyChecklistDashboardData;
  }

  return {
    hasSession: true,
    session: {
      id: checklistData.session.id,
      businessType: checklistData.session.businessType,
      ventureStage: checklistData.session.ventureStage,
      immediateGoal: checklistData.session.immediateGoal,
      teamStatus: checklistData.session.teamStatus,
      timeline: checklistData.session.timeline,
    },
    ventureProgress: checklistData.ventureProgress,
    topMissingFacts: checklistData.topMissingFacts,
  };
}

export default async function DashboardPage() {
  const checklistDashboardData = await getChecklistDashboardViewData();

  return (
    <>
      <PageHeader
        eyebrow={dashboardCopy.preparationWorkspace.eyebrow}
        title={dashboardCopy.preparationWorkspace.title}
        description={dashboardCopy.preparationWorkspace.description}
      />
      <DashboardClient initialChecklistData={checklistDashboardData} />
    </>
  );
}
