/*
  Warnings:

  - You are about to drop the column `answer` on the `InterviewQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `InterviewQuestion` table. All the data in the column will be lost.
  - Added the required column `qaPairs` to the `InterviewQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "answer",
DROP COLUMN "question",
ADD COLUMN     "qaPairs" JSONB NOT NULL;
