"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateInterviewInsight(company, role) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
  You are an interview preparation assistant.
  
  The user is applying to [${company}] as a [${role}].
  
  Provide the typical interview process for this company and role.
  - Include each round (e.g., Online Assessment, Technical Screen, Onsite, etc.) in order.
  - For each round, return 5 commonly asked questions related to this specific role.
  
  Then give 2 concise general tips for succeeding in interviews at ${company}.
  
  Return only JSON in the following format:
  {
    "rounds": [
      {
        "name": "Round name",
        "questions": [
          "Question 1",
          "Question 2",
          ...
        ]
      }
    ],
    "generalTips": ["Tip 1", "Tip 2"]
  }
  `;
  

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    const parsed = JSON.parse(text);

    const savedInsight = await db.interviewInsight.create({
      data: {
        userId: user.id,
        company,
        role,
        rounds: parsed.rounds,
        generalTips: parsed.generalTips.join("\n"),
      },
    });

    return savedInsight;
  } catch (error) {
    console.error("Error generating interview insight:", error);
    throw new Error("Failed to generate insight");
  }
}

export async function getInterviewInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const insights = await db.interviewInsight.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return insights;
  } catch (error) {
    console.error("Error fetching insights:", error);
    throw new Error("Failed to fetch interview insights");
  }
}
