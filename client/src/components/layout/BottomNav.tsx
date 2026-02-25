import { Link, useLocation } from "wouter";
import { Home, ClipboardList, Megaphone, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "หน้าหลัก", icon: Home },
  { path: "/activities", label: "กิจกรรม", icon: ClipboardList },
  { path: "/announcements", label: "ประกาศ", icon: Megaphone },
  { path: "/profile", label: "โปรไฟล์", icon: UserCircle },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pointer-events-auto pb-safe">
        <nav className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path} className="relative flex-1 group">
                <div className="flex flex-col items-center justify-center py-2 px-1 gap-1">
                  <div className={cn(
                    "relative p-1.5 rounded-xl transition-colors duration-300",
                    isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                  )}>
                    <item.icon className="w-6 h-6 z-10 relative" strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors duration-300",
                    isActive ? "text-primary" : "text-slate-400"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
