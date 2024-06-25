/*
  Warnings:

  - The `userRole` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('NonAdmin', 'Admin');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userRole",
ADD COLUMN     "userRole" "userRole" NOT NULL DEFAULT 'NonAdmin';
