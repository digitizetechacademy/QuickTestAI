
'use client';

// This page is no longer in use as the history is displayed on the home page.
// It is kept to prevent broken links but can be removed in the future.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/splash-screen';

export default function HistoryPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);
  return <SplashScreen />;
}
