"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({
  user: null, profile: null, loading: true,
  refreshProfile: async () => {}, signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadedFor = useRef(null);

  const sync = useCallback(async (u) => {
    setUser(u);
    if (!u) {
      loadedFor.current = null;
      setProfile(null);
      setLoading(false);
      return;
    }
    if (loadedFor.current === u.id) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").eq("id", u.id).maybeSingle();
    loadedFor.current = u.id;
    setProfile(data || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => sync(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => sync(session?.user ?? null), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [sync]);

  const refreshProfile = async () => { loadedFor.current = null; await sync(user); };
  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
