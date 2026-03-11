import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, BookOpen, UploadCloud } from "lucide-react";
import { toast } from "sonner";

const AssetLedgerPanel = () => {
  const [isHealed, setIsHealed] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeBatch = "T002";

  useEffect(() => {
    const status = localStorage.getItem('T002_HEALED');
    setIsHealed(status === 'true');
  }, []);

  const [history] = useState([
    { id: "T045", drift: "2.1%", impact: "$0.00", time: "1h ago" },
    { id: "T012", drift: "1.4%", impact: "$0.00", time: "3h ago" },
    { id: "T058", drift: "0.8%", impact: "$0.00", time: "5h ago" },
    { id: "T031", drift: "3.2%", impact: "$0.00", time: "8h ago" },
    { id: "T009", drift: "1.1%", impact: "$0.00", time: "12h ago" },
  ]);

  const handleHeal = () => {
    localStorage.setItem('T002_HEALED', 'true');
    setIsHealed(true);
    toast.success("Self-Healing Command Sent", { 
      description: "Neural weights recalibrated. Machine T002 is now optimized." 
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file processing time for the demo
      setTimeout(() => {
        setIsUploading(false);
        toast.success("RAG Knowledge Base Updated", {
          description: `Successfully ingested and vectorized: ${file.name}. Neural pathways re-aligned.`
        });
        // Reset the input so you can upload the same file again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 font-sans p-6 bg-slate-950 overflow-y-auto relative">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] text-primary font-mono tracking-[0.3em] uppercase">Autonomous Remediation</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Active Asset Ledger</h2>
        </div>
        <div className="flex items-center gap-4">
            
            {/* NEW INGEST SOP BUTTON */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.doc,.docx,.txt"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(0,212,255,0.1)] text-primary"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isUploading ? "Vectorizing..." : "Ingest SOP Manual"}
              </span>
            </button>

            {/* RESET BUTTON */}
            <button 
                onClick={() => { localStorage.removeItem('T002_HEALED'); window.location.reload(); }}
                className="text-[9px] border border-white/10 px-3 py-2 rounded-lg text-muted-foreground hover:text-white transition-colors uppercase tracking-widest font-black"
            >
                Reset Demo
            </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border-white/10 bg-black/40">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 text-[10px] font-bold text-muted-foreground uppercase">
            <tr>
              <th className="p-4">Asset ID</th>
              <th className="p-4">Current Status</th>
              <th className="p-4">Economic Risk</th>
              <th className="p-4">Remediation</th>
              <th className="p-4 text-right">RAG Intelligence</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {/* THE CRITICAL ROW (T002) */}
            <tr className={`transition-all duration-700 ${isHealed ? 'opacity-30 bg-transparent' : 'bg-red-500/20 border-l-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]'}`}>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isHealed ? 'bg-green-500' : 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]'}`} />
                  <span className="text-sm font-black text-white">{activeBatch}</span>
                </div>
              </td>
              <td className={`p-4 font-mono font-black ${isHealed ? 'text-green-400' : 'text-red-400'}`}>
                {isHealed ? "OPTIMIZED (0.4%)" : "CRITICAL DRIFT (45.2%)"}
              </td>
              <td className="p-4 text-white font-bold">{isHealed ? "$0.00" : "$14.20 / min"}</td>
              <td className="p-4">
                <button 
                  disabled={isHealed}
                  onClick={handleHeal}
                  className={`px-5 py-2 rounded-lg font-black text-[10px] uppercase transition-all ${isHealed ? 'bg-white/5 text-white/20' : 'bg-red-500 text-white hover:bg-white hover:text-black shadow-lg shadow-red-500/20'}`}
                >
                  {isHealed ? "RESOLVED" : "EXECUTE HEALING"}
                </button>
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => { setIsAnalyzing(true); setTimeout(() => { setIsAnalyzing(false); setShowManual(true); }, 1000); }} 
                  className="text-primary hover:text-white transition-colors flex items-center gap-2 ml-auto font-black uppercase text-[10px]"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin text-primary"/> : <BookOpen size={14}/>}
                  Manual Retrieval
                </button>
              </td>
            </tr>

            <tr className="bg-white/5"><td colSpan={5} className="px-4 py-2 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Historical Resolutions (Last 24h)</td></tr>

            {history.map((item) => (
              <tr key={item.id} className="border-b border-white/5 opacity-50">
                <td className="p-4 font-bold text-slate-300">{item.id}</td>
                <td className="p-4 font-mono text-green-500/70 font-bold flex items-center gap-2">
                  <CheckCircle2 size={12}/> {item.drift} DRIFT
                </td>
                <td className="p-4 text-slate-500">{item.impact}</td>
                <td className="p-4 text-slate-400 uppercase font-black text-[9px]">Neural Recalibration</td>
                <td className="p-4 text-right text-[9px] text-slate-600 font-mono">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RAG MODAL */}
      {showManual && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="glass-panel max-w-lg w-full bg-slate-900 border-primary shadow-[0_0_100px_rgba(0,212,255,0.2)] p-6">
              <h4 className="text-[10px] text-primary font-black uppercase tracking-widest mb-2">SOP-MECH-42: Compression Stability</h4>
              <p className="text-white text-xs mb-4 leading-relaxed font-medium">Thermal Drift detected in Turret Bearings. Corrective action retrieved from manual Page 114.</p>
              <div className="p-4 bg-primary/10 border-l-2 border-primary italic text-[11px] text-white/90 rounded mb-6">"Calibrate thermal expansion offset by -0.04mm. Ensure lubrication pressure is at 2.4 bar."</div>
              <button onClick={() => { setShowManual(false); handleHeal(); }} className="w-full bg-primary text-black font-black py-4 rounded-xl text-[10px] uppercase hover:bg-white transition-all shadow-lg">Apply Manual Fix to PLC</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetLedgerPanel;