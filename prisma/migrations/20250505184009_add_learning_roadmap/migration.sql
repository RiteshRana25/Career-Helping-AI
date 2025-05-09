-- CreateTable
CREATE TABLE "LearningRoadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "roadmap" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningRoadmap_userId_idx" ON "LearningRoadmap"("userId");

-- AddForeignKey
ALTER TABLE "LearningRoadmap" ADD CONSTRAINT "LearningRoadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
