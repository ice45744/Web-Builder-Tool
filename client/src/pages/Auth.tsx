import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, User, Lock, Hash, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogin, useRegister } from "@/hooks/use-auth";

const loginSchema = z.object({
  studentId: z.string().min(1, "กรุณากรอกรหัสนักเรียน"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "กรุณากรอกชื่อ-นามสกุล"),
  studentId: z.string().min(1, "กรุณากรอกรหัสนักเรียน"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  committeeCode: z.string().optional(),
});

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { studentId: "", password: "" }
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", studentId: "", password: "", committeeCode: "" }
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header Logo */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-400 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center mb-4 text-white rotate-3 hover:rotate-6 transition-transform">
            <TrendingUp size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight text-center font-display">S.T. ก้าวหน้า</h1>
          <p className="text-slate-500 mt-2 font-medium">ระบบดิจิทัล สภานักเรียน</p>
        </motion.div>

        {/* Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Decorative gradients inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="relative z-10">
            <TabsList className="grid grid-cols-2 w-full mb-8 bg-slate-100/80 p-1 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">ลงทะเบียนใหม่</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {activeTab === "login" && (
                <TabsContent value="login" asChild forceMount>
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">รหัสนักเรียน</label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input 
                            placeholder="เช่น 12345" 
                            className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                            {...loginForm.register("studentId")}
                          />
                        </div>
                        {loginForm.formState.errors.studentId && (
                          <p className="text-xs text-destructive ml-1">{loginForm.formState.errors.studentId.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">รหัสผ่าน</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                            {...loginForm.register("password")}
                          />
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-xs text-destructive ml-1">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loginMutation.isPending}
                        className="w-full h-12 mt-6 rounded-xl font-medium text-base bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                      >
                        {loginMutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                      </Button>
                    </form>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "register" && (
                <TabsContent value="register" asChild forceMount>
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">ชื่อ-นามสกุล</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input 
                            placeholder="ด.ช. ก้าวหน้า เรียนดี" 
                            className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                            {...registerForm.register("fullName")}
                          />
                        </div>
                        {registerForm.formState.errors.fullName && (
                          <p className="text-xs text-destructive ml-1">{registerForm.formState.errors.fullName.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">รหัสนักเรียน</label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input 
                            placeholder="12345" 
                            className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                            {...registerForm.register("studentId")}
                          />
                        </div>
                        {registerForm.formState.errors.studentId && (
                          <p className="text-xs text-destructive ml-1">{registerForm.formState.errors.studentId.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">รหัสผ่าน</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                            {...registerForm.register("password")}
                          />
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-xs text-destructive ml-1">{registerForm.formState.errors.password.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">รหัสสำหรับสภานักเรียน (ถ้ามี)</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input 
                            placeholder="เว้นว่างได้" 
                            className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                            {...registerForm.register("committeeCode")}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={registerMutation.isPending}
                        className="w-full h-12 mt-6 rounded-xl font-medium text-base bg-slate-800 hover:bg-slate-700 text-white shadow-lg shadow-slate-800/20 transition-all duration-300"
                      >
                        {registerMutation.isPending ? "กำลังลงทะเบียน..." : "ลงทะเบียนเข้าใช้งาน"}
                      </Button>
                    </form>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
