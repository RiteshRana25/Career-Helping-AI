"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai"; // Updated import for the latest API

// Initialize client (picks up GEMINI_API_KEY from environment variables)
const ai = new GoogleGenAI({});

export async function sendMessageToBot(message) {
  // Authenticate user
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });
  if (!user) throw new Error("User not found");

  const dbUserId = user.id;

  // Save user message
  await db.chatMessage.create({
    data: {
      userId: dbUserId,
      role: "user",
      content: message,
    },
  });

  // Get bot response from Gemini 2.5 Flash
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash", // ✅ Supported model
    contents: message,
  });

  const botResponse = result.text.trim();

  // Save bot response
  await db.chatMessage.create({
    data: {
      userId: dbUserId,
      role: "bot",
      content: botResponse,
    },
  });

  return botResponse;
}

export async function getChatHistory() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });
  if (!user) throw new Error("User not found");

  return db.chatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
}
