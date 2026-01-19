-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "order_count" INTEGER NOT NULL DEFAULT 0;
