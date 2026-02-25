import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sun, CheckCircle2, Gift, QrCode, UploadCloud, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCreateGoodDeed, useGoodDeeds } from "@/hooks/use-activities";
import { format } from "date-fns";

export function ActivitiesPage() {
  const { data: user } = useAuth();
  const [activeTab, setActiveTab] = useState("good_deeds");
  const createGoodDeed = useCreateGoodDeed();
  const { data: goodDeeds } = useGoodDeeds();

  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=baf409d03cf4975986f6d44b5a1a2919`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMorningCheck = () => {
    createGoodDeed.mutate({ type: "morning_check", details: "เช็คชื่อกิจกรรมยามเช้า", imageUrl: "" });
  };

  const handleCustomDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    createGoodDeed.mutate({ type: "custom", details, imageUrl }, {
      onSuccess: () => {
        setDetails("");
        setImageUrl("");
      }
    });
  };

  const stampsCount = user?.garbageStamps || 0;
  const stampsArray = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-white border-b border-slate-100 sticky top-0 z-30">
        <h1 className="text-2xl font-bold text-slate-800 font-display">กิจกรรมสะสมแต้ม</h1>
        <p className="text-slate-500 text-sm mt-1">ทำความดีและคัดแยกขยะเพื่อรับของรางวัล</p>
      </div>

      <div className="p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1.5 rounded-2xl h-14 mb-6">
            <TabsTrigger value="good_deeds" className="rounded-xl font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">ความดี</TabsTrigger>
            <TabsTrigger value="garbage" className="rounded-xl font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">ธนาคารขยะ</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "good_deeds" && (
              <TabsContent value="good_deeds" asChild forceMount>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Morning Check Card */}
                  <Card className="border-0 shadow-lg shadow-amber-500/10 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden relative">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
                      <Sun size={120} />
                    </div>
                    <CardContent className="p-6 relative z-10">
                      <h3 className="font-bold text-amber-800 text-lg mb-2 flex items-center gap-2">
                        <Sun className="text-amber-500" size={20} /> เช็คชื่อยามเช้า
                      </h3>
                      <p className="text-amber-700/80 text-sm mb-4">เข้าร่วมกิจกรรมหน้าเสาธง ระหว่าง 06:00 - 08:00 น. เพื่อรับแต้มความดี 1 แต้ม</p>
                      <Button 
                        onClick={handleMorningCheck}
                        disabled={createGoodDeed.isPending}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md shadow-amber-500/25 h-12 font-medium"
                      >
                        {createGoodDeed.isPending ? "กำลังบันทึก..." : "เช็คชื่อ (รับ 1 แต้ม)"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Upload Custom Deed Form */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <UploadCloud className="text-primary" size={20} /> บันทึกกิจกรรมความดีอื่นๆ
                    </h3>
                    <form onSubmit={handleCustomDeed} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">รายละเอียดความดีที่ทำ</label>
                        <Textarea 
                          placeholder="เช่น ช่วยครูยกของ, ทำความสะอาดห้องเรียน..."
                          className="resize-none bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                          rows={3}
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">อัปโหลดรูปภาพ (ImgBB)</label>
                        <div className="flex gap-2">
                          <Input 
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-xs h-10"
                            disabled={isUploading}
                          />
                        </div>
                        {isUploading && <p className="text-[10px] text-primary animate-pulse">กำลังอัปโหลด...</p>}
                        {imageUrl && (
                          <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setImageUrl("")}
                              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                            >
                              <Clock size={12} className="rotate-45" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600">หรือวางลิงก์รูปภาพ</label>
                        <Input 
                          placeholder="https://..."
                          className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={!details || createGoodDeed.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 shadow-md shadow-primary/20"
                      >
                        ส่งข้อมูลประเมิน
                      </Button>
                    </form>
                  </div>

                  {/* History */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-sm">ประวัติความดีล่าสุด</h3>
                    <div className="space-y-3">
                      {goodDeeds?.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          ยังไม่มีประวัติความดี
                        </div>
                      ) : (
                        goodDeeds?.map((deed) => (
                          <div key={deed.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-3 items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              deed.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                              deed.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {deed.status === 'approved' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-800 truncate">{deed.details}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {deed.createdAt ? format(new Date(deed.createdAt), 'dd MMM yyyy HH:mm') : 'ไม่ระบุเวลา'}
                              </p>
                            </div>
                            <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                              deed.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                              deed.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {deed.status === 'approved' ? '+1 แต้ม' : deed.status === 'pending' ? 'รอตรวจสอบ' : 'ไม่อนุมัติ'}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "garbage" && (
              <TabsContent value="garbage" asChild forceMount>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Stamp Card */}
                  <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-500/10 border-2 border-emerald-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-400" />
                    
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg font-display">บัตรสะสมแสตมป์</h3>
                        <p className="text-xs text-slate-500">สะสมครบ 10 ดวง แลกรับของรางวัล</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-emerald-500">{stampsCount % 10}</span>
                        <span className="text-sm text-slate-400 font-medium">/10</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {stampsArray.map((i) => {
                        const isFilled = i < (stampsCount % 10 || (stampsCount > 0 && stampsCount % 10 === 0 ? 10 : 0));
                        return (
                          <div 
                            key={i} 
                            className={`aspect-square rounded-full flex items-center justify-center transition-all duration-500 ${
                              isFilled 
                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/30 text-white scale-105' 
                                : 'bg-slate-50 border-2 border-dashed border-slate-200 text-slate-300'
                            }`}
                          >
                            {isFilled ? <Recycle size={20} strokeWidth={2.5} /> : <span className="text-xs font-bold">{i + 1}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scan QR Button */}
                  <Button className="w-full h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl shadow-lg shadow-slate-800/20 flex items-center justify-center gap-2 text-base font-medium">
                    <QrCode size={20} /> สแกน QR รับแสตมป์
                  </Button>

                  {/* Rewards List */}
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                      <Gift className="text-rose-500" size={18} /> ของรางวัลที่แลกได้
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Reward 1 */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl">🥤</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">น้ำดื่ม 1 ขวด</h4>
                          <p className="text-[10px] text-rose-500 font-bold mt-0.5">ใช้ 10 แสตมป์</p>
                        </div>
                      </div>
                      {/* Reward 2 */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">📝</div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">สมุดโน้ต 1 เล่ม</h4>
                          <p className="text-[10px] text-blue-500 font-bold mt-0.5">ใช้ 20 แสตมป์</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
