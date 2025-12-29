"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function sendMessageToBot(message) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
  });
  if (!user) throw new Error("User not found");

  const dbUserId = user.id;

  await db.chatMessage.create({
    data: {
      userId: dbUserId,
      role: "user",
      content: message,
    },
  });

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  });

  const botResponse = result.text.trim();

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
