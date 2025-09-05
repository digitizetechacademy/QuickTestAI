
'use client';

import MainLayout from '@/components/main-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

const monthlyData = [
    {
        month: "August 2025",
        monthKey: "month_august_2025",
        summaries: [
            {
                titleKey: "affairs_summit_title",
                detailsKey: "affairs_summit_details",
                category: "Economy"
            },
            {
                titleKey: "affairs_ai_title",
                detailsKey: "affairs_ai_details",
                category: "Technology"
            },
            {
                titleKey: "affairs_isro_title",
                detailsKey: "affairs_isro_details",
                category: "Technology"
            },
            {
                titleKey: "affairs_olympics_title",
                detailsKey: "affairs_olympics_details",
                category: "Sports"
            },
            {
                titleKey: "affairs_privacy_title",
                detailsKey: "affairs_privacy_details",
                category: "Politics"
            }
        ]
    },
    {
        month: "July 2025",
        monthKey: "month_july_2025",
        summaries: []
    },
    {
        month: "June 2025",
        monthKey: "month_june_2025",
        summaries: []
    }
];


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
    const { t } = useTranslation();

    const renderContent = () => {
        return (
            <Accordion type="single" collapsible defaultValue="item-0">
                {monthlyData.map((monthData, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-xl font-semibold">{t(monthData.monthKey)}</AccordionTrigger>
                        <AccordionContent>
                            {monthData.summaries.length > 0 ? (
                                <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                                    {monthData.summaries.map((summary, sIndex) => (
                                        <div key={sIndex} className="relative">
                                            <div className={cn("absolute -left-[27px] top-2 h-4 w-4 rounded-full", getCategoryColor(summary.category))} />
                                            <h4 className="font-bold text-base">{t(summary.titleKey)}</h4>
                                            <p className="text-sm text-muted-foreground">{t(summary.detailsKey)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic pl-4">{t('affairs_coming_soon')}</p>
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
            <h1 className="text-3xl md:text-4xl font-bold">{t('affairs_page_title')}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                {t('affairs_page_description')}
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
