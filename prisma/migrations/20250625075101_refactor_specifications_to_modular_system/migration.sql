/*
  Warnings:

  - You are about to drop the `product_specifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specification_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_specifications" DROP CONSTRAINT "product_specifications_productId_fkey";

-- DropForeignKey
ALTER TABLE "specification_templates" DROP CONSTRAINT "specification_templates_categoryId_fkey";

-- DropTable
DROP TABLE "product_specifications";

-- DropTable
DROP TABLE "specification_templates";

-- CreateTable
CREATE TABLE "specifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "type" TEXT NOT NULL,
    "options" TEXT[],
    "icon" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_specifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "categoryId" UUID NOT NULL,
    "specificationId" UUID NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "category_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specification_values" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "specificationId" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_specification_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specifications_name_key" ON "specifications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "specifications_key_key" ON "specifications"("key");

-- CreateIndex
CREATE INDEX "specifications_isActive_idx" ON "specifications"("isActive");

-- CreateIndex
CREATE INDEX "specifications_category_idx" ON "specifications"("category");

-- CreateIndex
CREATE INDEX "specifications_type_idx" ON "specifications"("type");

-- CreateIndex
CREATE INDEX "category_specifications_categoryId_idx" ON "category_specifications"("categoryId");

-- CreateIndex
CREATE INDEX "category_specifications_specificationId_idx" ON "category_specifications"("specificationId");

-- CreateIndex
CREATE INDEX "category_specifications_sortOrder_idx" ON "category_specifications"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "category_specifications_categoryId_specificationId_key" ON "category_specifications"("categoryId", "specificationId");

-- CreateIndex
CREATE INDEX "product_specification_values_productId_idx" ON "product_specification_values"("productId");

-- CreateIndex
CREATE INDEX "product_specification_values_specificationId_idx" ON "product_specification_values"("specificationId");

-- CreateIndex
CREATE UNIQUE INDEX "product_specification_values_productId_specificationId_key" ON "product_specification_values"("productId", "specificationId");

-- AddForeignKey
ALTER TABLE "category_specifications" ADD CONSTRAINT "category_specifications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_specifications" ADD CONSTRAINT "category_specifications_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "specifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specification_values" ADD CONSTRAINT "product_specification_values_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specification_values" ADD CONSTRAINT "product_specification_values_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "specifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
