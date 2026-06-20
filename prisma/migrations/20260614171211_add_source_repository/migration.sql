-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "publisher" TEXT,
    "authorityLevel" TEXT,
    "jurisdiction" TEXT,
    "subjectArea" TEXT,
    "effectiveDate" DATETIME,
    "lastVerifiedDate" DATETIME,
    "sourceLocation" TEXT,
    "storedExcerpt" TEXT,
    "activeStatus" BOOLEAN NOT NULL DEFAULT true,
    "supersededStatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Source_activeStatus_idx" ON "Source"("activeStatus");

-- CreateIndex
CREATE INDEX "Source_supersededStatus_idx" ON "Source"("supersededStatus");

-- CreateIndex
CREATE INDEX "Source_subjectArea_idx" ON "Source"("subjectArea");

-- CreateIndex
CREATE INDEX "Source_jurisdiction_idx" ON "Source"("jurisdiction");
