-- CreateEnum
CREATE TYPE "InvoiceProcessStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "ruc" TEXT NOT NULL,
    "subsidiary" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "stamped" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "cotization" TEXT NOT NULL,
    "totalAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Egress" (
    "id" SERIAL NOT NULL,
    "ruc" TEXT NOT NULL,
    "subsidiary" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "stamped" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "isVirtual" BOOLEAN NOT NULL,
    "notRetain" BOOLEAN NOT NULL,
    "nonDeductibleExpense" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "cotization" TEXT NOT NULL,
    "totalAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Egress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceProcessLog" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "invoiceType" TEXT NOT NULL,
    "receiptNumber" TEXT,
    "status" "InvoiceProcessStatus" NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceProcessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
