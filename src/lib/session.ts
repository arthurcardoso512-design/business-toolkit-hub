import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export type AccountState = {
  profile: { id: string; name: string; email: string; company_name: string } | null;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  isAdmin: boolean;
};

/**
 * O status Premium vem sempre do banco (funções is_premium / premium_expires_at),
 * nunca do estado local do navegador.
 */
export function useAccount() {
  const { user, loading } = useSession();

  const query = useQuery<AccountState>({
    queryKey: ["account", user?.id ?? "anon"],
    enabled: !loading && !!user,
    queryFn: async () => {
      const [profileRes, premiumRes, expiresRes, adminRes] = await Promise.all([
        supabase.from("profiles").select("id, name, email, company_name").eq("id", user!.id).maybeSingle(),
        supabase.rpc("is_premium", { _user_id: user!.id }),
        supabase.rpc("premium_expires_at", { _user_id: user!.id }),
        supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" }),
      ]);

      return {
        profile: profileRes.data ?? null,
        isPremium: premiumRes.data === true,
        premiumExpiresAt: (expiresRes.data as string | null) ?? null,
        isAdmin: adminRes.data === true,
      };
    },
  });

  return {
    user,
    loading: loading || (!!user && query.isLoading),
    account: query.data ?? null,
    error: query.error,
    refetch: query.refetch,
  };
}

export function daysUntil(dateIso: string) {
  const diff = new Date(dateIso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("pt-BR");
}

export function formatPrice(value: number | string) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
