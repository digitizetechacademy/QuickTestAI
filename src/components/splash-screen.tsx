'use client';

import { BrainCircuit } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background">
      <div className="flex items-center gap-4 animate-pulse">
        <BrainCircuit className="w-16 h-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Quick Test AI</h1>
      </div>
      <p className="mt-4 text-muted-foreground">Loading your experience...</p>
    </div>
  );
}
