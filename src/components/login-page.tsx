
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BrainCircuit, LogIn, Loader2, KeyRound, Mail, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const authSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});
type AuthFormValues = z.infer<typeof authSchema>;

export default function LoginPage() {
  const { login, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleGoogleLogin = async () => {
    setIsGoogleSigningIn(true);
    await login();
    // No need to set to false, as the page will redirect
  };

  const handleEmailSignIn: SubmitHandler<AuthFormValues> = async (values) => {
    setIsSigningIn(true);
    try {
      await signInWithEmail(values.email, values.password);
    } catch (error: any) {
      toast({
        title: 'Sign In Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignUp: SubmitHandler<AuthFormValues> = async (values) => {
    setIsSigningUp(true);
    try {
      await signUpWithEmail(values.email, values.password);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          title: 'Sign Up Failed',
          description: 'This email is already in use. Please sign in instead.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign Up Failed',
          description: 'Could not create your account. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
            <BrainCircuit className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to Quick Test AI</h1>
            <p className="text-muted-foreground mt-2">
                Your personal AI-powered learning assistant.
            </p>
        </div>

        <div className="space-y-6">
             <Button onClick={handleGoogleLogin} className="w-full" size="lg" disabled={isGoogleSigningIn}>
                {isGoogleSigningIn ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.8 64.4C305.9 99.4 279.1 86 248 86c-82.3 0-149.3 66.9-149.3 149.3s67 149.3 149.3 149.3c96.1 0 133.3-67.9 138-104.5H248v-85.3h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path></svg>
                )}
                Continue with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                    </span>
                </div>
            </div>

            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                            type="button"
                            variant="secondary" 
                            className="w-full" 
                            disabled={isSigningIn || isSigningUp}
                            onClick={form.handleSubmit(handleEmailSignIn)}
                        >
                            {isSigningIn ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </Button>
                        <Button 
                            type="button"
                            className="w-full" 
                            disabled={isSigningIn || isSigningUp}
                            onClick={form.handleSubmit(handleEmailSignUp)}
                        >
                            {isSigningUp ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
      </div>
    </div>
  );
}
