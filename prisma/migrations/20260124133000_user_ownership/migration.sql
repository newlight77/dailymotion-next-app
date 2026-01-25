-- Add ownership to watch list collection and list
ALTER TABLE "WatchListCollection" ADD COLUMN "ownerId" TEXT;
ALTER TABLE "WatchList" ADD COLUMN "ownerId" TEXT;
ALTER TABLE "WatchList" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- Create FollowedAnime
CREATE TABLE "FollowedAnime" (
    "uid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "originalTitle" TEXT,
    "lastEpisode" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowedAnime_pkey" PRIMARY KEY ("uid")
);

-- Create FollowedVideoOwner
CREATE TABLE "FollowedVideoOwner" (
    "uid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowedVideoOwner_pkey" PRIMARY KEY ("uid")
);

-- Indexes and unique constraints
CREATE UNIQUE INDEX "FollowedAnime_userId_animeId_key" ON "FollowedAnime"("userId", "animeId");
CREATE UNIQUE INDEX "FollowedVideoOwner_userId_owner_key" ON "FollowedVideoOwner"("userId", "owner");

-- Foreign keys
ALTER TABLE "WatchListCollection" ADD CONSTRAINT "WatchListCollection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AuthUser"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WatchList" ADD CONSTRAINT "WatchList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AuthUser"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FollowedAnime" ADD CONSTRAINT "FollowedAnime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FollowedAnime" ADD CONSTRAINT "FollowedAnime_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FollowedVideoOwner" ADD CONSTRAINT "FollowedVideoOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
