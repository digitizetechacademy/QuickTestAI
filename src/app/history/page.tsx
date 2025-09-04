'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getQuizHistory, type QuizResult } from '@/services/quiz-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Loader2, Award } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/main-layout';
import SplashScreen from '@/components/splash-screen';
import LoginPage from '@/components/login-page';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getQuizHistory(user.uid)
        .then(setHistory)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Quiz History</CardTitle>
                <CardDescription>
                  Here are the results from the quizzes you've taken.
                </CardDescription>
              </div>
              <Link href="/" passHref>
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Take a New Quiz
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-20">
                <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Quizzes Taken</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't completed any quizzes yet. Start one to see your progress!
                </p>
                <Link href="/" passHref>
                    <Button className="mt-6">
                        <Home className="mr-2 h-4 w-4" />
                        Take a New Quiz
                    </Button>
                </Link>
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
                        badgeColor = 'bg-accent text-accent-foreground';
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
                            {format(result.createdAt, 'PPp')}
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
      </div>
    </MainLayout>
  );
}
