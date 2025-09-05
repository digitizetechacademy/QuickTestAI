
import MainLayout from '@/components/main-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const monthlyData = [
    {
        month: "August 2025",
        summaries: [
            {
                title: "Global Economic Summit Concludes",
                details: "Leaders from G20 nations met to discuss strategies for sustainable economic growth, focusing on digital trade and climate finance. Key agreements were reached on international tax reform.",
                category: "Economy"
            },
            {
                title: "Major Breakthrough in AI Drug Discovery",
                details: "Researchers announced the use of an advanced AI model to identify a new class of antibiotics capable of combating drug-resistant bacteria, a significant milestone in medicine.",
                category: "Technology"
            },
            {
                title: "India Launches New Space Exploration Mission",
                details: "ISRO successfully launched its latest mission to study the outer solar system, carrying advanced instruments to analyze planetary atmospheres and magnetic fields.",
                category: "Technology"
            },
            {
                title: "Sports World: Paris Olympics Highlights",
                details: "The 2024 Paris Olympics concluded with record-breaking performances and a spectacular closing ceremony. India celebrated its best-ever medal haul.",
                category: "Sports"
            },
            {
                title: "Tech Sector: New Data Privacy Bill Passed",
                details: "A new comprehensive data privacy bill was passed, setting stricter guidelines for how companies collect and manage user data.",
                category: "Politics"
            }
        ]
    },
    {
        month: "July 2025",
        summaries: []
    },
    {
        month: "June 2025",
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

    const renderContent = () => {
        return (
            <Accordion type="single" collapsible defaultValue="item-0">
                {monthlyData.map((monthData, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-xl font-semibold">{monthData.month}</AccordionTrigger>
                        <AccordionContent>
                            {monthData.summaries.length > 0 ? (
                                <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                                    {monthData.summaries.map((summary, sIndex) => (
                                        <div key={sIndex} className="relative">
                                            <div className={cn("absolute -left-[27px] top-2 h-4 w-4 rounded-full", getCategoryColor(summary.category))} />
                                            <h4 className="font-bold text-base">{summary.title}</h4>
                                            <p className="text-sm text-muted-foreground">{summary.details}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic pl-4">Updates for this month will be available soon.</p>
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
                A summary of the most important national and international events, updated monthly.
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
