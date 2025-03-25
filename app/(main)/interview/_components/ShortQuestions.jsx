"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { generateShortQuestions } from "@/actions/interview-assessment";
import useFetch from "@/hooks/use-fetch";
import ShortQuestionResult from "./shortquestion-result";

export default function ShortQuestion() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const { loading: generatingQuestions, fn: generateQuestionsFn, data: questionData } = useFetch(generateShortQuestions);

  useEffect(() => {
    if (!questionData) {
      generateQuestionsFn();
    }
  }, [questionData]);

  const handleNext = () => {
    if (currentQuestion < questionData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (generatingQuestions) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  if (!questionData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Get Started with Study Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Click the button below to generate study questions.
          </p>
        </CardContent>
        <Button onClick={generateQuestionsFn} className="w-full">
          Start Studying
        </Button>
      </Card>
    );
  }

  const question = questionData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>Question {currentQuestion + 1} of {questionData.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{question.question}</p>
        <p className="text-muted-foreground">{question.answer}</p>
      </CardContent>
      <Button onClick={handleNext} className="ml-auto">
        {currentQuestion < questionData.length - 1 ? "Next Question" : "Finish"}
      </Button>
    </Card>
  );
}
