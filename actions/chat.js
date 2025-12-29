"use server"
import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function sendMessageToBot(message) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkUserId },
  })
  if (!user) throw new Error("User not found")

  const dbUserId = user.id

  // Save user message
  await db.chatMessage.create({
    data: {
      userId: dbUserId,
      role: "user",
      content: message,
    },
  })

  // Get bot response from Gemini
  const result = await model.generateContent(message)
  const botResponse = result.response.text().trim()

  // Save bot response
  await db.chatMessage.create({
    data: {
      userId: dbUserId,
      role: "bot",
      content: botResponse,
    },
  })

  return botResponse
}
export async function getChatHistory() {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkUserId } })
  if (!user) throw new Error("User not found")

  return db.chatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  })
}
