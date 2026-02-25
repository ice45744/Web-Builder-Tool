import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Issue, InsertIssue } from "@shared/schema";

export function useCreateIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertIssue) => {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit issue");
      return res.json() as Promise<Issue>;
    },
    onSuccess: () => {
      toast({ title: "แจ้งเรื่องสำเร็จ", description: "สภานักเรียนได้รับเรื่องของคุณแล้ว" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "ข้อผิดพลาด", description: err.message });
    }
  });
}
