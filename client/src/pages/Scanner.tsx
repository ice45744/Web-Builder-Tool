import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { QrCode, ArrowLeft, RefreshCw } from "lucide-react";

export function ScannerPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (result) => {
        setScanResult(result);
        scanner.clear();
        toast({
          title: "สแกนสำเร็จ",
          description: `ข้อมูล: ${result}`,
        });
        // In a real app, we would call an API here
      },
      (error) => {
        // console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="p-4 pb-24 flex flex-col min-h-[80vh] animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 font-display">สแกนคิวอาร์โค้ด</h1>
      </div>

      <Card className="flex-1 border-none shadow-lg bg-white/80 backdrop-blur-md overflow-hidden flex flex-col">
        <CardContent className="p-6 flex flex-col items-center justify-center flex-1">
          <div id="reader" className="w-full max-w-[300px] overflow-hidden rounded-2xl border-2 border-primary/20 shadow-inner bg-slate-900" />
          
          <div className="mt-8 text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/5 inline-flex">
              <QrCode className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium">
              วางคิวอาร์โค้ดในกรอบเพื่อเริ่มการสแกน
            </p>
          </div>

          {scanResult && (
            <div className="mt-8 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 w-full animate-in zoom-in-95 duration-300">
              <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60 text-green-600">ผลการสแกนล่าสุด</p>
              <p className="font-mono break-all">{scanResult}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full bg-white text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                สแกนใหม่อีกครั้ง
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
