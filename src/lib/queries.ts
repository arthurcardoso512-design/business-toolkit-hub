import { useQuery } from "@tanstack/react-query";

import type { ToolRow } from "@/components/tool-card";
import { supabase } from "@/integrations/supabase/client";

export type PlanRow = {
  id: string;
  name: string;
  slug: string;
  duration_days: number;
  price: number;
  sort_order: number;
};

export function useTools() {
  return useQuery<ToolRow[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, slug, category, description, is_free")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePlans() {
  return useQuery<PlanRow[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("id, name, slug, duration_days, price, sort_order")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, price: Number(p.price) }));
    },
  });
}
