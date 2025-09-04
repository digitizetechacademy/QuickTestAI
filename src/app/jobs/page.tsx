import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/main-layout';
import { Building, ExternalLink } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Junior Clerk',
    department: 'State Revenue Department',
    description: 'Responsible for administrative tasks, data entry, and file management. Requires good organizational skills and attention to detail.',
    applyLink: '#',
  },
  {
    id: 2,
    title: 'Software Development Trainee',
    department: 'National Informatics Centre',
    description: 'Join a team of developers working on national-level software projects. A great opportunity to learn and grow in a dynamic environment.',
    applyLink: '#',
  },
  {
    id: 3,
    title: 'Technical Assistant',
    department: 'Indian Space Research Organisation (ISRO)',
    description: 'Assist scientists and engineers in various technical tasks related to space missions. Basic knowledge of electronics or mechanical engineering required.',
    applyLink: '#',
  },
  {
    id: 4,
    title: 'Data Entry Operator',
    department: 'Public Service Commission',
    description: 'High-speed data entry and verification for various government departments. Requires accuracy and proficiency with computer applications.',
    applyLink: '#',
  },
    {
    id: 5,
    title: 'Security Constable',
    department: 'Railway Protection Force (RPF)',
    description: 'Ensure the safety and security of railway passengers, property, and assets. Requires physical fitness and a commitment to public service.',
    applyLink: '#',
  },
];

export default function JobsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Upcoming Government Jobs</h1>
            <p className="text-muted-foreground mt-2">
                Explore the latest career opportunities in the public sector.
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