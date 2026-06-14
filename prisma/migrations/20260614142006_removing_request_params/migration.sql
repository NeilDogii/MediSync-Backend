/*
  Warnings:

  - You are about to drop the column `isRequest` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `requestStatus` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "isRequest",
DROP COLUMN "requestStatus";

-- DropEnum
DROP TYPE "AppointmentRequestStatus";
