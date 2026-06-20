-- CreateTable
CREATE TABLE "RiskRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "triggerKeywords" JSONB NOT NULL,
    "subjectArea" TEXT,
    "recommendedBehavior" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "RiskRule_level_idx" ON "RiskRule"("level");

-- CreateIndex
CREATE INDEX "RiskRule_active_idx" ON "RiskRule"("active");

-- CreateIndex
CREATE INDEX "RiskRule_subjectArea_idx" ON "RiskRule"("subjectArea");
