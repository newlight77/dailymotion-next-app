/*
  Warnings:

  - Made the column `thumbnailFilename` on table `Anime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Anime" ALTER COLUMN "thumbnailFilename" SET NOT NULL;

-- CreateTable
CREATE TABLE "WatchListCollection" (
    "uid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchListCollection_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "WatchList" (
    "uid" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchList_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "WatchListItem" (
    "uid" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchListItem_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE INDEX "WatchList_collectionId_idx" ON "WatchList"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchListItem_listId_animeId_key" ON "WatchListItem"("listId", "animeId");

-- AddForeignKey
ALTER TABLE "WatchList" ADD CONSTRAINT "WatchList_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "WatchListCollection"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchListItem" ADD CONSTRAINT "WatchListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "WatchList"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchListItem" ADD CONSTRAINT "WatchListItem_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
