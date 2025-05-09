import { getLearningRoadmaps } from "@/actions/roadmap";
import RoadmapList from "./_components/roadmap-list";

export default async function RoadMapPage() {
  const roadmaps = await getLearningRoadmaps();
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-6xl font-bold gradient-title mb-6">
        Learning Roadmaps
      </h1>
      <RoadmapList roadmaps={roadmaps} />
    </div>
  );
}
