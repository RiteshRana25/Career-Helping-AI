"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateInterviewInsight } from "@/actions/job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarLoader } from "react-spinners";

export default function NewJobPrepPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!company || !role) return;
    setLoading(true);
    try {
      await generateInterviewInsight(company, role);
      router.push("/job");
    } catch (err) {
      console.error("Failed to generate job prep:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-xl mt-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">New Job Prep</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? <BarLoader color="white" width={80} /> : "Generate"}
        </Button>
      </CardContent>
    </Card>
  );
}
