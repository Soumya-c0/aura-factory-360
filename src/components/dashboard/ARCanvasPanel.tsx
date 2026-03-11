import { useState, useEffect } from "react";
import { Activity, Zap, Search, ChevronRight, Smartphone } from "lucide-react";
import MachineARFeed from "./MachineARFeed";
import MobileARView from "./MobileARView"; // Import the mobile component
import { toast } from "sonner";

const PHASES = [
  "Preparation", "Granulation", "Drying", "Milling", 
  "Blending", "Compression", "Coating", "Quality-Testing"
];

const ARCanvasPanel = () => {
  // Set T002 as default so the user sees the red column immediately on load
  const [selectedBatch, setSelectedBatch] = useState('T002');
  const [isT002Healed, setIsT002Healed] = useState(false);
  
  // NEW STATE: Controls the Mobile AR Overlay
  const [showMobileAR, setShowMobileAR] = useState(false);
  
  const [liveTelemetry, setLiveTelemetry] = useState({
    currentPower: 0, targetPower: 21, 
    currentRPM: 0, targetRPM: 850,
    status: "healthy"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Self-Healing Ledger via localStorage
  useEffect(() => {
    //localStorage.removeItem('T002_HEALED'); // Clear healing status on load for demo purposes
    const checkHealed = () => {
      const status = localStorage.getItem('T002_HEALED');
      setIsT002Healed(status === 'true');
    };
    checkHealed();
    // Listen for changes (in case user resolves in another tab)
    window.addEventListener('storage', checkHealed);
    const interval = setInterval(checkHealed, 1000);
    return () => {
      window.removeEventListener('storage', checkHealed);
      clearInterval(interval);
    };
  }, []);

  const batchNum = parseInt(selectedBatch.replace(/[^0-9]/g, '')) || 1;
  const currentPhaseIndex = (batchNum % PHASES.length);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setIsLoading(true);
      try {
        const bIndex = isNaN(batchNum) ? 0 : batchNum - 1;
        const driftRes = await fetch(`http://127.0.0.1:8000/check_drift?batch_index=${bIndex}`, { method: 'POST' });
        const driftData = await driftRes.json();

        // --- CRITICAL FIX: RE-CHECK STORAGE DURING FETCH ---
        const latestHealStatus = localStorage.getItem('T002_HEALED') === 'true';
        
        const targetPower = 21.0;
        const targetRPM = 850;

        // Determine if we should still force the Red Bar
        let driftScore = driftData.overall_drift || 0;
        
        // If it's T002 and NOT healed in storage, FORCE the drift
        if (selectedBatch === 'T002' && !latestHealStatus) {
          driftScore = 45.5; 
        } else if (selectedBatch === 'T002' && latestHealStatus) {
          driftScore = 0.8; // Force it to look perfect after healing
        }

        const isCritical = driftScore > 15;

        setLiveTelemetry({
            currentPower: isCritical ? targetPower * 1.4 : targetPower + (Math.random() * 1.2),
            targetPower: targetPower,
            currentRPM: isCritical ? targetRPM * 1.2 : targetRPM + (Math.random() * 8),
            targetRPM: targetRPM,
            status: isCritical ? "critical" : "healthy"
        });

      } catch (e) {
        // Fallback for demo stability
        const latestHealStatus = localStorage.getItem('T002_HEALED') === 'true';
        const isCritical = (selectedBatch === 'T002' && !latestHealStatus);
        setLiveTelemetry({ 
          currentPower: isCritical ? 31.5 : 21.2, 
          targetPower: 21, 
          currentRPM: isCritical ? 980 : 855, 
          targetRPM: 850, 
          status: isCritical ? "critical" : "healthy" 
        });
      } finally { 
        setIsLoading(false); 
      }
    };

    fetchTelemetry();
  }, [selectedBatch, isT002Healed]);

  return (
    <div className="glass-panel-accent flex flex-col h-full min-h-[600px] relative">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/40 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-xs font-black text-white uppercase tracking-widest">Spatial Twin: {selectedBatch}</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* THE NEW MOBILE AR BUTTON */}
          <button 
            onClick={() => setShowMobileAR(true)}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(0,212,255,0.1)]"
          >
            <Smartphone size={14} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Connect Mobile</span>
          </button>

          {/* Existing Search Bar */}
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 focus-within:border-primary/50 transition-all">
            <Search size={14} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="SEARCH BATCH..."
              value={selectedBatch} 
              onChange={(e) => setSelectedBatch(e.target.value.toUpperCase())} 
              className="bg-transparent border-none text-[11px] font-black text-white focus:ring-0 w-28 placeholder:text-white/20" 
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-56 bg-black/80 border-r border-white/10 p-5 z-40 hidden md:flex flex-col gap-3 backdrop-blur-md">
          <span className="text-[11px] font-black text-primary uppercase mb-4 tracking-[0.2em] border-b border-primary/30 pb-2">Active Workflow</span>
          {PHASES.map((phase, idx) => (
            <div key={phase} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-500 ${idx === currentPhaseIndex ? 'bg-white/10 border border-white/20' : 'opacity-30'}`}>
              <div className={`w-2 h-2 rounded-full ${idx === currentPhaseIndex ? 'bg-primary shadow-[0_0_8px_#00d4ff]' : 'bg-white/20'}`} />
              <span className={`text-[11px] font-extrabold tracking-wide ${idx === currentPhaseIndex ? 'text-white' : 'text-slate-400'}`}>{phase.toUpperCase()}</span>
              {idx === currentPhaseIndex && <ChevronRight size={12} className="ml-auto text-primary animate-pulse" />}
            </div>
          ))}
        </div>

        <div className="flex-1 relative bg-slate-950">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary font-mono">
                <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] tracking-[0.5em] uppercase animate-pulse">Syncing Neural Feed...</span>
            </div>
          ) : (
            <>
              <MachineARFeed {...liveTelemetry} />
              <div className="absolute bottom-8 left-8 z-40">
                <div className={`glass-panel p-5 border-l-4 shadow-2xl transition-all duration-500 ${liveTelemetry.status === 'critical' ? 'border-red-500 bg-red-950/60' : 'border-primary bg-black/80'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className={liveTelemetry.status === 'critical' ? 'text-red-500 animate-bounce' : 'text-primary'}/>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Stage: {PHASES[currentPhaseIndex]}</span>
                  </div>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter">
                    {liveTelemetry.status === 'critical' ? 'CRITICAL SYSTEM DRIFT' : 'OPTIMAL SYNC'}
                  </p>
                  {liveTelemetry.status === 'critical' && (
                    <p className="text-[10px] text-red-400 font-bold mt-2 animate-pulse uppercase">Attention: Remediation Required in Ledger</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- RENDER MOBILE AR VIEW FULLSCREEN IF ACTIVE --- */}
      {showMobileAR && (
        <MobileARView onClose={() => setShowMobileAR(false)} />
      )}
    </div>
  );
};

export default ARCanvasPanel;