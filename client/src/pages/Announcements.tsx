import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Megaphone, Calendar } from "lucide-react";
import { type Announcement } from "@shared/schema";

export function AnnouncementsPage() {
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: [api.announcements.list.path],
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
          <Megaphone className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 font-display">ประกาศจากสภานักเรียน</h1>
      </div>

      <div className="space-y-4">
        {announcements?.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-100">
            ยังไม่มีประกาศในขณะนี้
          </div>
        ) : (
          announcements?.map((ann) => (
            <Card key={ann.id} className="border-none shadow-sm overflow-hidden bg-white/80 backdrop-blur-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ann.createdAt && format(new Date(ann.createdAt), "d MMM yyyy", { locale: th })}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {ann.authorRole === "committee" ? "สภานักเรียน" : "ฝ่ายวิชาการ"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-slate-800 mb-2">{ann.title}</h3>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
