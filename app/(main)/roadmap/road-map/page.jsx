"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateLearningRoadmap } from "@/actions/roadmap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarLoader } from "react-spinners";

export default function NewRoadmapPage() {
  const router = useRouter();
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!skill || !level || !language) return;
    setLoading(true);
    try {
      await generateLearningRoadmap(skill, level, language);
      router.push("/roadmap");
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-xl mt-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">New Learning Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Skill (e.g., React, MERN)" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <Input placeholder="Level (e.g., Beginner, Intermediate)" value={level} onChange={(e) => setLevel(e.target.value)} />
        <Input placeholder="Language (e.g., English)" value={language} onChange={(e) => setLanguage(e.target.value)} />
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? <BarLoader color="white" width={80} /> : "Generate"}
        </Button>
      </CardContent>
    </Card>
  );
}
