/*
  Warnings:

  - You are about to drop the `FollowedAnime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FollowedAnime" DROP CONSTRAINT "FollowedAnime_animeId_fkey";

-- DropForeignKey
ALTER TABLE "FollowedAnime" DROP CONSTRAINT "FollowedAnime_userId_fkey";

-- DropTable
DROP TABLE "FollowedAnime";

-- CreateTable
CREATE TABLE "Rating" (
    "uid" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Comment" (
    "uid" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Review" (
    "uid" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ratingId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_animeId_ownerId_key" ON "Rating"("animeId", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_animeId_ownerId_key" ON "Comment"("animeId", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_ratingId_key" ON "Review"("ratingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_commentId_key" ON "Review"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_animeId_ownerId_key" ON "Review"("animeId", "ownerId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AuthUser"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AuthUser"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AuthUser"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
