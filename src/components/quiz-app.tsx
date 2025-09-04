'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BookOpen, BrainCircuit, CheckCircle, Home, Loader2, MoveRight, Repeat, XCircle } from 'lucide-react';

import { generateMCQQuiz, type GenerateMCQQuizOutput } from '@/ai/flows/generate-mcq-quiz';
import { saveQuizResult } from '@/services/quiz-service';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type AppState = 'topic' | 'loading' | 'quiz' | 'results';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.').max(50, 'Topic must be 50 characters or less.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

export default function QuizApp() {
  const [appState, setAppState] = useState<AppState>('topic');
  const [quizData, setQuizData] = useState<GenerateMCQQuizOutput | null>(null);
  const [quizParams, setQuizParams] = useState({ topic: '', difficulty: 'Medium' as Difficulty });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '', difficulty: 'Medium' },
  });
  
  const handleTopicSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAppState('loading');
    setQuizParams({ topic: values.topic, difficulty: values.difficulty });
    try {
      const quiz = await generateMCQQuiz({ topic: values.topic, difficulty: values.difficulty });
      if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        throw new Error('No questions were generated.');
      }
      setQuizData(quiz);
      setAppState('quiz');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Quiz',
        description: 'Failed to generate the quiz. Please try a different topic.',
        variant: 'destructive',
      });
      setAppState('topic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    setIsAnswered(true);
    const correct = selectedAnswer === quizData!.questions[currentQuestionIndex].correctAnswerIndex;
    if (correct) {
        setScore((prev) => prev + 1);
    }
    
    const isLastQuestion = currentQuestionIndex === quizData!.questions.length - 1;
    if (isLastQuestion) {
        handleSaveResult();
    }
  };
  
  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleSaveResult = async () => {
     if (user) {
        try {
            await saveQuizResult({
                userId: user.uid,
                topic: quizParams.topic,
                difficulty: quizParams.difficulty,
                score: score,
                totalQuestions: quizData!.questions.length,
            });
            toast({
                title: 'Quiz Saved',
                description: 'Your quiz result has been saved to your history.',
            });
            router.refresh(); 
        } catch (error) {
            console.error('Save Error:', error);
            toast({
                title: 'Save Error',
                description: 'Could not save your quiz result. Please try again.',
                variant: 'destructive',
            });
        }
    }
  }

  const viewResults = () => {
    setAppState('results');
  }

  const resetQuizState = () => {
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsLoading(false);
  }

  const restartQuiz = () => {
    resetQuizState();
    handleTopicSubmit(quizParams);
  };

  const startNewQuiz = () => {
    resetQuizState();
    form.reset();
    setQuizParams({ topic: '', difficulty: 'Medium' });
    setAppState('topic');
  }

  const renderTopicSelector = () => (
    <Card className="w-full max-w-lg shadow-lg animate-in fade-in duration-500">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2">
            <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <CardTitle className="text-2xl md:text-3xl font-bold">Quick Test AI</CardTitle>
        </div>
        <CardDescription>Enter a topic, choose a difficulty, and get a quiz generated by AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTopicSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g., 'The Roman Empire' or 'React.js Hooks'" {...field} className="text-center text-sm md:text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-center block">Select Difficulty</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-center gap-2 md:gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Easy" id="r1" />
                        </FormControl>
                        <FormLabel htmlFor="r1" className="font-normal text-sm sm:text-base">Easy</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Medium" id="r2" />
                        </FormControl>
                        <FormLabel htmlFor="r2" className="font-normal text-sm sm:text-base">Medium</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Hard" id="r3" />
                        </FormControl>
                        <FormLabel htmlFor="r3" className="font-normal text-sm sm:text-base">Hard</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Quiz'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center gap-4 text-center animate-in fade-in duration-500">
      <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin" />
      <h2 className="text-xl md:text-2xl font-semibold">Generating your quiz...</h2>
      <p className="text-muted-foreground max-w-sm">Please wait while we create a {quizParams.difficulty.toLowerCase()} quiz on "{quizParams.topic}".</p>
    </div>
  );

  const renderQuiz = () => {
    if (!quizData) return null;
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / quizData.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

    const getOptionStyle = (index: number) => {
        if (!isAnswered) {
          return selectedAnswer === index
            ? 'bg-primary/10 border-primary'
            : 'border-border';
        }
        if (index === currentQuestion.correctAnswerIndex) {
          return 'bg-accent/20 border-accent text-accent-foreground';
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
                    {isAnswered && index === currentQuestion.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-accent" />}
                    {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswerIndex && <XCircle className="w-5 h-5 text-destructive" />}
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
            {!isAnswered ? (
              <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : isLastQuestion ? (
              <Button onClick={viewResults}>
                View Results
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next Question
                <MoveRight className="ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderResults = () => {
    const percentage = Math.round((score / quizData!.questions.length) * 100);
    let feedback = { title: "", description: "" };

    if (percentage === 100) {
        feedback = { title: "Perfect Score!", description: "Incredible! You're an expert on this topic." };
    } else if (percentage >= 80) {
        feedback = { title: "Excellent Work!", description: "You have a strong understanding of the material." };
    } else if (percentage >= 50) {
        feedback = { title: "Good Effort!", description: "You're on the right track. A little review could help." };
    } else {
        feedback = { title: "Keep Studying!", description: "Don't be discouraged. Learning is a journey." };
    }

    return (
        <Card className="w-full max-w-lg text-center shadow-lg animate-in zoom-in-95 duration-500">
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold">{feedback.title}</CardTitle>
                <CardDescription>{feedback.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
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
                    <span className="absolute text-3xl md:text-4xl font-bold">{score}/{quizData!.questions.length}</span>
                </div>
                <p className="text-base md:text-lg">You scored {percentage}% on the "{quizParams.topic}" ({quizParams.difficulty}) quiz.</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full" onClick={restartQuiz}>
                    <Repeat className="mr-2 h-4 w-4" />
                    Retry Quiz
                </Button>
                <Button className="w-full" onClick={startNewQuiz}>
                    <Home className="mr-2 h-4 w-4" />
                    New Topic
                </Button>
            </CardFooter>
        </Card>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
        {appState === 'topic' && renderTopicSelector()}
        {appState === 'loading' && renderLoading()}
        {appState === 'quiz' && renderQuiz()}
        {appState === 'results' && renderResults()}
    </div>
  );
}
