"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { generateShortQuestions } from "@/actions/interview-assessment";
import useFetch from "@/hooks/use-fetch";

export default function ShortQuestion() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [localQuestions, setLocalQuestions] = useState([]);

  const {
    loading: generatingQuestions,
    fn: generateQuestionsFn,
  } = useFetch(async () => {
    const generated = await generateShortQuestions(); // returns [{ question, answer }, ...]
    setLocalQuestions(generated); // store only in local state
  });

  const handleStart = async () => {
    setHasStarted(true);
    setCurrentQuestion(0);
    setHasFinished(false);
    await generateQuestionsFn();
  };

  const handleNext = () => {
    if (currentQuestion < localQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setHasFinished(true);
    }
  };

  if (!hasStarted) {
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
        <Button onClick={handleStart} className="w-full">
          Start Studying
        </Button>
      </Card>
    );
  }

  if (generatingQuestions) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  if (localQuestions.length === 0) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>No Questions Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Something went wrong while generating questions.
          </p>
        </CardContent>
        <Button onClick={handleStart} className="w-full">
          Try Again
        </Button>
      </Card>
    );
  }

  if (hasFinished) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Study Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your questions have been saved successfully.
          </p>
        </CardContent>
        <Button onClick={handleStart} className="w-full">
          Study Again
        </Button>
      </Card>
    );
  }

  const question = localQuestions[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {localQuestions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{question.question}</p>
        <p className="text-muted-foreground mt-2">{question.answer}</p>
      </CardContent>
      <Button onClick={handleNext} className="ml-auto">
        {currentQuestion < localQuestions.length - 1 ? "Next Question" : "Finish"}
      </Button>
    </Card>
  );
}
