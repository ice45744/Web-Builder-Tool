import { motion } from "framer-motion";
import { Bell, ChevronRight, Award, Recycle, ClipboardList, AlertTriangle, BookOpen, QrCode } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Announcement } from "@shared/schema";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export function HomePage() {
  const { data: user } = useAuth();
  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: [api.announcements.list.path],
  });

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 rounded-b-[2.5rem] pt-12 pb-20 px-6 shadow-lg shadow-primary/20 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4 mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4 mix-blend-overlay" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex justify-between items-center"
        >
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">ยินดีต้อนรับกลับมา</p>
            <h1 className="text-2xl font-bold text-white font-display">{user.fullName}</h1>
            <p className="text-blue-200 text-xs mt-1">รหัสนักเรียน: {user.studentId}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white text-xl font-bold shadow-inner">
            {user.fullName.charAt(0)}
          </div>
        </motion.div>
      </div>

      {/* Main Content Area - Pulled up to overlap header */}
      <div className="px-5 -mt-10 relative z-20 space-y-5">
        
        {/* Quick Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <Award size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 font-display">{user.goodDeedPoints}</h3>
            <p className="text-xs text-slate-500 font-medium">แต้มความดี</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <Recycle size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 font-display">{user.garbageStamps}</h3>
            <p className="text-xs text-slate-500 font-medium">แสตมป์ขยะ</p>
          </div>
        </motion.div>

        {/* Announcements / News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <Bell size={18} className="text-primary" /> ประกาศจากสภานักเรียน
            </h2>
            <Link href="/announcements" className="text-xs font-medium text-primary hover:underline">ดูทั้งหมด</Link>
          </div>

          <div className="space-y-3">
            {announcements && announcements.length > 0 ? (
              announcements.slice(0, 2).map((ann) => (
                <Link key={ann.id} href="/announcements" className="block bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start active:scale-[0.98] transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-500">
                    <Bell size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-400">
                        {ann.createdAt && format(new Date(ann.createdAt), "d MMM yyyy", { locale: th })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-800 truncate">{ann.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ann.content}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-400 text-sm">
                ยังไม่มีประกาศใหม่
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link href="/activities" className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex flex-col gap-2 active:bg-primary/10 transition-colors">
              <ClipboardList className="text-primary w-6 h-6" />
              <span className="text-sm font-semibold text-primary">บันทึกกิจกรรม</span>
            </Link>
            <Link href="/report" className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex flex-col gap-2 active:bg-orange-100 transition-colors">
              <AlertTriangle className="text-orange-500 w-6 h-6" />
              <span className="text-sm font-semibold text-orange-600">แจ้งเรื่องร้องเรียน</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/manual" className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-2 active:bg-slate-100 transition-colors">
              <BookOpen className="text-slate-600 w-6 h-6" />
              <span className="text-sm font-semibold text-slate-700">คู่มือการใช้งาน</span>
            </Link>
            <Link href="/scanner" className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col gap-2 active:bg-emerald-100 transition-colors">
              <QrCode className="text-emerald-600 w-6 h-6" />
              <span className="text-sm font-semibold text-emerald-700">สแกนเช็คชื่อ</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
