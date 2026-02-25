-- AlterTable
ALTER TABLE "Egress" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egress" ADD CONSTRAINT "Egress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
