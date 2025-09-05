
'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Award, Home, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getQuizHistory, type QuizResult } from '@/services/quiz-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from './ui/button';
import Link from 'next/link';

export default function QuizHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const results = await getQuizHistory(user.uid);
        setHistory(results);
      } catch (err: any) {
        console.error("Failed to fetch quiz history:", err);
        if (err.message?.includes('NOT_FOUND')) {
             setError("Firestore database not found. Please create one in your Firebase console's 'Build' section.");
        } else {
             setError("Failed to load your quiz history. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [user]);
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (error || history.length === 0) {
      return (
        <div className="text-center py-10">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Quizzes Taken</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't completed any quizzes yet. Start one to see your progress!
          </p>
           <Button asChild className="mt-4">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Start a New Quiz
                </Link>
           </Button>
        </div>
      );
    }
      
    return (
       <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="hidden sm:table-cell">Difficulty</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="hidden md:table-cell text-right">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {history.map((result) => {
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                let badgeColor;
                if (percentage >= 80) {
                    badgeColor = 'bg-green-500 hover:bg-green-500/80 text-white';
                } else if (percentage >= 50) {
                    badgeColor = 'bg-yellow-500 hover:bg-yellow-500/80 text-white';
                } else {
                    badgeColor = 'bg-destructive hover:bg-destructive/80 text-destructive-foreground';
                }

                return (
                    <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.topic}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                        <Badge
                         variant={
                            result.difficulty === 'Easy'
                            ? 'default'
                            : result.difficulty === 'Medium'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="capitalize"
                        >
                        {result.difficulty}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                        <span>
                            {result.score}/{result.totalQuestions}
                        </span>
                        <Badge className={cn('hidden lg:inline-flex', badgeColor)}>{percentage}%</Badge>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                        {format(new Date(result.createdAt), 'PPp')}
                    </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </div>
    );
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
          <CardDescription>
            Here are the results from the quizzes you've taken.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
  );
}
