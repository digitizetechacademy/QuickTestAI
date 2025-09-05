
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Book, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateExplanation } from '@/ai/flows/generate-explanation';
import MainLayout from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
});
type FormValues = z.infer<typeof formSchema>;

export default function LibraryPage() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const handleSearch: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setExplanation(null);
    try {
      const result = await generateExplanation({ topic: values.topic });
      setExplanation(result.explanation);
    } catch (error) {
      console.error(error);
      toast({
        title: 'error_toast_title',
        description: 'library_error_description',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Book />
              {t('library_page_title')}
            </CardTitle>
            <CardDescription>
              {t('library_page_description')}
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
                            placeholder={t('library_search_placeholder')}
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
                  {isLoading ? <Loader2 className="animate-spin" /> : t('search_button')}
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
    </MainLayout>
  );
}
