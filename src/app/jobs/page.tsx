
'use client';

import MainLayout from '@/components/main-layout';
import { useTranslation } from '@/hooks/use-translation';

export default function JobsPage() {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold">{t('jobs_page_title')}</h1>
        <p className="text-muted-foreground mt-2">{t('jobs_page_description')}</p>
      </div>
    </MainLayout>
  );
}
