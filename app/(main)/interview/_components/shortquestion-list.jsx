"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { generateShortQuestions } from "@/actions/interview-assessment";
import ShortQuestionResult from "./shortquestion-result";

export default function ShortQuestionList({ assessments }) {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Study Questions
              </CardTitle>
              <CardDescription>
                Review your past study questions
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/short-question")}>
              Get New Questions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment, i) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedQuestions(assessment)}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Question Set {i + 1}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedQuestions && (
        <ShortQuestionResult result={selectedQuestions} />
      )}
    </>
  );
}
