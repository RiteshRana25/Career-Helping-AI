"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai"; // Updated client

// Initialize AI client (reads GEMINI_API_KEY from environment variables)
const ai = new GoogleGenAI({});

export const generateAIInsights = async (industry) => {
  const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
Include at least 5 common roles for salary ranges.
Growth rate should be a percentage.
Include at least 5 skills and trends.
`;

  // Generate content using Gemini 2.5 Flash
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = result.text.trim();

  // Parse JSON safely
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI insights JSON:", text);
    throw new Error("Invalid AI response format");
  }
};

export async function getIndustryInsights() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate and save them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // next week
        userId: user.id, // assuming relation
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
