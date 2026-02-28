import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { DiseaseScan } from "@shared/schema";
import { z } from "zod";

export function useScans() {
  return useQuery({
    queryKey: [api.scans.list.path],
    queryFn: async () => {
      const res = await fetch(api.scans.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scans");
      return api.scans.list.responses[200].parse(await res.json());
    },
  });
}

type ScanInput = z.infer<typeof api.scans.create.input>;

export function useCreateScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ScanInput) => {
      const res = await fetch(api.scans.create.path, {
        method: api.scans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to analyze image");
      return api.scans.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.scans.list.path] }),
  });
}
