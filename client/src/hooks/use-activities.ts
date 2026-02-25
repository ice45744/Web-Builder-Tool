import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { GoodDeed, InsertGoodDeed, GarbageTransaction } from "@shared/schema";

export function useGoodDeeds() {
  return useQuery<GoodDeed[]>({
    queryKey: ["/api/good-deeds"],
    queryFn: async () => {
      const res = await fetch("/api/good-deeds", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch good deeds");
      return res.json();
    }
  });
}

export function useCreateGoodDeed() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGoodDeed) => {
      const res = await fetch("/api/good-deeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit good deed");
      return res.json() as Promise<GoodDeed>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/good-deeds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({ title: "บันทึกความดีสำเร็จ", description: "ข้อมูลของคุณถูกส่งเข้าระบบแล้ว" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "ข้อผิดพลาด", description: err.message });
    }
  });
}

export function useGarbageTransactions() {
  return useQuery<GarbageTransaction[]>({
    queryKey: ["/api/garbage-transactions"],
    queryFn: async () => {
      const res = await fetch("/api/garbage-transactions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch garbage transactions");
      return res.json();
    }
  });
}
