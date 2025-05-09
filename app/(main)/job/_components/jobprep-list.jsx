"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import JobPrepResult from "./jobprep-result";

export default function JobPrepList({ jobPreps }) {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  return (
    <>
      {!selected ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="gradient-title text-3xl md:text-4xl">
                  Previous Job Preparation Sessions
                </CardTitle>
                <CardDescription>
                  Click on a session to view its details.
                </CardDescription>
              </div>
              <Button onClick={() => router.push("job/job-prep")}>
                New Job Prep
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobPreps.map((prep, i) => (
              <Card
                key={prep.id}
                onClick={() => setSelected(prep)}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <CardHeader>
                  <CardTitle>
                    {prep.company} - {prep.role}
                  </CardTitle>
                  <CardDescription>
                    {new Date(prep.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </CardContent>
        </Card>
      ) : (
        <JobPrepResult prep={selected} onBack={() => setSelected(null)} />
      )}
    </>
  );
}
