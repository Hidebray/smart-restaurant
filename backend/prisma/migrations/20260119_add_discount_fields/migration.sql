-- CreateEnum (if not exists)
DO $$ BEGIN
    CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "orders"
ADD COLUMN IF NOT EXISTS "discount_type" "DiscountType",
ADD COLUMN IF NOT EXISTS "discount_value" DECIMAL(10,2) NOT NULL DEFAULT 0;
