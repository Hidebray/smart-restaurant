-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "assigned_waiter_id" TEXT;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_assigned_waiter_id_fkey" FOREIGN KEY ("assigned_waiter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
