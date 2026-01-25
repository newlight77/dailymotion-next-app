/*
  Warnings:

  - You are about to drop the column `collectionId` on the `WatchList` table. All the data in the column will be lost.
  - You are about to drop the `WatchListCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WatchList" DROP CONSTRAINT "WatchList_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "WatchListCollection" DROP CONSTRAINT "WatchListCollection_ownerId_fkey";

-- DropIndex
DROP INDEX "WatchList_collectionId_idx";

-- AlterTable
ALTER TABLE "WatchList" DROP COLUMN "collectionId";

-- DropTable
DROP TABLE "WatchListCollection";
