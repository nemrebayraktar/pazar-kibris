import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    })();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.full_name || '',
        phone: profile?.phone,
        isAdmin: profile?.is_admin || false
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        await supabase
          .from('profiles')
          .update({
            full_name: name,
            phone: phone
          })
          .eq('id', data.user.id);

        await loadUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};