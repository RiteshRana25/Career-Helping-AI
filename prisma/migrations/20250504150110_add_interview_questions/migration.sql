/*
  Warnings:

  - The `question` column on the `InterviewQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `answer` column on the `InterviewQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "question",
ADD COLUMN     "question" JSONB[],
DROP COLUMN "answer",
ADD COLUMN     "answer" JSONB[];
