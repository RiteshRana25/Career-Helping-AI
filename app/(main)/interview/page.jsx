import { getAssessments } from "@/actions/interview";
import { getShortQuestions } from "@/actions/interview-assessment";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import ShortQuestionList from "./_components/shortquestion-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();
  const questions = await getShortQuestions();



  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
        <ShortQuestionList questions={questions} /> {/* Add ShortQuestionList after QuizList */}
      </div>
    </div>
  );
}
