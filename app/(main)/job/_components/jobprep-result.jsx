"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function JobPrepResult({ prep, onBack }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold gradient-title">Job Prep Details</h1>
        <Button onClick={onBack}>Back to List</Button>
      </div>

      <div className="space-y-4">
        {prep.rounds.map((round, i) => {
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-xl">
                  Round {i + 1}: {round.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{round.description}</p>
                {round.questions?.length > 0 && (
                  <ul className="mt-2 list-disc ml-4 text-muted-foreground">
                    {round.questions.map((q, j) => (
                      <li key={j}>{q}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
