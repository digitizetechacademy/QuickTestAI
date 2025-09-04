
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

const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});
type SignInFormValues = z.infer<typeof signInSchema>;

const signUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function LoginPage() {
  const { login, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const { toast } = useToast();

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleGoogleLogin = async () => {
    setIsGoogleSigningIn(true);
    await login();
    // No need to set to false, as the page will redirect
  };

  const handleEmailSignIn: SubmitHandler<SignInFormValues> = async (values) => {
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

  const handleEmailSignUp: SubmitHandler<SignUpFormValues> = async (values) => {
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
    <div className="flex justify-center items-center h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center">
            <div className="flex flex-col items-center gap-4 mb-4">
                <BrainCircuit className="w-16 h-16 text-primary" />
                <CardTitle className="text-3xl md:text-4xl font-bold">Welcome to Quick Test AI</CardTitle>
            </div>
          <CardDescription className="text-base">
            Choose your preferred method to sign in and start learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="pt-4">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleEmailSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Mail /> Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><KeyRound /> Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSigningIn}>
                    {isSigningIn ? <Loader2 className="animate-spin" /> : 'Sign In'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup" className="pt-4">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleEmailSignUp)} className="space-y-4">
                   <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Mail /> Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><KeyRound /> Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Must be at least 6 characters" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSigningUp}>
                    {isSigningUp ? <Loader2 className="animate-spin" /> : <><UserPlus className="mr-2"/> Create Account</>}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="google" className="pt-4">
                <Card className="bg-secondary/50 border-dashed">
                    <CardContent className="pt-6 text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Use your Google account for quick and easy access. No extra passwords to remember.
                        </p>
                        <Button onClick={handleGoogleLogin} className="w-full" size="lg" disabled={isGoogleSigningIn}>
                            {isGoogleSigningIn ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <LogIn className="mr-2 h-5 w-5" />
                            )}
                            Sign in with Google
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
