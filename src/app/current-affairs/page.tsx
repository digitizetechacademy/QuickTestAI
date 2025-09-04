
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
      {
        title: 'Sports World: Paris Olympics Highlights',
        details: 'The 2024 Paris Olympics concluded with record-breaking performances and a spectacular closing ceremony. India celebrated its best-ever medal haul.',
      },
       {
        title: 'Tech Sector: New Data Privacy Bill Passed',
        details: 'A new comprehensive data privacy bill was passed, setting stricter guidelines for how companies collect and manage user data.',
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
       {
        title: 'Environmental Accord: Global Climate Conference',
        details: 'Nations agreed to new emission reduction targets at the annual global climate conference, aiming to accelerate the transition to renewable energy.',
      },
      {
        title: 'Major Infrastructure Project Inaugurated',
        details: 'A new national highway was inaugurated, significantly improving connectivity between major industrial hubs and reducing travel time.',
      },
      {
        title: 'Financial News: Reserve Bank Policy Review',
        details: 'The Reserve Bank of India announced its latest monetary policy, keeping key interest rates stable to balance inflation and economic growth.',
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
       {
        title: 'International Relations: Key Diplomatic Visit',
        details: 'A high-level diplomatic visit strengthened bilateral ties with a key strategic partner, focusing on trade, defense, and technology cooperation.',
      },
       {
        title: 'Startup Ecosystem: Unicorn Boom',
        details: 'India\'s startup ecosystem saw a surge in new unicorns, with several tech startups achieving billion-dollar valuations in the first half of the year.',
      },
      {
        title: 'Healthcare Advancements: National Health Mission Update',
        details: 'The National Health Mission announced the expansion of telemedicine services to remote areas, improving healthcare access for millions.',
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
