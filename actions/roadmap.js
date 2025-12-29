"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function generateLearningRoadmap(skill, language, level) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
You are a learning roadmap assistant.

A user wants to learn "${skill}" in "${language}" and they are at a "${level}" level.

"${skill}" can be a technology, framework, or broad topic like "frontend" or "MERN".

Generate a step-by-step learning roadmap. For each step:
- Name the topic
- Briefly describe what the learner should focus on
- Recommend 1-2 YouTube videos (with titles and direct links, in ${language} if possible)
- Recommend relevant websites/platforms (with names and links)
- Recommend one useful book or article (with name and a link if possible)

Return ONLY valid JSON. Begin with "{" and end with "}". Format:
{
  "roadmap": [
    {
      "step": 1,
      "topic": "Topic Name",
      "description": "Short explanation",
      "youtube": [
        { "title": "Video Title", "url": "https://youtube.com/..." }
      ],
      "websites": [
        { "name": "Website Name", "url": "https://..." }
      ],
      "books": [
        { "title": "Book or Article Title", "url": "https://..." }
      ]
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    if (!rawText) {
      throw new Error("Empty response from Gemini model");
    }

    let roadmapData;
    try {
      roadmapData = JSON.parse(rawText);
    } catch {
      throw new Error("Invalid JSON format in Gemini response");
    }

    if (
      !roadmapData ||
      typeof roadmapData !== "object" ||
      !Array.isArray(roadmapData.roadmap)
    ) {
      throw new Error("Roadmap JSON structure is invalid");
    }

    const saved = await db.learningRoadmap.create({
      data: {
        userId: user.id,
        skill,
        language,
        level,
        roadmap: roadmapData,
      },
    });

    return saved;
  } catch (error) {
    console.error("🚨 Error generating roadmap:", error);
    throw new Error("Failed to generate learning roadmap");
  }
}

export async function getLearningRoadmaps() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return db.learningRoadmap.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}
