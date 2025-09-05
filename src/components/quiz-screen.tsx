
'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, MoveRight, BookOpen } from 'lucide-react';
import { type GenerateMCQQuizOutput } from '@/ai/flows/generate-mcq-quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface QuizScreenProps {
  quizData: GenerateMCQQuizOutput;
  onQuizFinish: (score: number) => void;
}

export default function QuizScreen({ quizData, onQuizFinish }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = useMemo(
    () => quizData.questions[currentQuestionIndex],
    [quizData, currentQuestionIndex]
  );
  const progress = ((currentQuestionIndex) / quizData.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    let updatedScore = score;
    if (isCorrect) {
      updatedScore++;
      setScore(updatedScore);
    }
    
    setIsAnswered(true);

    if (isLastQuestion) {
      // Pass the updated score directly to the finish handler
      // to avoid issues with state update timing.
      onQuizFinish(updatedScore);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setIsAnswered(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index ? 'bg-primary/10 border-primary' : 'border-border';
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400';
    }
    if (index === selectedAnswer) {
      return 'bg-destructive/20 border-destructive text-destructive-foreground';
    }
    return 'border-border opacity-60';
  };

  return (
    <div className="w-full max-w-2xl" key={currentQuestionIndex}>
      <div className="mb-4 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progress} />
      </div>
      <Card className="shadow-lg animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl lg:text-2xl leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                'w-full h-auto justify-start text-left py-3 px-4 whitespace-normal transition-all duration-300 text-sm md:text-base',
                getOptionStyle(index)
              )}
              onClick={() => !isAnswered && setSelectedAnswer(index)}
              disabled={isAnswered}
            >
              <div className="flex items-center w-full">
                <span className="flex-1">{option}</span>
                {isAnswered && index === currentQuestion.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-500" />}
                {isAnswered && index !== currentQuestion.correctAnswerIndex && index === selectedAnswer && <XCircle className="w-5 h-5 text-destructive" />}
              </div>
            </Button>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          {isAnswered && (
            <div className="w-full p-4 mb-4 rounded-lg bg-secondary text-secondary-foreground animate-in fade-in duration-500">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Explanation</h4>
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
          {isAnswered ? (
             <Button onClick={handleNext} disabled={isLastQuestion}>
                Next Question
                <MoveRight className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
