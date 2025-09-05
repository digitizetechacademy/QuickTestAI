
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/main-layout';
import { Building, ExternalLink, CalendarDays } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'SSC CGL (Combined Graduate Level)',
    department: 'Staff Selection Commission',
    description: 'A major exam for recruitment to various Group B and C posts in ministries and departments of the Government of India.',
    applyLink: '#',
    deadline: '2024-10-24',
  },
  {
    id: 2,
    title: 'UPSC Civil Services',
    department: 'Union Public Service Commission',
    description: 'The premier exam for recruitment to top civil services like IAS, IPS, and IFS. A highly competitive and prestigious opportunity.',
    applyLink: '#',
    deadline: '2025-02-15',
  },
  {
    id: 3,
    title: 'IBPS PO (Probationary Officer)',
    department: 'Institute of Banking Personnel Selection',
    description: 'A common written exam for the recruitment of Probationary Officers in multiple public sector banks across India.',
    applyLink: '#',
    deadline: '2024-11-05',
  },
  {
    id: 4,
    title: 'RRB NTPC (Non-Technical Popular Categories)',
    department: 'Railway Recruitment Board',
    description: 'Recruitment for various non-technical posts in the Indian Railways, including roles like clerk, time keeper, and station master.',
    applyLink: '#',
    deadline: '2024-12-20',
  },
    {
    id: 5,
    title: 'State PSC (Public Service Commission)',
    department: 'Various State Governments',
    description: 'Each state conducts its own civil service exams for recruitment to administrative positions within the state government.',
    applyLink: '#',
    deadline: '2024-11-30',
  },
  {
    id: 6,
    title: 'RBI Grade B Officer',
    department: 'Reserve Bank of India',
    description: 'A highly sought-after position for managing the country\'s financial and banking systems. Involves policy making and regulation.',
    applyLink: '#',
    deadline: '2024-12-01',
  },
  {
    id: 7,
    title: 'LIC AAO (Assistant Administrative Officer)',
    department: 'Life Insurance Corporation of India',
    description: 'A role focused on administrative duties within the largest insurance company in India, offering a stable and rewarding career path.',
    applyLink: '#',
    deadline: '2024-11-15',
  },
  {
    id: 8,
    title: 'ESIC UDC/MTS',
    department: 'Employees\' State Insurance Corporation',
    description: 'Recruitment for Upper Division Clerk and Multi-Tasking Staff roles to manage social security and health insurance for workers.',
    applyLink: '#',
    deadline: '2025-01-10',
  },
  {
    id: 9,
    title: 'FCI Manager',
    department: 'Food Corporation of India',
    description: 'Managerial roles responsible for overseeing the procurement, storage, and distribution of food grains across the country.',
    applyLink: '#',
    deadline: '2024-12-15',
  },
  {
    id: 10,
    title: 'DRDO MTS',
    department: 'Defence Research & Development Organisation',
    description: 'Multi-Tasking Staff positions supporting scientists and engineers in Indias premier defense research organization.',
    applyLink: '#',
    deadline: '2025-03-05',
  },
];

export default function JobsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Top 10 Latest Government Job Openings</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                This section highlights the top 10 latest major government job opportunities in India. The list is updated periodically to reflect current openings.
            </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <Building className="w-4 h-4" />
                    {job.department}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{job.description}</p>
                 <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Last Date to Apply: {new Date(job.deadline).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={job.applyLink} target="_blank">
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
