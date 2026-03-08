import { useState, useEffect } from "react";
import { ShieldAlert, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const AssetLedgerPanel = () => {
  // State to track if we have healed the specific Power Drift alert
  const [isHealed, setIsHealed] = useState(false);

  // Sync with localStorage on load
  useEffect(() => {
    const status = localStorage.getItem('T002_HEALED');
    if (status === 'true') setIsHealed(true);
  }, []);

  const handleApproveHealing = () => {
    // 1. Update Global State (for the AR Canvas to see)
    localStorage.setItem('T002_HEALED', 'true');
    
    // 2. Update Local UI State
    setIsHealed(true);
    
    // 3. Show Notification
    toast.success("Self-Healing Applied", {
      description: "Motor RPM reduced for T002. Energy levels stabilizing.",
    });
  };

  const handleReset = () => {
    localStorage.removeItem('T002_HEALED');
    setIsHealed(false);
    toast.info("System Reset", { description: "Simulation reverted to Drift state." });
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <span className="section-title">Self-Healing Asset Ledger</span>
        </div>
        {isHealed && (
          <button onClick={handleReset} className="text-[10px] text-muted-foreground hover:text-white underline">
            Reset Sim
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 p-5 overflow-y-auto">
        {/* --- DYNAMIC ALERT: POWER DRIFT --- */}
        {!isHealed ? (
          <div className="alert-critical animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-destructive">CRITICAL</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> Just Now
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/90 font-bold">⚠️ 15% Power Drift Detected in Granulation Phase (T002)</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Root cause: Material Dampness — Spectral analysis recommends RPM reduction.</p>

                <div className="mt-3 flex items-center gap-2">
                  <button 
                    onClick={handleApproveHealing}
                    className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-green-900/20"
                  >
                    Approve Healing Action (-120 RPM)
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-4 rounded-lg border border-white/10">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 animate-in zoom-in duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-green-400">RESOLVED</span>
                  <span className="text-xs text-muted-foreground">Applied Just Now</span>
                </div>
                <p className="mt-0.5 text-sm text-white font-medium">Thermal & Power drift corrected for T002.</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Self-healing action executed. Live AR bars stabilized to Golden Signature.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- STATIC ALERTS (The ones from your original file) --- */}
        <div className="alert-critical opacity-80">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-destructive">CRITICAL</span>
                <span className="text-xs text-muted-foreground">14 min ago</span>
              </div>
              <p className="mt-1 text-sm text-foreground/90">⚠️ Motor Vibration Anomaly on Unit M-04</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Bearing wear pattern detected — predictive replacement recommended.</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-success/15 bg-success/5 p-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-success">RESOLVED</span>
                <span className="text-xs text-muted-foreground">42 min ago</span>
              </div>
              <p className="mt-0.5 text-sm text-foreground/70">Pressure regulator recalibrated on Line 3.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetLedgerPanel;