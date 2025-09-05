'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ClipboardList, Loader2, Search, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateExamResult, type GenerateExamResultOutput } from '@/ai/flows/generate-exam-result';
import MainLayout from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  examName: z.string().min(5, 'Exam name must be at least 5 characters long.'),
});
type FormValues = z.infer<typeof formSchema>;

export default function ResultsPage() {
  const [result, setResult] = useState<GenerateExamResultOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { examName: '' },
  });

  const handleSearch: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateExamResult({ examName: values.examName });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'error_toast_title',
        description: 'results_error_description',
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
              <ClipboardList />
              {t('results_page_title')}
            </CardTitle>
            <CardDescription>
              {t('results_page_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSearch)} className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name="examName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder={t('results_search_placeholder')}
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
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="animate-in fade-in">
            <CardHeader>
              <CardTitle>{form.getValues('examName')}</CardTitle>
              <CardDescription>{result.resultSummary}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">{t('results_cutoff_title')}</h4>
                {result.cutoffMarks.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>{t('results_table_category')}</TableHead>
                            <TableHead className="text-right">{t('results_table_marks')}</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {result.cutoffMarks.map((cutoff, index) => (
                            <TableRow key={index}>
                            <TableCell className="font-medium">{cutoff.category}</TableCell>
                            <TableCell className="text-right">{cutoff.marks}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground">{t('results_no_cutoffs')}</p>
                )}
            </CardContent>
            <CardFooter>
                <Button asChild>
                  <Link href={result.officialLink} target="_blank">
                    {t('results_view_source')}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
