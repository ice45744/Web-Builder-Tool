import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export function useAuth() {
  return useQuery<User | null>({
    queryKey: ["/api/me"],
    queryFn: async () => {
      const res = await fetch("/api/me", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: { studentId: string; password: string }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return res.json() as Promise<User>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      toast({ title: "เข้าสู่ระบบสำเร็จ", description: `ยินดีต้อนรับ ${user.fullName}` });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: error.message });
    }
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return res.json() as Promise<User>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      toast({ title: "ลงทะเบียนสำเร็จ", description: "ยินดีต้อนรับสู่ระบบ S.T. ดิจิทัล" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "เกิดข้อผิดพลาด", description: error.message });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
      queryClient.clear();
      toast({ title: "ออกจากระบบแล้ว", description: "ขอบคุณที่ใช้งานระบบ" });
    }
  });
}
