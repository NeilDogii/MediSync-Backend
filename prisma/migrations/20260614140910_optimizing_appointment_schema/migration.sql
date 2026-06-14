/*
  Warnings:

  - You are about to drop the `AppointmentRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AppointmentRequest" DROP CONSTRAINT "AppointmentRequest_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentRequest" DROP CONSTRAINT "AppointmentRequest_patientId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "isRequest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestStatus" "AppointmentRequestStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "AppointmentRequest";
