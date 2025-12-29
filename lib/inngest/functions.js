import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client (uses GEMINI_API_KEY from env)
const ai = new GoogleGenAI({});

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
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

IMPORTANT:
- Return ONLY valid JSON
- No markdown, no explanations
- Include at least 5 roles in salaryRanges
- Growth rate must be a percentage number
- Include at least 5 skills and trends
`;

      const result = await step.ai.wrap(
        "gemini",
        async (p) => {
          return ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: p,
          });
        },
        prompt
      );

      // Gemini 2.5 simplified text access
      const rawText = result.text || "";
      const cleanedText = rawText
        .replace(/```(?:json)?/g, "")
        .replace(/```/g, "")
        .trim();

      let insights;
      try {
        insights = JSON.parse(cleanedText);
      } catch (err) {
        console.error(`JSON parse failed for industry: ${industry}`);
        console.error(cleanedText);
        throw err;
      }

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
