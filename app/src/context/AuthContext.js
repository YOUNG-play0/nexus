import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const GUEST_PSEUDO_KEY = 'auth:guest_pseudo';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, pseudo, isGuest }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    async function restore() {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setUser({ id: data.session.user.id, pseudo: data.session.user.email, isGuest: false });
          setLoading(false);
          return;
        }
      }
      const storedPseudo = await AsyncStorage.getItem(GUEST_PSEUDO_KEY);
      if (storedPseudo) {
        setUser({ id: `guest:${storedPseudo}`, pseudo: storedPseudo, isGuest: true });
      }
      setLoading(false);
    }
    restore();

    if (isSupabaseConfigured) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser({ id: session.user.id, pseudo: session.user.email, isGuest: false });
        }
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    }

    return () => unsubscribe?.();
  }, []);

  // Mode invité : juste un pseudo, sans mot de passe, pour aller vite (cahier des charges §3).
  // La progression associée reste stockée en local sur l'appareil (voir src/lib/progress.js).
  const signInAsGuest = async (pseudo) => {
    await AsyncStorage.setItem(GUEST_PSEUDO_KEY, pseudo);
    setUser({ id: `guest:${pseudo}`, pseudo, isGuest: true });
  };

  const signUpWithEmail = async (email, password) => {
    if (!isSupabaseConfigured) throw new Error('Supabase n’est pas encore configuré.');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signInWithEmail = async (email, password) => {
    if (!isSupabaseConfigured) throw new Error('Supabase n’est pas encore configuré.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    await AsyncStorage.removeItem(GUEST_PSEUDO_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, signInAsGuest, signUpWithEmail, signInWithEmail, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  return ctx;
}
