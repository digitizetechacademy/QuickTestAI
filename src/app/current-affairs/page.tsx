
import MainLayout from '@/components/main-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const currentAffairsData = [
  {
    month: 'August 2024',
    summaries: [
      {
        title: 'Global Economic Summit Concludes',
        details: 'Leaders from G20 nations met to discuss strategies for sustainable economic growth, focusing on digital trade and climate finance. Key agreements were reached on international tax reform.',
      },
      {
        title: 'Major Breakthrough in AI Drug Discovery',
        details: 'Researchers announced the use of an advanced AI model to identify a new class of antibiotics capable of combating drug-resistant bacteria, a significant milestone in medicine.',
      },
      {
        title: 'India Launches New Space Exploration Mission',
        details: 'ISRO successfully launched its latest mission to study the outer solar system, carrying advanced instruments to analyze planetary atmospheres and magnetic fields.',
      },
    ],
  },
  {
    month: 'July 2024',
    summaries: [
      {
        title: 'National Education Policy Update',
        details: 'The government introduced new reforms under the National Education Policy, emphasizing skill-based learning and the integration of technology in classrooms across the country.',
      },
      {
        title: 'Record Foreign Direct Investment (FDI) Inflow',
        details: 'India reported its highest-ever quarterly FDI inflow, with significant investments in the technology, manufacturing, and renewable energy sectors, boosting economic confidence.',
      },
    ],
  },
  {
    month: 'June 2024',
    summaries: [
      {
        title: 'Monsoon Session of Parliament Begins',
        details: 'The Parliament convened for its monsoon session, with key legislative agendas including the new data protection bill and amendments to the Goods and Services Tax (GST) laws.',
      },
      {
        title: 'Digital India Initiative Expands',
        details: 'New services were launched under the Digital India program, aimed at providing high-speed internet access to more rural areas and promoting digital literacy nationwide.',
      },
    ],
  },
];


export default function CurrentAffairsPage() {
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
                <Accordion type="single" collapsible defaultValue="item-0">
                {currentAffairsData.map((monthData, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-xl font-semibold">{monthData.month}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                            {monthData.summaries.map((summary, sIndex) => (
                                <div key={sIndex} className="relative">
                                     <div className="absolute -left-[27px] top-2 h-4 w-4 rounded-full bg-primary" />
                                    <h4 className="font-bold text-base">{summary.title}</h4>
                                    <p className="text-sm text-muted-foreground">{summary.details}</p>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
