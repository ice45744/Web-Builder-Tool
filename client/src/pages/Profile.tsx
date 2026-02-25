import { motion } from "framer-motion";
import { User, LogOut, Settings, Award, Recycle, ShieldCheck, ChevronRight } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function ProfilePage() {
  const { data: user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-full pb-8 bg-slate-50">
      {/* Header Profile Area */}
      <div className="bg-white pt-16 pb-8 px-6 border-b border-slate-100 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-300 p-1 mb-4 shadow-xl shadow-primary/20">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-primary">
              {user.fullName.charAt(0)}
            </div>
          </div>
          {user.role !== 'student' && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
              <ShieldCheck size={16} />
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 font-display">{user.fullName}</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">รหัส: {user.studentId}</p>
        
        {user.role !== 'student' && (
          <span className="mt-3 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full">
            กรรมการนักเรียน
          </span>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 space-y-6"
      >
        {/* Stats Summary */}
        <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 flex">
          <div className="flex-1 p-3 flex flex-col items-center justify-center border-r border-slate-100">
            <Award className="text-amber-500 mb-1" size={20} />
            <span className="text-xl font-bold text-slate-800 font-display">{user.goodDeedPoints}</span>
            <span className="text-[10px] text-slate-500 font-medium">แต้มความดี</span>
          </div>
          <div className="flex-1 p-3 flex flex-col items-center justify-center">
            <Recycle className="text-emerald-500 mb-1" size={20} />
            <span className="text-xl font-bold text-slate-800 font-display">{user.garbageStamps}</span>
            <span className="text-[10px] text-slate-500 font-medium">แสตมป์ขยะ</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <User size={18} />
              </div>
              <span className="text-sm font-medium text-slate-700">แก้ไขข้อมูลส่วนตัว</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Settings size={18} />
              </div>
              <span className="text-sm font-medium text-slate-700">ตั้งค่าระบบ</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-full h-14 rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 bg-white font-medium shadow-sm transition-all"
        >
          <LogOut size={18} className="mr-2" />
          {logout.isPending ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
        </Button>
        
        <p className="text-center text-[10px] text-slate-400 mt-8">
          S.T. Digital System v1.0.0<br/>
          พัฒนาโดยสภานักเรียนโรงเรียน
        </p>
      </motion.div>
    </div>
  );
}
