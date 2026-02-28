import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Ngo, InsertNgo } from "@shared/schema";

export function useNgos() {
  return useQuery({
    queryKey: [api.ngos.list.path],
    queryFn: async () => {
      const res = await fetch(api.ngos.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch NGOs");
      return api.ngos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateNgo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertNgo) => {
      const res = await fetch(api.ngos.create.path, {
        method: api.ngos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create NGO");
      }
      return api.ngos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.ngos.list.path] }),
  });
}
