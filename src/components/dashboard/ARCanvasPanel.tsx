import { useState, useEffect } from "react";
import { Box, Maximize2, Zap, Activity } from "lucide-react";
import MachineARFeed from "./MachineARFeed";

const ARCanvasPanel = () => {
  const [selectedBatch, setSelectedBatch] = useState('T001');
  const [isT002Healed, setIsT002Healed] = useState(false);

  // Check if T002 was healed in the other tab
  useEffect(() => {
    const checkHealed = () => {
      const status = localStorage.getItem('T002_HEALED');
      if (status === 'true') setIsT002Healed(true);
    };

    // Check immediately and then every second
    checkHealed();
    const interval = setInterval(checkHealed, 1000);
    return () => clearInterval(interval);
  }, []);

  const batchData = {
    'T001': { currentPower: 21.2, targetPower: 21.0, currentRPM: 855, targetRPM: 850 },
    'T002': isT002Healed 
      ? { currentPower: 22.1, targetPower: 22.0, currentRPM: 860, targetRPM: 850 } // HEALED STATE (Green)
      : { currentPower: 31.5, targetPower: 22.0, currentRPM: 980, targetRPM: 850 }, // DRIFT STATE (Red)
    'T003': { currentPower: 14.0, targetPower: 21.0, currentRPM: 550, targetRPM: 850 },
  };

  const data = batchData[selectedBatch as keyof typeof batchData];

  return (
    <div className="glass-panel-accent flex flex-col overflow-hidden h-full min-h-[600px] relative">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 z-50 relative bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-[10px] text-primary font-mono tracking-widest">SPATIAL INTELLIGENCE</span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">SURA FACTORY 360: {selectedBatch}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isT002Healed && selectedBatch === 'T002' && (
             <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30 font-bold animate-pulse">
               AI HEALING APPLIED
             </span >
          )}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {Object.keys(batchData).map((id) => (
              <button 
                key={id}
                onClick={() => setSelectedBatch(id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedBatch === id ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-slate-950 overflow-hidden">
        <MachineARFeed {...data} />
        
        <div className="absolute bottom-8 left-8 z-40">
          <div className={`glass-panel p-5 border-l-4 ${data.currentPower > data.targetPower * 1.1 ? "border-destructive bg-red-950/20" : "border-primary bg-black/60"} backdrop-blur-md`}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className={data.currentPower > data.targetPower * 1.1 ? "text-destructive animate-pulse" : "text-primary"} size={16} />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency Status</span>
            </div>
            <p className="text-2xl font-black text-white">
              {data.currentPower > data.targetPower * 1.1 ? "CRITICAL DRIFT" : "OPTIMIZED"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARCanvasPanel;