import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Pet, InsertPet, UpdatePet } from "@shared/schema";

export function usePets() {
  return useQuery({
    queryKey: [api.pets.list.path],
    queryFn: async () => {
      const res = await fetch(api.pets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pets");
      return api.pets.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPet) => {
      const res = await fetch(api.pets.create.path, {
        method: api.pets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add pet");
      return api.pets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.pets.list.path] }),
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdatePet) => {
      const url = buildUrl(api.pets.update.path, { id });
      const res = await fetch(url, {
        method: api.pets.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update pet");
      return api.pets.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.pets.list.path] }),
  });
}
