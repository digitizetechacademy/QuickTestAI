'use client';

import { useMemo } from 'react';
import { Award, Medal, Trophy, Diamond, Repeat, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

type BadgeType = {
  name: 'Beginner' | 'Learner' | 'Achiever' | 'Champion';
  icon: React.ElementType;
  color: string;
};

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  quizParams: { topic: string; difficulty: string };
  onRestart: () => void;
  onNewQuiz: () => void;
}

export default function ResultsScreen({
  score,
  totalQuestions,
  quizParams,
  onRestart,
  onNewQuiz,
}: ResultsScreenProps) {
  const { t } = useTranslation();

  const { percentage, feedback, badge } = useMemo(() => {
    const calculatedPercentage = Math.round((score / totalQuestions) * 100);
    let calculatedFeedback: { titleKey: string; descriptionKey: string };
    let calculatedBadge: BadgeType;

    if (score >= 9) {
      calculatedBadge = { name: 'Champion', icon: Diamond, color: 'text-blue-400' };
      calculatedFeedback = { titleKey: "results_champion_title", descriptionKey: "results_champion_desc" };
    } else if (score >= 7) {
      calculatedBadge = { name: 'Achiever', icon: Trophy, color: 'text-yellow-500' };
      calculatedFeedback = { titleKey: "results_achiever_title", descriptionKey: "results_achiever_desc" };
    } else if (score >= 4) {
      calculatedBadge = { name: 'Learner', icon: Medal, color: 'text-gray-400' };
      calculatedFeedback = { titleKey: "results_learner_title", descriptionKey: "results_learner_desc" };
    } else {
      calculatedBadge = { name: 'Beginner', icon: Award, color: 'text-yellow-700' };
      calculatedFeedback = { titleKey: "results_beginner_title", descriptionKey: "results_beginner_desc" };
    }
    return { percentage: calculatedPercentage, feedback: calculatedFeedback, badge: calculatedBadge };
  }, [score, totalQuestions]);

  const badgeName = t(`results_badge_${badge.name.toLowerCase()}`);

  return (
    <Card className="w-full max-w-lg text-center shadow-lg animate-in zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{t(feedback.titleKey)}</CardTitle>
        <CardDescription>{t(feedback.descriptionKey)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className={cn("flex items-center gap-3 p-3 rounded-lg bg-secondary", badge.color)}>
          <badge.icon className="w-8 h-8" />
          <span className="text-xl font-semibold">{badgeName}</span>
        </div>
        <div className="relative flex items-center justify-center w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
            <circle className="text-secondary" strokeWidth="10" stroke="currentColor" fill="transparent" r="58" cx="65" cy="65" />
            <circle
              className="text-primary transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={(2 * Math.PI * 58) * (1 - percentage / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="65"
              cy="65"
            />
          </svg>
          <span className="absolute text-4xl font-bold">{score}/{totalQuestions}</span>
        </div>
        <p className="text-lg">
            {t('results_summary', { 
                percentage: percentage, 
                topic: quizParams.topic, 
                difficulty: t(`difficulty_${quizParams.difficulty.toLowerCase()}`) 
            })}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="w-full" onClick={onRestart}>
          <Repeat className="mr-2 h-4 w-4" />
          {t('results_retry_button')}
        </Button>
        <Button className="w-full" onClick={onNewQuiz}>
          <Home className="mr-2 h-4 w-4" />
          {t('results_new_topic_button')}
        </Button>
      </CardFooter>
    </Card>
  );
}
