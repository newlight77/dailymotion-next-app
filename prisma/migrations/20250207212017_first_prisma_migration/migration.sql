-- CreateTable
CREATE TABLE "Anime" (
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updateDays" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "studio" TEXT NOT NULL,
    "releaseAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "publishedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subtitle" TEXT,
    "originalTitle" TEXT,
    "firstSeasonEpisode" INTEGER, -- first of season
    "lastSeasonEpisode" INTEGER, -- last of season
    "totalSeasonEpisodes" INTEGER, -- total of all seasons
    "lastEpisode" INTEGER, -- last of season
    "totalEpisodes" INTEGER, -- total of all seasons

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("uid")
);
