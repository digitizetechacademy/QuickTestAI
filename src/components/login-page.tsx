'use client';

import { BrainCircuit, LogIn } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="flex justify-center items-center h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center">
            <div className="flex flex-col items-center gap-4 mb-4">
                <BrainCircuit className="w-16 h-16 text-primary" />
                <CardTitle className="text-3xl md:text-4xl font-bold">Welcome to Quick Test AI</CardTitle>
            </div>
          <CardDescription className="text-base">
            Sign in to create quizzes, track your progress, and challenge your knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} className="w-full" size="lg">
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
