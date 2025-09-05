'use client';

import { useAuth } from '@/context/auth-context';
import QuizApp from '@/components/quiz-app';
import SplashScreen from '@/components/splash-screen';
import LoginPage from '@/components/login-page';
import MainLayout from '@/components/main-layout';
import QuizHistory from '@/components/quiz-history';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <QuizApp />
        <Separator />
        <QuizHistory />
      </div>
    </MainLayout>
  );
}
