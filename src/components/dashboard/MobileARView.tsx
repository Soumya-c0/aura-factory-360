import { useState, useEffect, useRef } from "react";
import { Maximize, Target, Zap, AlertTriangle, CheckCircle2, X } from "lucide-react";

interface MobileARViewProps {
  onClose: () => void;
}

const BATCHES = ["T001", "T002", "T045"];

const MobileARView = ({ onClose }: MobileARViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [telemetry, setTelemetry] = useState({ 
    currentPower: 0, targetPower: 21, 
    currentRPM: 0, targetRPM: 850, 
    status: "healthy" 
  });

  const currentBatch = BATCHES[scanIndex];

  // 1. Start Camera safely
  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        if (isMounted) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCamera(true);
          }
        } else {
          // If component unmounted before stream started, stop it immediately
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
      }
    };

    startCamera();

    // COMPLETE CAMERA CLEANUP
    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop(); // This absolutely forces the camera light off
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // 2. Fetch Data (Matching the Laptop Logic exactly)
  useEffect(() => {
    const fetchRealData = async () => {
      const isHealed = localStorage.getItem('T002_HEALED') === 'true';
      const targetPower = 21.0;
      const targetRPM = 850;
      
      // Forced Demo Logic for Red Bar
      if (currentBatch === "T002" && !isHealed) {
        setTelemetry({ 
          currentPower: targetPower * 1.4, 
          targetPower, 
          currentRPM: targetRPM * 1.2, 
          targetRPM, 
          status: "critical" 
        });
        return;
      }

      // Normal Data
      setTelemetry({ 
        currentPower: targetPower + (Math.random() * 2), 
        targetPower, 
        currentRPM: targetRPM + (Math.random() * 10), 
        targetRPM, 
        status: "healthy" 
      });
    };

    fetchRealData();
  }, [currentBatch]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanIndex((prev) => (prev + 1) % BATCHES.length);
      setIsScanning(false);
    }, 800);
  };

  // UI calculations matching desktop
  const isCritical = telemetry.status === 'critical';
  const colorClass = isCritical ? 'bg-red-500' : 'bg-primary';
  const textClass = isCritical ? 'text-red-400' : 'text-primary';
  const powerHeight = Math.min((telemetry.currentPower / (telemetry.targetPower * 1.5)) * 100, 100);
  const rpmHeight = Math.min((telemetry.currentRPM / (telemetry.targetRPM * 1.5)) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black font-sans z-[99999]">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />

      {/* TOP CONTROLS */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50">
        <div className="glass-panel bg-black/60 border-primary/50 px-4 py-2 rounded-lg backdrop-blur-md">
           <span className="text-[10px] text-primary font-bold tracking-widest uppercase block mb-0.5">Spatial Link</span>
           <span className="text-sm font-black text-white">{hasCamera ? "FEED ACTIVE" : "CONNECTING..."}</span>
        </div>
        <button onClick={onClose} className="p-3 bg-red-500 rounded-full border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center">
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* CENTER SCANNER */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full" />
          <div className="w-full h-[1px] bg-primary/20 absolute" />
          <div className="h-full w-[1px] bg-primary/20 absolute" />
          <Target size={48} className={`text-primary/70 ${isScanning ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* DATA OVERLAY (Matches Desktop UI) */}
      {!isScanning && (
        <div className="absolute top-1/4 right-8 pointer-events-none z-50">
           <div className={`glass-panel p-4 backdrop-blur-xl border-l-4 shadow-2xl flex flex-col gap-4 min-w-[140px] ${isCritical ? 'bg-red-950/80 border-red-500 shadow-red-500/20' : 'bg-[#0f172a]/80 border-primary shadow-primary/10'}`}>
             
             <div className="flex items-center gap-2 border-b border-white/10 pb-2">
               {isCritical ? <AlertTriangle size={14} className="text-red-500 animate-pulse"/> : <CheckCircle2 size={14} className="text-primary"/>}
               <span className="text-xs font-black text-white tracking-widest uppercase">{currentBatch}</span>
             </div>

             <div className="flex justify-between gap-6">
               {/* POWER BAR */}
               <div className="flex flex-col items-center gap-2">
                 <span className="text-[9px] font-bold text-muted-foreground uppercase">Power</span>
                 <div className="relative h-24 w-6 bg-black/50 rounded-md border border-white/10 overflow-hidden flex items-end">
                    <div className="absolute w-full border-t border-dashed border-white/30" style={{ bottom: '66%' }} />
                    <div className={`w-full transition-all duration-700 ease-out ${colorClass}`} style={{ height: `${powerHeight}%` }}>
                      <div className="w-full h-1 bg-white/50 absolute top-0" />
                    </div>
                 </div>
                 <div className="text-center">
                   <span className={`text-[10px] font-black block ${textClass}`}>{telemetry.currentPower.toFixed(1)}</span>
                   <span className="text-[8px] text-muted-foreground">kW</span>
                 </div>
               </div>

               {/* RPM BAR */}
               <div className="flex flex-col items-center gap-2">
                 <span className="text-[9px] font-bold text-muted-foreground uppercase">Motor</span>
                 <div className="relative h-24 w-6 bg-black/50 rounded-md border border-white/10 overflow-hidden flex items-end">
                    <div className="absolute w-full border-t border-dashed border-white/30" style={{ bottom: '66%' }} />
                    <div className={`w-full transition-all duration-700 ease-out ${colorClass}`} style={{ height: `${rpmHeight}%` }}>
                      <div className="w-full h-1 bg-white/50 absolute top-0" />
                    </div>
                 </div>
                 <div className="text-center">
                   <span className={`text-[10px] font-black block ${textClass}`}>{telemetry.currentRPM.toFixed(0)}</span>
                   <span className="text-[8px] text-muted-foreground">RPM</span>
                 </div>
               </div>
             </div>
             
             {isCritical && (
                <div className="mt-2 text-center animate-pulse">
                  <span className="text-[9px] font-black text-red-400 tracking-widest uppercase">Drift Warning</span>
                </div>
             )}
           </div>
        </div>
      )}

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-8 left-0 w-full flex flex-col items-center z-50">
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all shadow-xl ${isScanning ? 'bg-primary border-primary scale-90' : 'bg-black/60 border-primary backdrop-blur-md hover:bg-primary/20'}`}
        >
          <Zap size={32} className={isScanning ? 'text-black' : 'text-primary'} />
        </button>
        <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase mt-4 bg-black/50 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          Tap To Scan
        </span>
      </div>
    </div>
  );
};

export default MobileARView;