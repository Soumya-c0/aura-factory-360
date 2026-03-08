import { useState, useEffect } from "react";
import { Calendar, Zap, Info, TrendingDown, LayoutGrid, User, Bot, RefreshCcw, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

// Fixed Order: T001, T002, T003, T004
const INITIAL_BATCHES = [
  { id: "T001", name: "Granulation", energy: 120, duration: 4, priority: "High", color: "#10b981" },
  { id: "T002", name: "Mixing", energy: 280, duration: 6, priority: "Critical", color: "#00d4ff" },
  { id: "T003", name: "Coating", energy: 180, duration: 5, priority: "Medium", color: "#fbbf24" },
  { id: "T004", name: "Drying", energy: 150, duration: 4, priority: "Low", color: "#8b5cf6" },
];

const EnergySchedulerPanel = () => {
  const [view, setView] = useState<'strategy' | 'simulator'>('strategy');
  const [selectedBatch, setSelectedBatch] = useState(INITIAL_BATCHES[0]);
  const [currentOrder, setCurrentOrder] = useState(INITIAL_BATCHES);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [overload, setOverload] = useState(false);

  const energyLimit = 1000;
  const currentUsage = 850;
  const usagePercent = (currentUsage / energyLimit) * 100;

  // 1. IMPROVED LOGIC: Ensures overload is ALWAYS calculated based on the list
  useEffect(() => {
    // If the heavy batch (T002) is in the first slot, trigger overload
    const isFirstBatchHeavy = currentOrder[0].id === "T002";
    setOverload(isFirstBatchHeavy);
    
    // Show a warning if the user manually caused a peak overlap
    if (isFirstBatchHeavy && !isAiMode) {
      toast.error("Peak Demand Risk!", { 
        description: "Moving high-energy Mixing to the morning shift creates a grid penalty." 
      });
    }
  }, [currentOrder, isAiMode]);

  const applyAiOptimization = () => {
    setIsReplaying(true);
    setIsAiMode(true);
    // AI Strategy: Separate high energy T002 from the start (moves it to position 3)
    const optimal = [INITIAL_BATCHES[0], INITIAL_BATCHES[2], INITIAL_BATCHES[1], INITIAL_BATCHES[3]];
    
    setTimeout(() => {
      setCurrentOrder(optimal);
      setIsReplaying(false);
      toast.success("AI Optimization Applied", { description: "Load balancing sequence locked." });
    }, 1500);
  };

  // 2. IMPROVED SWAP: Forces the app to leave AI Mode and recalculate risk
  const swapBatches = (index: number) => {
    if (index === 0) return;
    
    setIsAiMode(false); // Turn off AI Mode for manual interaction
    
    const newOrder = [...currentOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    
    setCurrentOrder(newOrder);
  };

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-black/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="section-title text-white">Energy Planner</span>
          </div>
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button onClick={() => setView('strategy')} className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold rounded-md transition-all ${view === 'strategy' ? 'bg-primary text-black' : 'text-muted-foreground'}`}><TrendingDown size={12} /> STRATEGY</button>
            <button onClick={() => setView('simulator')} className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold rounded-md transition-all ${view === 'simulator' ? 'bg-primary text-black' : 'text-muted-foreground'}`}><LayoutGrid size={12} /> SIMULATOR</button>
          </div>
        </div>
        {view === 'simulator' && (
          <div className="flex gap-2">
            <button onClick={() => { setCurrentOrder(INITIAL_BATCHES); setIsAiMode(false); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${!isAiMode ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-muted-foreground'}`}><User size={12} /> MANUAL</button>
            <button onClick={applyAiOptimization} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${isAiMode ? 'bg-primary/20 border-primary/40 text-primary' : 'border-white/10 text-muted-foreground hover:text-white'}`}><Bot size={12} className={isReplaying ? "animate-bounce" : ""} /> {isReplaying ? "REPLAYING..." : "AI ASSIST"}</button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* --- GLOBAL ENERGY GAUGE --- */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Live Carbon Consumption</p>
              <h3 className="text-xl font-black text-white">{currentUsage} <span className="text-sm font-normal text-muted-foreground">/ {energyLimit} kWh</span></h3>
            </div>
            <p className="text-xs font-bold text-primary">{usagePercent.toFixed(1)}% Used</p>
          </div>
          <Progress value={usagePercent} className="h-1.5 bg-slate-800" />
        </div>

        {view === 'strategy' ? (
          /* --- STRATEGY VIEW --- */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-white/10">
                <h4 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">Pareto Optimization Curve</h4>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <XAxis type="number" dataKey="time" stroke="#64748b" fontSize={10} />
                      <YAxis type="number" dataKey="energy" stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#00d4ff' }} />
                      <Scatter data={[{energy: 100, time: 90}, {energy: 150, time: 60}, {energy: 250, time: 30}]} fill="#00d4ff" line={{stroke: '#00d4ff', strokeWidth: 2}} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {INITIAL_BATCHES.map(b => (
                  <button key={b.id} onClick={() => setSelectedBatch(b)} className={`p-3 rounded-xl border flex justify-between items-center transition-all ${selectedBatch.id === b.id ? 'bg-primary/10 border-primary' : 'bg-white/5 border-transparent'}`}>
                    <div className="text-left"><p className="text-xs font-bold text-white">{b.id}</p><p className="text-[10px] text-muted-foreground">{b.name}</p></div>
                    <p className="text-xs font-mono font-bold text-primary">{b.energy} kWh</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-panel-accent p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col justify-center text-center lg:text-left">
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Detailed Analytics</span>
              <h4 className="text-4xl font-black text-white mb-6">{selectedBatch.id}</h4>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-xs text-muted-foreground uppercase">Load</span><span className="text-sm font-bold text-white">{selectedBatch.energy} kWh</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-xs text-muted-foreground uppercase">Priority</span><span className={`text-sm font-bold ${selectedBatch.priority === 'Critical' ? 'text-red-400' : 'text-primary'}`}>{selectedBatch.priority}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-xs text-muted-foreground uppercase">Carbon</span><span className="text-sm font-bold text-white">{(selectedBatch.energy * 0.44).toFixed(1)}kg</span></div>
              </div>
            </div>
          </div>
        ) : (
          /* --- SIMULATOR VIEW --- */
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="h-48 w-full bg-slate-950 rounded-3xl border border-white/5 flex items-end p-6 gap-3 relative shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              {currentOrder.map((batch, i) => (
                <div 
                  key={`${batch.id}-${isReplaying}`}
                  style={{ 
                    height: `${(batch.energy / 300) * 100}%`, 
                    width: '25%', 
                    backgroundColor: batch.color,
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: isReplaying ? `${i * 150}ms` : '0ms'
                  }}
                  className={`relative rounded-t-2xl border-t-4 border-white/30 shadow-2xl cursor-pointer group hover:brightness-125 ${isReplaying ? 'animate-in slide-in-from-bottom-full' : ''} ${overload && i === 0 ? 'ring-4 ring-red-500/50 ring-offset-4 ring-offset-slate-950' : ''}`}
                  onClick={() => swapBatches(i)}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-white">{batch.id}</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-t-xl transition-opacity">
                    <RefreshCcw size={20} className="text-white rotate-90" />
                  </div>
                </div>
              ))}
              <div className={`absolute top-[40%] left-0 right-0 border-t-2 border-dashed z-20 transition-colors ${overload ? 'border-red-500 animate-pulse' : 'border-white/10'}`}>
                <span className={`absolute right-4 -top-5 text-[8px] font-black tracking-widest ${overload ? 'text-red-500' : 'text-muted-foreground'}`}>GRID PEAK THRESHOLD (350kWh)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border transition-colors duration-500 ${overload ? 'bg-red-500/10 border-red-500/30' : 'bg-primary/5 border-primary/20'}`}>
                <h5 className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-2 ${overload ? 'text-red-400' : 'text-primary'}`}>
                  {overload ? <AlertCircle size={14}/> : <Zap size={14}/>} {overload ? 'Scheduling Conflict' : 'AI Optimization logic'}
                </h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {overload 
                    ? "CRITICAL: Mixing (T002) is scheduled during the high-tariff morning peak. This creates a concurrent load spike exceeding the grid ceiling."
                    : "OPTIMIZED: High-intensity tasks have been distributed. T001 runs during the dip, while T002 is shifted to avoid peak-hour penalties."}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-around items-center">
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground uppercase">Efficiency</p>
                  <p className={`text-lg font-black transition-colors ${overload ? 'text-red-400' : 'text-primary'}`}>
                    {overload ? '42%' : '98%'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground uppercase">Penalty</p>
                  <p className={`text-lg font-black transition-colors ${overload ? 'text-red-400' : 'text-white'}`}>
                    {overload ? '$245' : '$0'}
                  </p>
                </div>
              </div>
            </div>

            {/* --- SEQUENCE LIST --- */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Live Sequence Order</p>
              {currentOrder.map((batch, i) => (
                <div key={batch.id} className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                   <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${overload && i === 0 ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>{i+1}</div>
                   <div className="flex-1">
                      <p className="text-xs font-bold text-white">{batch.id} — {batch.name}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">{batch.energy} kWh | {batch.priority} Priority</p>
                   </div>
                   <button onClick={() => swapBatches(i)} disabled={i === 0} className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-10 transition-opacity"><RefreshCcw size={12} className="rotate-90 text-primary" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergySchedulerPanel;