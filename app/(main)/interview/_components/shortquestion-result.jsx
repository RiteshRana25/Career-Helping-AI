"use client";

export default function ShortQuestionResult({ result }) {
  if (!result) return null;

  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        Study Questions
      </h1>

      <div className="space-y-4">
        {result.questions.map((q, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="font-medium">{q.question}</div>
            <div className="text-muted-foreground">{q.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
