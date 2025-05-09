/*
  Warnings:

  - Changed the type of `roadmap` on the `LearningRoadmap` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LearningRoadmap" DROP COLUMN "roadmap",
ADD COLUMN     "roadmap" JSONB NOT NULL;
