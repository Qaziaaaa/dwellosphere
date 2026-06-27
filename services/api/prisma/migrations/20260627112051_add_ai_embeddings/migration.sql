-- AlterTable
ALTER TABLE "Property" ADD COLUMN "embedding" TEXT DEFAULT '[]';

-- CreateTable
CREATE TABLE "UserInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserInteraction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserInteraction_userId_idx" ON "UserInteraction"("userId");

-- CreateIndex
CREATE INDEX "UserInteraction_propertyId_idx" ON "UserInteraction"("propertyId");

-- CreateIndex
CREATE INDEX "UserInteraction_type_idx" ON "UserInteraction"("type");
