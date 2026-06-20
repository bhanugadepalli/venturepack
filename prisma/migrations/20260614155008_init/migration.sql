-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authStatus" TEXT NOT NULL DEFAULT 'pending',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "accountStatus" TEXT NOT NULL DEFAULT 'active',
    "termsAcceptedVersion" TEXT,
    "privacyAcceptedVersion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "companyName" TEXT,
    "proposedCompanyName" TEXT,
    "businessDescription" TEXT,
    "productDescription" TEXT,
    "developmentStage" TEXT,
    "revenueStatus" TEXT,
    "primaryOperatingLocation" TEXT,
    "expectedCustomerLocations" JSONB,
    "existingEntityStatus" TEXT,
    "entityType" TEXT,
    "formationState" TEXT,
    "operatesOutsideUS" BOOLEAN,
    "regulatedIndustry" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyRelationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "contributionDescription" TEXT,
    "ownershipDiscussed" BOOLEAN,
    "ownershipWrittenDown" BOOLEAN,
    "confirmationStatus" TEXT,
    "sourceOfInformation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CompanyRelationship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanyRelationship_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PreparationTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completionStatus" TEXT NOT NULL DEFAULT 'not_started',
    "urgency" TEXT,
    "requiredInformation" JSONB,
    "founderAction" TEXT,
    "counselReviewSuggested" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "completionEvidence" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PreparationTask_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Matter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "matterType" TEXT NOT NULL,
    "description" TEXT,
    "riskLevel" TEXT,
    "jurisdiction" TEXT,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "founderObjective" TEXT,
    "relevantPeople" JSONB,
    "relatedDocuments" JSONB,
    "openQuestions" JSONB,
    "missingInformation" JSONB,
    "recommendedNextStep" TEXT,
    "counselRecommendation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Matter_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CounselPacket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "matterId" TEXT,
    "packetVersion" TEXT NOT NULL DEFAULT '1',
    "founderApprovalStatus" TEXT NOT NULL DEFAULT 'draft',
    "includedInformation" JSONB,
    "generatedContent" JSONB,
    "generatedAt" DATETIME,
    "downloadedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CounselPacket_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CounselPacket_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttorneyMatchRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "legalSubjectArea" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "companyStage" TEXT,
    "matterUrgency" TEXT,
    "preferredPricingStructure" TEXT,
    "estimatedBudget" TEXT,
    "preferredCommunicationMethod" TEXT,
    "languagePreferences" TEXT,
    "virtualOrLocal" TEXT,
    "alreadyHasCounsel" BOOLEAN,
    "consentToShareSummary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AttorneyMatchRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "affectedRecord" TEXT,
    "reason" TEXT,
    "result" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Company_ownerId_idx" ON "Company"("ownerId");

-- CreateIndex
CREATE INDEX "CompanyRelationship_companyId_idx" ON "CompanyRelationship"("companyId");

-- CreateIndex
CREATE INDEX "CompanyRelationship_personId_idx" ON "CompanyRelationship"("personId");

-- CreateIndex
CREATE INDEX "PreparationTask_companyId_idx" ON "PreparationTask"("companyId");

-- CreateIndex
CREATE INDEX "PreparationTask_category_idx" ON "PreparationTask"("category");

-- CreateIndex
CREATE INDEX "Matter_companyId_idx" ON "Matter"("companyId");

-- CreateIndex
CREATE INDEX "Matter_matterType_idx" ON "Matter"("matterType");

-- CreateIndex
CREATE INDEX "Matter_status_idx" ON "Matter"("status");

-- CreateIndex
CREATE INDEX "CounselPacket_companyId_idx" ON "CounselPacket"("companyId");

-- CreateIndex
CREATE INDEX "CounselPacket_matterId_idx" ON "CounselPacket"("matterId");

-- CreateIndex
CREATE INDEX "AttorneyMatchRequest_companyId_idx" ON "AttorneyMatchRequest"("companyId");

-- CreateIndex
CREATE INDEX "AttorneyMatchRequest_status_idx" ON "AttorneyMatchRequest"("status");

-- CreateIndex
CREATE INDEX "AuditEvent_actorId_idx" ON "AuditEvent"("actorId");

-- CreateIndex
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent"("action");
