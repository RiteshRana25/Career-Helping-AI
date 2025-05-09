"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import ShortQuestionResult from "./shortquestion-result";

export default function ShortQuestionList({ questions }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  return (
    <>
      {!selected ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="gradient-title text-3xl md:text-4xl">
                  Study Question Sets
                </CardTitle>
                <CardDescription>
                  Click any set to review its questions and answers.
                </CardDescription>
              </div>
              <Button onClick={() => router.push("/interview/short-question")}>
                Get New Questions
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((qset, i) => (
                <Card
                key={qset.id}
                onClick={() => setSelected(qset)} // This is good: you're passing the full record
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Question Set {i + 1}
                    </CardTitle>
                    <CardDescription>
                      {qset.createdAt && new Date(qset.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <ShortQuestionResult result={selected} onBack={() => setSelected(null)} />
      )}
    </>
  );
}
