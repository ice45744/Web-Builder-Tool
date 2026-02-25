import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-background relative shadow-2xl shadow-slate-200/50 min-h-screen pb-24 overflow-x-hidden flex flex-col">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
