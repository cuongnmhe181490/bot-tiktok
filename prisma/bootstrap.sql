-- CreateTable
CREATE TABLE "ScoringSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'scoring-default',
    "easeWeight" INTEGER NOT NULL DEFAULT 20,
    "competitionWeight" INTEGER NOT NULL DEFAULT 20,
    "saturationWeight" INTEGER NOT NULL DEFAULT 15,
    "offerWeight" INTEGER NOT NULL DEFAULT 25,
    "commissionWeight" INTEGER NOT NULL DEFAULT 20,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "originalPrice" REAL NOT NULL,
    "salePrice" REAL NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "commissionPercent" REAL NOT NULL,
    "estimatedCommission" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "shopName" TEXT NOT NULL,
    "voucher" TEXT,
    "freeship" BOOLEAN NOT NULL DEFAULT false,
    "importedAt" DATETIME NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "internalNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'MOI',
    "totalScore" INTEGER NOT NULL,
    "easeOfFilming" INTEGER NOT NULL,
    "competitionLevel" INTEGER NOT NULL,
    "saturationLevel" INTEGER NOT NULL,
    "offerAttractiveness" INTEGER NOT NULL,
    "scoreBreakdown" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Trend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "trendType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suitableNiche" TEXT NOT NULL,
    "referenceUrl" TEXT,
    "heatLevel" INTEGER NOT NULL,
    "applicability" INTEGER NOT NULL,
    "saturationLevel" INTEGER NOT NULL,
    "discoveredAt" DATETIME NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ScriptTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ScriptDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "painPoints" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "notes" TEXT,
    "tone" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "hooks" TEXT NOT NULL,
    "angles" TEXT NOT NULL,
    "voiceOvers" TEXT NOT NULL,
    "shotLists" TEXT NOT NULL,
    "captions" TEXT NOT NULL,
    "ctas" TEXT NOT NULL,
    "teleprompter" TEXT NOT NULL,
    "subtitleReady" TEXT NOT NULL,
    "safetyCheck" TEXT NOT NULL,
    "bestVersion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    "templateId" TEXT,
    CONSTRAINT "ScriptDraft_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScriptDraft_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ScriptTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DraftProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "rawScript" TEXT NOT NULL,
    "splitScript" TEXT NOT NULL,
    "suggestedTiming" TEXT NOT NULL,
    "sceneSuggestions" TEXT NOT NULL,
    "overlayTexts" TEXT NOT NULL,
    "shootingChecklist" TEXT NOT NULL,
    "editingChecklist" TEXT NOT NULL,
    "scriptTxt" TEXT NOT NULL,
    "subtitleSrt" TEXT NOT NULL,
    "shotlistMd" TEXT NOT NULL,
    "checklistMd" TEXT NOT NULL,
    "metadataJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VideoPerformance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "angle" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "captionType" TEXT NOT NULL,
    "ctaType" TEXT NOT NULL,
    "note" TEXT,
    "views" INTEGER NOT NULL,
    "avgWatchTime" REAL NOT NULL,
    "completionRate" REAL NOT NULL,
    "clicks" INTEGER NOT NULL,
    "ctr" REAL NOT NULL,
    "orders" INTEGER NOT NULL,
    "revenue" REAL NOT NULL,
    "commission" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NHAP',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    "productGroup" TEXT NOT NULL,
    CONSTRAINT "VideoPerformance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

