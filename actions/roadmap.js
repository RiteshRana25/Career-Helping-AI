"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

Return ONLY valid JSON with NO explanation, NO Markdown, and NO extra text. Begin with "{" and end with "}". Format:
{
  "roadmap": [
    {
      "step": 1,
      "topic": "Topic Name",
      "description": "Short explanation",
      "youtube": [
        {
          "title": "Video Title",
          "url": "https://youtube.com/..."
        }
      ],
      "websites": [
        {
          "name": "Platform or Website Name",
          "url": "https://..."
        }
      ],
      "books": [
        {
          "title": "Book or Article Title",
          "url": "https://..."
        }
      ]
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    // Clean the model output
    const cleanedText = rawText.replace(/```(?:json)?\n?|```/g, "").trim();
    console.log("Raw Gemini response:", rawText);
    console.log("Cleaned response:", cleanedText);

    if (!cleanedText) {
      throw new Error("Empty response from Gemini model");
    }

    let roadmapData;
    try {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("❌ No valid JSON block found:", cleanedText);
        throw new Error("No JSON block found in response");
      }
      roadmapData = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ Failed to parse JSON from Gemini:", cleanedText);
      throw new Error("Invalid JSON format in Gemini response");
    }

    if (
      !roadmapData ||
      typeof roadmapData !== "object" ||
      !Array.isArray(roadmapData.roadmap)
    ) {
      console.error("❌ Invalid roadmap structure:", roadmapData);
      throw new Error("Roadmap JSON structure is invalid");
    }

    console.log("✅ Parsed roadmapData:", JSON.stringify(roadmapData, null, 2));

    const saved = await db.learningRoadmap.create({
      data: {
        userId: user.id,
        skill,
        language,
        level,
        roadmap: roadmapData, // roadmap is now a single Json object
      },
    });

    console.log("✅ Successfully saved roadmap:", saved);
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

  const roadmaps = await db.learningRoadmap.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return roadmaps;
}
