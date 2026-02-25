import { motion } from "framer-motion";
import { Bell, ChevronRight, Award, Recycle, ClipboardList, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function HomePage() {
  const { data: user } = useAuth();

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
            <button className="text-xs font-medium text-primary hover:underline">ดูทั้งหมด</button>
          </div>

          <div className="space-y-3">
            {/* Mock Announcement 1 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start active:scale-[0.98] transition-transform">
              {/* school activity landing page photo */}
              <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=400&fit=crop" alt="Activity" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-md">ด่วน</span>
                  <span className="text-[10px] text-slate-400">วันนี้ 08:30</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-800 truncate">เชิญชวนร่วมบริจาคขยะรีไซเคิล</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">กิจกรรมธนาคารขยะเปิดรับฝากขวดพลาสติก แลกรับแสตมป์พิเศษ 2 เท่า เฉพาะสัปดาห์นี้</p>
              </div>
            </div>

            {/* Mock Announcement 2 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start active:scale-[0.98] transition-transform">
              <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-500">
                <Award size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md">ทั่วไป</span>
                  <span className="text-[10px] text-slate-400">เมื่อวาน</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-800 truncate">ประกาศผลคะแนนความดีประจำเดือน</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">ตรวจสอบรายชื่อนักเรียนที่มีคะแนนความดีสูงสุด 10 อันดับแรกของโรงเรียนได้แล้ว</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="grid grid-cols-2 gap-3">
            <Link href="/activities" className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex flex-col gap-2 active:bg-primary/10 transition-colors">
              <ClipboardList className="text-primary w-6 h-6" />
              <span className="text-sm font-semibold text-primary">บันทึกกิจกรรม</span>
            </Link>
            <Link href="/report" className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex flex-col gap-2 active:bg-orange-100 transition-colors">
              <AlertTriangle className="text-orange-500 w-6 h-6" />
              <span className="text-sm font-semibold text-orange-600">แจ้งเรื่องร้องเรียน</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
