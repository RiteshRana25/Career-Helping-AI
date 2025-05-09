"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ShortQuestionResult({ result, onBack }) {
  console.log("Selected Question Set:", result);

  if (!result || !Array.isArray(result.qaPairs)) {
    return (
      <div>
        <p className="text-red-500">No questions available in this set.</p>
        <Button onClick={onBack} className="mt-4">Back to List</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold gradient-title">Question Set Details</h1>
        <Button onClick={onBack}>Back to List</Button>
      </div>

      <div className="space-y-4">
        {result.qaPairs.map((pair, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">Q{i + 1}: {pair.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A: {pair.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
