
'use client';

import { useState, useEffect } from 'react';
import { format, getMonth, getYear, subMonths, differenceInMonths } from 'date-fns';
import { generateCurrentAffairs, type GenerateCurrentAffairsOutput } from '@/ai/flows/generate-current-affairs';
import MainLayout from '@/components/main-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthData {
  month: string;
  data: GenerateCurrentAffairsOutput | null;
  error?: string;
}

const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
        case 'politics': return 'bg-blue-500';
        case 'technology': return 'bg-green-500';
        case 'sports': return 'bg-red-500';
        case 'economy': return 'bg-yellow-500';
        case 'global': return 'bg-purple-500';
        case 'health': return 'bg-pink-500';
        default: return 'bg-primary';
    }
}


export default function CurrentAffairsPage() {
    const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
    const [loading, setLoading] = useState(true);
    const [numberOfMonths, setNumberOfMonths] = useState(0);

    useEffect(() => {
        const fetchAffairs = async () => {
            setLoading(true);
            const today = new Date();
            const start = new Date(2025, 0); // January 2025
            
            // Only fetch if today is in or after Jan 2025
            if (today < start) {
                setLoading(false);
                return;
            }

            const totalMonths = differenceInMonths(today, start) + 1;
            setNumberOfMonths(totalMonths);

            const monthPromises: Promise<MonthData>[] = [];

            for (let i = 0; i < totalMonths; i++) {
                const date = subMonths(today, i);
                const month = format(date, 'MMMM');
                const year = date.getFullYear();

                const promise = generateCurrentAffairs({ month, year })
                    .then(data => ({ month: `${month} ${year}`, data }))
                    .catch(err => {
                        console.error(`Failed to fetch current affairs for ${month} ${year}:`, err);
                        return { 
                            month: `${month} ${year}`, 
                            data: null, 
                            error: 'Could not load events for this month. Please try again later.' 
                        };
                    });
                monthPromises.push(promise);
            }
            
            const results = await Promise.all(monthPromises);
            setMonthlyData(results);
            setLoading(false);
        };

        fetchAffairs();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <Accordion type="single" collapsible defaultValue="item-0">
                    {[...Array(Math.min(numberOfMonths, 12) || 3)].map((_, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-xl font-semibold">
                                <Skeleton className="h-7 w-48" />
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                                    {[...Array(5)].map((_, sIndex) => (
                                        <div key={sIndex} className="relative">
                                            <Skeleton className="absolute -left-[27px] top-2 h-4 w-4 rounded-full" />
                                            <Skeleton className="h-5 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            );
        }

        if (monthlyData.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Current affairs data will be available starting January 2025.</p>
                </div>
            )
        }

        return (
            <Accordion type="single" collapsible defaultValue="item-0">
                {monthlyData.map((monthData, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-xl font-semibold">{monthData.month}</AccordionTrigger>
                        <AccordionContent>
                            {monthData.error && (
                                <Alert variant="destructive" className="my-4">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>Error</AlertTitle>
                                  <AlertDescription>
                                    {monthData.error}
                                  </AlertDescription>
                                </Alert>
                            )}
                            {monthData.data && (
                                <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                                    {monthData.data.summaries.map((summary, sIndex) => (
                                        <div key={sIndex} className="relative">
                                            <div className={cn("absolute -left-[27px] top-2 h-4 w-4 rounded-full", getCategoryColor(summary.category))} />
                                            <h4 className="font-bold text-base">{summary.title}</h4>
                                            <p className="text-sm text-muted-foreground">{summary.details}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        );
    }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Monthly Current Affairs</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                A summary of the most important national and international events, updated monthly by AI.
            </p>
        </div>
        <Card>
            <CardContent className="p-6">
                {renderContent()}
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
