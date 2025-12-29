"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client (reads GEMINI_API_KEY automatically)
const ai = new GoogleGenAI({});

export async function generateShortQuestions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 common interview questions for a ${user.industry} professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    Each question should have a clear and concise answer.
    Return the response in this JSON format:
    {
      "questions": [
        {
          "question": "string",
          "answer": "string"
        }
      ]
    }
  `;

  try {
    // NEW Gemini call
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text;

    // Same cleanup logic as before
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    const questions = parsed.questions;

    await db.interviewQuestion.create({
      data: {
        userId: user.id,
        qaPairs: questions,
      },
    });

    return questions;
  } catch (error) {
    console.error("Error generating or saving short questions:", error);
    throw new Error("Failed to generate or save short questions");
  }
}

export async function getShortQuestions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const questions = await db.interviewQuestion.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
    return questions;
  } catch (error) {
    console.error("Error fetching short questions:", error);
    throw new Error("Failed to fetch short questions");
  }
}
