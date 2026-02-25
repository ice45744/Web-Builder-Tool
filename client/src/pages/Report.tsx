import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Camera, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateIssue } from "@/hooks/use-issues";

const CATEGORIES = [
  "อุปกรณ์ในห้องเรียนเสียหาย",
  "ความสะอาดในโรงเรียน",
  "ห้องน้ำชำรุด/ไม่สะอาด",
  "พฤติกรรมไม่เหมาะสม",
  "ข้อเสนอแนะอื่นๆ"
];

export function ReportPage() {
  const createIssue = useCreateIssue();
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !details) return;
    
    createIssue.mutate({ category, details, imageUrl }, {
      onSuccess: () => {
        setCategory("");
        setDetails("");
        setImageUrl("");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-gradient-to-b from-orange-50 to-slate-50 border-b border-orange-100/50 sticky top-0 z-30">
        <h1 className="text-2xl font-bold text-slate-800 font-display flex items-center gap-2">
          <AlertTriangle className="text-orange-500" /> แจ้งปัญหา
        </h1>
        <p className="text-slate-500 text-sm mt-2">พบปัญหาหรือมีข้อเสนอแนะ แจ้งสภานักเรียนได้ที่นี่</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5"
      >
        <div className="bg-orange-50/50 rounded-xl p-4 flex gap-3 items-start border border-orange-100 mb-6">
          <Info className="text-orange-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-orange-800/80 leading-relaxed">
            ข้อมูลของคุณจะถูกเก็บเป็นความลับ สภานักเรียนจะตรวจสอบและดำเนินการแก้ไขปัญหาอย่างเร็วที่สุด
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1 flex items-center gap-1.5">
              <MapPin size={16} className="text-slate-400" /> ประเภทของปัญหา
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl focus:ring-orange-500/20">
                <SelectValue placeholder="เลือกหมวดหมู่..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-slate-400" /> รายละเอียด
            </label>
            <Textarea 
              placeholder="อธิบายสถานที่และปัญหาที่พบอย่างละเอียด..."
              className="resize-none bg-white border-slate-200 rounded-xl focus:ring-orange-500/20 p-4"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1 flex items-center gap-1.5">
              <Camera size={16} className="text-slate-400" /> รูปภาพประกอบ (ลิงก์)
            </label>
            <Input 
              placeholder="https://..."
              className="h-12 bg-white border-slate-200 rounded-xl focus:ring-orange-500/20"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            disabled={!category || !details || createIssue.isPending}
            className="w-full h-12 mt-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl shadow-lg shadow-orange-500/25 font-medium text-base transition-all"
          >
            {createIssue.isPending ? "กำลังส่งข้อมูล..." : "แจ้งเรื่อง"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
