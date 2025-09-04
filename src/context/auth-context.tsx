
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {User, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {auth, googleProvider} from '@/lib/firebase';
import {useToast} from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const {toast} = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle the redirect result
    getRedirectResult(auth)
      .catch((error) => {
        console.error('Error during sign-in redirect:', error);
        toast({
            title: 'Login Failed',
            description: 'Could not sign you in with Google. Please try again.',
            variant: 'destructive',
        });
      });

    return () => unsubscribe();
  }, [toast]);

  const login = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
      toast({
        title: 'Login Failed',
        description: 'Could not initiate sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
       toast({
        title: 'Logout Failed',
        description: 'Could not sign you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  return (
    <AuthContext.Provider value={{user, loading, login, logout, signUpWithEmail, signInWithEmail}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
