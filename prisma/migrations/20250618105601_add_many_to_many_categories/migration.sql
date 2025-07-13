/*
  Warnings:

  - You are about to drop the column `categoryId` on the `subcategories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `subcategories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_categoryId_fkey";

-- DropIndex
DROP INDEX "subcategories_categoryId_idx";

-- DropIndex
DROP INDEX "subcategories_categoryId_slug_key";

-- AlterTable
ALTER TABLE "subcategories" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "category_subcategories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "categoryId" UUID NOT NULL,
    "subcategoryId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "category_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "category_subcategories_categoryId_idx" ON "category_subcategories"("categoryId");

-- CreateIndex
CREATE INDEX "category_subcategories_subcategoryId_idx" ON "category_subcategories"("subcategoryId");

-- CreateIndex
CREATE INDEX "category_subcategories_sortOrder_idx" ON "category_subcategories"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "category_subcategories_categoryId_subcategoryId_key" ON "category_subcategories"("categoryId", "subcategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_slug_key" ON "subcategories"("slug");

-- AddForeignKey
ALTER TABLE "category_subcategories" ADD CONSTRAINT "category_subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_subcategories" ADD CONSTRAINT "category_subcategories_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
