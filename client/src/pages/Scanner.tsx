import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { QrCode, ArrowLeft, RefreshCw, CheckCircle2, Camera } from "lucide-react";
import { api } from "@shared/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ScannerPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasError, setHasError] = useState(false);
  const queryClient = useQueryClient();
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(api.goodDeeds.claimQr.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "สแกนไม่สำเร็จ");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setIsClaimed(true);
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: [api.goodDeeds.list.path] });
      toast({
        title: "สำเร็จ!",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "ผิดพลาด",
        description: error.message,
      });
    }
  });

  const startScanner = async () => {
    try {
      setHasError(false);
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (!isClaimed && !mutation.isPending) {
            setScanResult(decodedText);
            mutation.mutate(decodedText);
          }
        },
        () => {} // Ignore scan errors
      );
      setIsCameraActive(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setHasError(true);
      toast({
        variant: "destructive",
        title: "ไม่สามารถเปิดกล้องได้",
        description: "กรุณาตรวจสอบการอนุญาตเข้าถึงกล้องของคุณ",
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsCameraActive(false);
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  useEffect(() => {
    if (!isClaimed) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isClaimed]);

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
          {!isClaimed ? (
            <>
              <div 
                id="reader" 
                className={`w-full max-w-[300px] aspect-square overflow-hidden rounded-2xl border-2 border-primary/20 shadow-inner bg-slate-900 relative ${!isCameraActive ? 'flex items-center justify-center' : ''}`}
              >
                {!isCameraActive && !hasError && (
                  <div className="flex flex-col items-center gap-2 text-white/50">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p className="text-sm">กำลังเปิดกล้อง...</p>
                  </div>
                )}
                {hasError && (
                  <div className="flex flex-col items-center gap-4 p-6 text-center text-white/70">
                    <Camera className="w-12 h-12 opacity-50" />
                    <p className="text-sm">ไม่สามารถเข้าถึงกล้องได้</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-white border-white/20 hover:bg-white/10"
                      onClick={startScanner}
                    >
                      ลองใหม่อีกครั้ง
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-8 text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/5 inline-flex">
                  <QrCode className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <p className="text-slate-500 font-medium">
                  {mutation.isPending ? "กำลังตรวจสอบ..." : "วางคิวอาร์โค้ดในกรอบเพื่อรับแต้ม"}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100/50">
                <CheckCircle2 className="w-12 h-12" strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">บันทึกแต้มสำเร็จ!</h2>
                <p className="text-slate-500">คุณได้รับ 1 แต้มความดีเรียบร้อยแล้ว</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 w-full">
                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60 text-slate-400">ข้อมูลที่สแกน</p>
                <p className="font-mono break-all text-slate-600">{scanResult}</p>
              </div>
              <Button 
                className="w-full h-12 rounded-xl text-lg font-bold"
                onClick={() => {
                  setIsClaimed(false);
                  setScanResult(null);
                }}
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                สแกนแต้มถัดไป
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
