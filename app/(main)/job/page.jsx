import { getInterviewInsights } from "@/actions/job";
import JobPrepList from "./_components/jobprep-list";

export default async function JobPrepPage() {
  const insights = await getInterviewInsights();
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-6xl font-bold gradient-title mb-6">
        Job Preparation
      </h1>
      <JobPrepList jobPreps={insights} />
    </div>
  );
}
