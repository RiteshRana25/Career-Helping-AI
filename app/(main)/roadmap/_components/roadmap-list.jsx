"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import RoadmapResult from "./roadmap-result";

export default function RoadmapList({ roadmaps }) {
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
                  Your Learning Roadmaps
                </CardTitle>
                <CardDescription>
                  Click a roadmap to view its details.
                </CardDescription>
              </div>
              <Button onClick={() => router.push("/roadmap/road-map")}>
                New Roadmap
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.isArray(roadmaps) && roadmaps.length > 0 ? (
              roadmaps.map((roadmap) => (
                <Card
                  key={roadmap.id}
                  onClick={() => setSelected(roadmap)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle>
                      {roadmap.skill} - {roadmap.level}
                    </CardTitle>
                    <CardDescription>
                      {new Date(roadmap.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p>No roadmaps found.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <RoadmapResult roadmap={selected} onBack={() => setSelected(null)} />
      )}
    </>
  );
}
