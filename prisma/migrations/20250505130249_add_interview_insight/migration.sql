-- CreateTable
CREATE TABLE "InterviewInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "rounds" JSONB NOT NULL,
    "generalTips" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewInsight_userId_idx" ON "InterviewInsight"("userId");

-- AddForeignKey
ALTER TABLE "InterviewInsight" ADD CONSTRAINT "InterviewInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
