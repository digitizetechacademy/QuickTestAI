'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {User, onAuthStateChanged, signInWithPopup, signOut} from 'firebase/auth';
import {auth, googleProvider} from '@/lib/firebase';
import {useToast} from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
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
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      toast({
        title: 'Login Failed',
        description: 'Could not sign you in with Google. Please try again.',
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

  return (
    <AuthContext.Provider value={{user, loading, login, logout}}>
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
