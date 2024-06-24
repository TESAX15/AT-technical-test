/*
  Warnings:

  - The values [Test] on the enum `userRole` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `orderStatus` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled');

-- AlterEnum
BEGIN;
CREATE TYPE "userRole_new" AS ENUM ('NonAdmin', 'Admin');
ALTER TABLE "User" ALTER COLUMN "userRole" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "userRole" TYPE "userRole_new" USING ("userRole"::text::"userRole_new");
ALTER TYPE "userRole" RENAME TO "userRole_old";
ALTER TYPE "userRole_new" RENAME TO "userRole";
DROP TYPE "userRole_old";
ALTER TABLE "User" ALTER COLUMN "userRole" SET DEFAULT 'NonAdmin';
COMMIT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderStatus",
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL;
