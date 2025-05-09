"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RoadmapResult({ roadmap, onBack }) {
  console.log("🚀 Received roadmap prop:", roadmap);

  let parsed;
  try {
    parsed = typeof roadmap.roadmap === "string"
      ? JSON.parse(roadmap.roadmap)
      : roadmap.roadmap;
    console.log("✅ Parsed roadmap JSON:", parsed);
  } catch (e) {
    console.error("❌ Failed to parse roadmap JSON:", e);
    parsed = { roadmap: [] };
  }

  const steps = Array.isArray(parsed.roadmap) ? parsed.roadmap : [];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold gradient-title">Roadmap Details</h1>
        <Button onClick={onBack}>Back to List</Button>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-xl">
                Step {step.step}: {step.topic}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>{step.description}</p>

              {Array.isArray(step.youtube) && step.youtube.length > 0 && (
                <div>
                  <strong>Videos:</strong>
                  <ul className="list-disc ml-5">
                    {step.youtube.map((video, idx) => (
                      <li key={idx}>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {video.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(step.websites) && step.websites.length > 0 && (
                <div>
                  <strong>Websites:</strong>
                  <ul className="list-disc ml-5">
                    {step.websites.map((site, idx) => (
                      <li key={idx}>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {site.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(step.books) && step.books.length > 0 && (
                <div>
                  <strong>Books/Articles:</strong>
                  <ul className="list-disc ml-5">
                    {step.books.map((book, idx) => (
                      <li key={idx}>
                        <a
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {book.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
