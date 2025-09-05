'use client';

import { useAuth } from '@/context/auth-context';
import QuizApp from '@/components/quiz-app';
import SplashScreen from '@/components/splash-screen';
import LoginPage from '@/components/login-page';
import MainLayout from '@/components/main-layout';

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
      </div>
    </MainLayout>
  );
}
