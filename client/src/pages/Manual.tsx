import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Shield, MessageSquare, Award, Trash2, Camera } from "lucide-react";

export function ManualPage() {
  const sections = [
    {
      title: "การใช้งานทั่วไป",
      icon: <Book className="w-5 h-5" />,
      items: [
        "เข้าสู่ระบบด้วยรหัสประจำตัวนักเรียน",
        "ใช้รหัสผ่านที่ตั้งไว้ตอนลงทะเบียน",
        "หากเป็นสภานักเรียน ให้กรอกรหัสยืนยันเพื่อรับสิทธิ์คณะกรรมการ",
      ]
    },
    {
      title: "ระบบสะสมแต้มความดี",
      icon: <Award className="w-5 h-5" />,
      items: [
        "บันทึกความดีพร้อมแนบหลักฐานรูปภาพ",
        "แต้มจะถูกสะสมเมื่อผ่านการตรวจสอบ",
        "สามารถดูประวัติความดีทั้งหมดได้ที่เมนูกิจกรรม",
      ]
    },
    {
      title: "ระบบธนาคารขยะ",
      icon: <Trash2 className="w-5 h-5" />,
      items: [
        "นำขยะรีไซเคิลมามอบให้ที่จุดคัดแยก",
        "สแกน QR Code หรือให้กรรมการบันทึกแต้ม",
        "แต้มขยะสามารถนำไปแลกของรางวัลได้",
      ]
    },
    {
      title: "การแจ้งปัญหา",
      icon: <MessageSquare className="w-5 h-5" />,
      items: [
        "แจ้งเรื่องร้องเรียนหรือข้อเสนอแนะผ่านเมนู 'แจ้งปัญหา'",
        "สามารถแนบรูปภาพประกอบได้",
        "ติดตามสถานะการดำเนินการได้ในระบบ",
      ]
    }
  ];

  return (
    <div className="p-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 font-display">คู่มือการใช้งาน</h1>
      
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-3 py-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {section.icon}
              </div>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-slate-600 flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
