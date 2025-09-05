
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/main-layout';
import { Building, ExternalLink, CalendarDays } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const jobs = [
  {
    id: 1,
    titleKey: 'job_ssc_cgl_title',
    departmentKey: 'job_ssc_cgl_dept',
    descriptionKey: 'job_ssc_cgl_desc',
    applyLink: 'https://www.google.com/search?q=SSC+CGL+recruitment',
    deadline: '2024-10-24',
  },
  {
    id: 2,
    titleKey: 'job_upsc_cs_title',
    departmentKey: 'job_upsc_cs_dept',
    descriptionKey: 'job_upsc_cs_desc',
    applyLink: 'https://www.google.com/search?q=UPSC+Civil+Services+recruitment',
    deadline: '2025-02-15',
  },
  {
    id: 3,
    titleKey: 'job_ibps_po_title',
    departmentKey: 'job_ibps_po_dept',
    descriptionKey: 'job_ibps_po_desc',
    applyLink: 'https://www.google.com/search?q=IBPS+PO+recruitment',
    deadline: '2024-11-05',
  },
  {
    id: 4,
    titleKey: 'job_rrb_ntpc_title',
    departmentKey: 'job_rrb_ntpc_dept',
    descriptionKey: 'job_rrb_ntpc_desc',
    applyLink: 'https://www.google.com/search?q=RRB+NTPC+recruitment',
    deadline: '2024-12-20',
  },
    {
    id: 5,
    titleKey: 'job_state_psc_title',
    departmentKey: 'job_state_psc_dept',
    descriptionKey: 'job_state_psc_desc',
    applyLink: 'https://www.google.com/search?q=State+Public+Service+Commission+exams',
    deadline: '2024-11-30',
  },
  {
    id: 6,
    titleKey: 'job_rbi_grade_b_title',
    departmentKey: 'job_rbi_grade_b_dept',
    descriptionKey: 'job_rbi_grade_b_desc',
    applyLink: 'https://www.google.com/search?q=RBI+Grade+B+Officer+recruitment',
    deadline: '2024-12-01',
  },
  {
    id: 7,
    titleKey: 'job_lic_aao_title',
    departmentKey: 'job_lic_aao_dept',
    descriptionKey: 'job_lic_aao_desc',
    applyLink: 'https://www.google.com/search?q=LIC+AAO+recruitment',
    deadline: '2024-11-15',
  },
  {
    id: 8,
    titleKey: 'job_esic_udc_title',
    departmentKey: 'job_esic_udc_dept',
    descriptionKey: 'job_esic_udc_desc',
    applyLink: 'https://www.google.com/search?q=ESIC+UDC+MTS+recruitment',
    deadline: '2025-01-10',
  },
  {
    id: 9,
    titleKey: 'job_fci_manager_title',
    departmentKey: 'job_fci_manager_dept',
    descriptionKey: 'job_fci_manager_desc',
    applyLink: 'https://www.google.com/search?q=FCI+Manager+recruitment',
    deadline: '2024-12-15',
  },
  {
    id: 10,
    titleKey: 'job_drdo_mts_title',
    departmentKey: 'job_drdo_mts_dept',
    descriptionKey: 'job_drdo_mts_desc',
    applyLink: 'https://www.google.com/search?q=DRDO+MTS+recruitment',
    deadline: '2025-03-05',
  },
];

export default function JobsPage() {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">{t('jobs_page_title')}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                {t('jobs_page_description')}
            </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{t(job.titleKey)}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <Building className="w-4 h-4" />
                    {t(job.departmentKey)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{t(job.descriptionKey)}</p>
                 <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {t('jobs_apply_deadline')}: {new Date(job.deadline).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={job.applyLink} target="_blank">
                    {t('jobs_apply_now')}
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
