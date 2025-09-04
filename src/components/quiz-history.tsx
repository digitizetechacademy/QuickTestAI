
'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Award } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getQuizHistory, type QuizResult } from '@/services/quiz-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await getQuizHistory(user.uid);
        setHistory(results);
      } catch (error) {
        console.error("Failed to fetch quiz history:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [user]);

  return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
          <CardDescription>
            Here are the results from the quizzes you've taken.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Quizzes Taken</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't completed any quizzes yet. Start one to see your progress!
              </p>
            </div>
          ) : (
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
                      badgeColor = 'bg-green-500 text-white';
                    } else if (percentage >= 50) {
                      badgeColor = 'bg-yellow-500 text-white';
                    } else {
                      badgeColor = 'bg-destructive text-destructive-foreground';
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
          )}
        </CardContent>
      </Card>
  );
}
