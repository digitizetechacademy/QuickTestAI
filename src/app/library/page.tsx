
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Book, History, Loader2, Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { generateExplanation } from '@/ai/flows/generate-explanation';
import { saveReading, getReadingHistory, type Reading } from '@/services/library-service';
import MainLayout from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
});
type FormValues = z.infer<typeof formSchema>;

export default function LibraryPage() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Reading[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const fetchHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const results = await getReadingHistory(user.uid);
      setHistory(results);
    } catch (error) {
      console.error('Failed to fetch reading history:', error);
      toast({
        title: 'Error',
        description: 'Could not load your reading history.',
        variant: 'destructive',
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleSearch: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setExplanation(null);
    try {
      const result = await generateExplanation({ topic: values.topic });
      setExplanation(result.explanation);
      if (user) {
        await saveReading({ userId: user.uid, topic: values.topic });
        fetchHistory(); // Refresh history
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get explanation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (topic: string) => {
    form.setValue('topic', topic);
    handleSearch({ topic });
  };

  return (
    <MainLayout>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Book />
                AI-Powered Library
              </CardTitle>
              <CardDescription>
                Enter any topic or subject to get a detailed explanation from our AI tutor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSearch)} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="e.g., 'Quantum Physics' or 'The History of the Internet'"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Search'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          )}

          {explanation && (
            <Card className="animate-in fade-in">
              <CardHeader>
                <CardTitle>{form.getValues('topic')}</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-body">
                {explanation}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <History />
                Reading History
              </CardTitle>
              <CardDescription>
                Review topics you've recently explored.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Your reading history is empty.
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => handleHistoryClick(item.topic)}
                    >
                      <span className="truncate">{item.topic}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">
                        {format(new Date(item.createdAt), 'PP')}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
