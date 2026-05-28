import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User as SupaUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildName = (su: SupaUser, first?: string | null, last?: string | null) => {
  const meta = su.user_metadata ?? {};
  const f = first ?? meta.first_name ?? "";
  const l = last ?? meta.last_name ?? "";
  const full = `${f} ${l}`.trim();
  return full || su.email?.split("@")[0] || "User";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateUser = async (su: SupaUser | null) => {
    if (!su) {
      setUser(null);
      return;
    }
    // Defer DB read to avoid deadlock with onAuthStateChange
    setTimeout(async () => {
      const [{ data: profile }, { data: roleRow }] = await Promise.all([
        supabase.from("profiles").select("first_name,last_name,email").eq("id", su.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", su.id).maybeSingle(),
      ]);
      setUser({
        id: su.id,
        email: profile?.email ?? su.email ?? "",
        name: buildName(su, profile?.first_name, profile?.last_name),
        role: (roleRow?.role as UserRole) ?? "user",
      });
    }, 0);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      hydrateUser(sess?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      hydrateUser(sess?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const refreshRole = async () => {
    if (session?.user) await hydrateUser(session.user);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoggedIn: !!session, loading, logout, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
