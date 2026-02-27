/*
  Warnings:

  - You are about to drop the column `specialty` on the `Doctor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "specialty",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "specialization" "DoctorSpecialty" NOT NULL DEFAULT 'CARDIOLOGY';

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
