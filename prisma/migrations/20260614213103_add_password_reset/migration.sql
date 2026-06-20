/*
  Warnings:

  - You are about to drop the column `preparationProfile` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `preparationProfile` on the `Matter` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- DropIndex
DROP INDEX "Source_jurisdiction_idx";

-- DropIndex
DROP INDEX "Source_subjectArea_idx";

-- DropIndex
DROP INDEX "Source_supersededStatus_idx";

-- DropIndex
DROP INDEX "Source_activeStatus_idx";

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "companyId" TEXT,
    "matterId" TEXT,
    "userQuestion" TEXT,
    "riskClassification" TEXT,
    "promptTemplateVersion" TEXT,
    "modelProvider" TEXT,
    "modelName" TEXT,
    "generatedAnswer" TEXT,
    "validationResult" TEXT,
    "userFeedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIInteraction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIInteractionSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aiInteractionId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    CONSTRAINT "AIInteractionSource_aiInteractionId_fkey" FOREIGN KEY ("aiInteractionId") REFERENCES "AIInteraction" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AIInteractionSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AttorneyMatchRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "legalSubjectArea" TEXT,
    "jurisdiction" TEXT,
    "companyStage" TEXT,
    "matterUrgency" TEXT,
    "preferredPricingStructure" TEXT,
    "estimatedBudget" TEXT,
    "preferredCommunicationMethod" TEXT,
    "languagePreferences" TEXT,
    "virtualOrLocal" TEXT,
    "alreadyHasCounsel" BOOLEAN NOT NULL DEFAULT false,
    "consentToShareSummary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AttorneyMatchRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AttorneyMatchRequest" ("alreadyHasCounsel", "companyId", "companyStage", "consentToShareSummary", "createdAt", "estimatedBudget", "id", "jurisdiction", "languagePreferences", "legalSubjectArea", "matterUrgency", "preferredCommunicationMethod", "preferredPricingStructure", "status", "updatedAt", "virtualOrLocal") SELECT coalesce("alreadyHasCounsel", false) AS "alreadyHasCounsel", "companyId", "companyStage", "consentToShareSummary", "createdAt", "estimatedBudget", "id", "jurisdiction", "languagePreferences", "legalSubjectArea", "matterUrgency", "preferredCommunicationMethod", "preferredPricingStructure", "status", "updatedAt", "virtualOrLocal" FROM "AttorneyMatchRequest";
DROP TABLE "AttorneyMatchRequest";
ALTER TABLE "new_AttorneyMatchRequest" RENAME TO "AttorneyMatchRequest";
CREATE TABLE "new_AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "companyId" TEXT,
    "action" TEXT NOT NULL,
    "affectedRecord" TEXT,
    "reason" TEXT,
    "result" TEXT,
    "deviceOrSessionInformation" TEXT,
    "administrativeAccessJustification" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuditEvent" ("action", "actorId", "affectedRecord", "createdAt", "id", "reason", "result") SELECT "action", "actorId", "affectedRecord", "createdAt", "id", "reason", "result" FROM "AuditEvent";
DROP TABLE "AuditEvent";
ALTER TABLE "new_AuditEvent" RENAME TO "AuditEvent";
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "companyName" TEXT,
    "proposedCompanyName" TEXT,
    "businessDescription" TEXT,
    "productDescription" TEXT,
    "developmentStage" TEXT,
    "revenueStatus" TEXT,
    "primaryOperatingLocation" TEXT,
    "expectedCustomerLocations" TEXT,
    "existingEntityStatus" TEXT,
    "entityType" TEXT,
    "formationState" TEXT,
    "operatesOutsideUS" BOOLEAN NOT NULL DEFAULT false,
    "regulatedIndustry" BOOLEAN NOT NULL DEFAULT false,
    "customersExist" BOOLEAN NOT NULL DEFAULT false,
    "writtenCustomerAgreements" BOOLEAN NOT NULL DEFAULT false,
    "contractorsUsed" BOOLEAN NOT NULL DEFAULT false,
    "employeesUsed" BOOLEAN NOT NULL DEFAULT false,
    "ipInvolved" BOOLEAN NOT NULL DEFAULT false,
    "personalInfoCollected" BOOLEAN NOT NULL DEFAULT false,
    "privacyPolicyExists" BOOLEAN NOT NULL DEFAULT false,
    "expectsToRaiseMoney" TEXT,
    "moneyAlreadyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "investorsPromisedOwnership" BOOLEAN NOT NULL DEFAULT false,
    "convertibleInstruments" BOOLEAN NOT NULL DEFAULT false,
    "pitchCompetitionApproaching" TEXT,
    "investorMeetingScheduled" BOOLEAN NOT NULL DEFAULT false,
    "dataRoomExists" BOOLEAN NOT NULL DEFAULT false,
    "outsideCounselExists" BOOLEAN NOT NULL DEFAULT false,
    "primaryPreparationReason" TEXT,
    "founderQuestions" TEXT,
    "knownDeadlines" TEXT,
    "documentsAvailable" TEXT,
    "unresolvedDecisions" TEXT,
    "preferredAttorneyLocation" TEXT,
    "approximateLegalBudget" TEXT,
    "preferredCommunication" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("businessDescription", "companyName", "createdAt", "developmentStage", "entityType", "existingEntityStatus", "expectedCustomerLocations", "formationState", "id", "operatesOutsideUS", "ownerId", "primaryOperatingLocation", "productDescription", "proposedCompanyName", "regulatedIndustry", "revenueStatus", "updatedAt") SELECT "businessDescription", "companyName", "createdAt", "developmentStage", "entityType", "existingEntityStatus", "expectedCustomerLocations", "formationState", "id", coalesce("operatesOutsideUS", false) AS "operatesOutsideUS", "ownerId", "primaryOperatingLocation", "productDescription", "proposedCompanyName", coalesce("regulatedIndustry", false) AS "regulatedIndustry", "revenueStatus", "updatedAt" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE TABLE "new_CompanyRelationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "relationshipType" TEXT,
    "contributionDescription" TEXT,
    "ownershipDiscussed" BOOLEAN NOT NULL DEFAULT false,
    "ownershipWrittenDown" BOOLEAN NOT NULL DEFAULT false,
    "confirmationStatus" TEXT,
    "sourceOfInformation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CompanyRelationship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanyRelationship_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CompanyRelationship" ("companyId", "confirmationStatus", "contributionDescription", "createdAt", "id", "ownershipDiscussed", "ownershipWrittenDown", "personId", "relationshipType", "sourceOfInformation", "updatedAt") SELECT "companyId", "confirmationStatus", "contributionDescription", "createdAt", "id", coalesce("ownershipDiscussed", false) AS "ownershipDiscussed", coalesce("ownershipWrittenDown", false) AS "ownershipWrittenDown", "personId", "relationshipType", "sourceOfInformation", "updatedAt" FROM "CompanyRelationship";
DROP TABLE "CompanyRelationship";
ALTER TABLE "new_CompanyRelationship" RENAME TO "CompanyRelationship";
CREATE TABLE "new_CounselPacket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "matterId" TEXT,
    "packetVersion" TEXT NOT NULL DEFAULT 'v1',
    "founderApprovalStatus" TEXT NOT NULL DEFAULT 'not_approved',
    "includedInformation" TEXT,
    "generatedContent" TEXT,
    "generatedAt" DATETIME,
    "downloadedAt" DATETIME,
    "sharingHistory" TEXT,
    "expirationDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CounselPacket_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CounselPacket_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CounselPacket" ("companyId", "createdAt", "downloadedAt", "founderApprovalStatus", "generatedAt", "generatedContent", "id", "includedInformation", "matterId", "packetVersion", "updatedAt") SELECT "companyId", "createdAt", "downloadedAt", "founderApprovalStatus", "generatedAt", "generatedContent", "id", "includedInformation", "matterId", "packetVersion", "updatedAt" FROM "CounselPacket";
DROP TABLE "CounselPacket";
ALTER TABLE "new_CounselPacket" RENAME TO "CounselPacket";
CREATE TABLE "new_Matter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "matterType" TEXT,
    "description" TEXT,
    "riskLevel" TEXT,
    "jurisdiction" TEXT,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "founderObjective" TEXT,
    "relevantPeople" TEXT,
    "relatedDocuments" TEXT,
    "openQuestions" TEXT,
    "missingInformation" TEXT,
    "recommendedNextStep" TEXT,
    "counselRecommendation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Matter_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Matter" ("companyId", "counselRecommendation", "createdAt", "deadline", "description", "founderObjective", "id", "jurisdiction", "matterType", "missingInformation", "openQuestions", "recommendedNextStep", "relatedDocuments", "relevantPeople", "riskLevel", "status", "title", "updatedAt") SELECT "companyId", "counselRecommendation", "createdAt", "deadline", "description", "founderObjective", "id", "jurisdiction", "matterType", "missingInformation", "openQuestions", "recommendedNextStep", "relatedDocuments", "relevantPeople", "riskLevel", "status", "title", "updatedAt" FROM "Matter";
DROP TABLE "Matter";
ALTER TABLE "new_Matter" RENAME TO "Matter";
CREATE TABLE "new_Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Person" ("createdAt", "email", "id", "name", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "role", "updatedAt" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE TABLE "new_PreparationTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completionStatus" TEXT NOT NULL DEFAULT 'not_started',
    "urgency" TEXT,
    "requiredInformation" TEXT,
    "founderAction" TEXT,
    "counselReviewSuggested" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL DEFAULT 'system',
    "completionEvidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PreparationTask_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PreparationTask" ("category", "companyId", "completionEvidence", "completionStatus", "counselReviewSuggested", "createdAt", "createdBy", "description", "founderAction", "id", "requiredInformation", "updatedAt", "urgency") SELECT "category", "companyId", "completionEvidence", "completionStatus", "counselReviewSuggested", "createdAt", coalesce("createdBy", 'system') AS "createdBy", "description", "founderAction", "id", "requiredInformation", "updatedAt", "urgency" FROM "PreparationTask";
DROP TABLE "PreparationTask";
ALTER TABLE "new_PreparationTask" RENAME TO "PreparationTask";
CREATE TABLE "new_RiskRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "triggerKeywords" TEXT,
    "subjectArea" TEXT,
    "recommendedBehavior" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RiskRule" ("active", "createdAt", "id", "level", "name", "recommendedBehavior", "subjectArea", "triggerKeywords", "updatedAt") SELECT "active", "createdAt", "id", "level", "name", "recommendedBehavior", "subjectArea", "triggerKeywords", "updatedAt" FROM "RiskRule";
DROP TABLE "RiskRule";
ALTER TABLE "new_RiskRule" RENAME TO "RiskRule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "AIInteractionSource_aiInteractionId_sourceId_key" ON "AIInteractionSource"("aiInteractionId", "sourceId");
