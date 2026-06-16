import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Role = "admin" | "moderator" | "user" | "super_admin";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: Role[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  roles: [],
  isAdmin: false,
  isSuperAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => {
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", sess.user.id)
            .then(({ data }) => setRoles((data ?? []).map((r: { role: Role }) => r.role)));
        }, 0);
      } else {
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .then(({ data: r }) => setRoles((r ?? []).map((x: { role: Role }) => x.role)));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        loading,
        roles,
        isAdmin: roles.includes("admin") || roles.includes("super_admin") || roles.includes("moderator"),
        isSuperAdmin: roles.includes("super_admin"),
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
