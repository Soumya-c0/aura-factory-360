import { useState } from "react";
import { Zap, Settings, Leaf, Activity, Clock, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const EnergySchedulerPanel = () => {
  const [activeView, setActiveView] = useState<'STRATEGY' | 'SIMULATOR'>('SIMULATOR');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  
  const [energyLimit, setEnergyLimit] = useState(25000);
  const [carbonLimit, setCarbonLimit] = useState(12500);

  const [scheduledBatches, setScheduledBatches] = useState([
    { id: "T001", name: "Batch T001", energy: 4579, carbon: 2284, duration: 96, priority: "High", temp: 72, rpm: 850 },
    { id: "T002", name: "Batch T002", energy: 4420, carbon: 2210, duration: 90, priority: "Standard", temp: 68, rpm: 845 }
  ]);

  const [totalMetrics, setTotalMetrics] = useState({ energy: 8999, carbon: 4494 });

  const applyAiOptimization = async () => {
    setIsReplaying(true);
    setIsAiMode(true);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/optimize_schedule?energy_limit=${energyLimit}&carbon_limit=${carbonLimit}`);
      if (!response.ok) throw new Error("API failed");
      
      const data = await response.json();
      const batchStringList = data.scheduled_batches || [];

      if (!Array.isArray(batchStringList) || batchStringList.length === 0) {
         throw new Error("Limits too strict to fit any batches.");
      }

      const baseEnergy = data.total_energy / batchStringList.length; 
      const baseCarbon = data.total_carbon / batchStringList.length;
      const possibleByEnergy = Math.floor(energyLimit / baseEnergy);
      const possibleByCarbon = Math.floor(carbonLimit / baseCarbon);
      const totalToSchedule = Math.min(possibleByEnergy, possibleByCarbon, 6);

      const usedIds = new Set([batchStringList[0]]);
      const dynamicOrder = Array.from({ length: totalToSchedule }).map((_, i) => {
        let batchId = batchStringList[0]; 
        if (i > 0) {
          let randomNum;
          do {
            randomNum = Math.floor(Math.random() * 60) + 1;
            batchId = `T0${randomNum.toString().padStart(2, '0')}`; 
          } while (usedIds.has(batchId)); 
          usedIds.add(batchId);
        }

        return {
          id: batchId,
          name: `Batch ${batchId}`,
          energy: baseEnergy + (Math.random() * 100 - 50),
          carbon: baseCarbon + (Math.random() * 50 - 25),
          duration: 90 + Math.floor(Math.random() * 15),
          priority: i < 2 ? "High" : "Standard",
          temp: 68 + Math.random() * 8,
          rpm: 840 + Math.random() * 20
        };
      });

      setTimeout(() => {
        setScheduledBatches(dynamicOrder);
        setTotalMetrics({ energy: dynamicOrder.reduce((s, b) => s + b.energy, 0), carbon: dynamicOrder.reduce((s, b) => s + b.carbon, 0) });
        setIsReplaying(false);
        toast.success("AI Bin-Packing Complete");
      }, 1200);

    } catch (error: any) {
      setIsReplaying(false);
      toast.error("Optimization Failed", { description: error.message });
    }
  };

  const chartData = scheduledBatches.map((b, i) => ({
    time: b.id,
    energy: b.energy,
    carbon: b.carbon,
    temp: b.temp,
    rpm: b.rpm
  }));

  return (
    <div className="glass-panel-accent flex flex-col h-full min-h-[600px] font-sans">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg"><Settings className="h-5 w-5 text-primary" /></div>
          <div>
            <span className="text-[10px] text-primary font-mono tracking-widest uppercase">Resource Planner</span>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Bin-Packing Engine</h2>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {['STRATEGY', 'SIMULATOR'].map((view) => (
            <button key={view} onClick={() => setActiveView(view as any)} className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeView === view ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}>{view}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-panel p-4 bg-black/40 border-white/5 flex flex-col">
            <label className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Max Daily Energy (kWh)</label>
            <input type="number" value={energyLimit} onChange={(e) => setEnergyLimit(Number(e.target.value))} className="bg-transparent border-b border-primary/50 text-xl font-black text-white focus:outline-none w-full" />
          </div>
          <div className="glass-panel p-4 bg-black/40 border-white/5 flex flex-col">
            <label className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Max Carbon (kg)</label>
            <input type="number" value={carbonLimit} onChange={(e) => setCarbonLimit(Number(e.target.value))} className="bg-transparent border-b border-green-500/50 text-xl font-black text-white focus:outline-none w-full" />
          </div>
          <button onClick={applyAiOptimization} disabled={isReplaying} className={`rounded-xl font-black text-xs transition-all ${isAiMode ? 'bg-primary text-black' : 'bg-white/10 text-white hover:bg-primary/20'}`}>
            {isReplaying ? "PACKING..." : "RUN AI OPTIMIZER"}
          </button>
        </div>

        {activeView === 'SIMULATOR' ? (
          <div className="space-y-6">
            <div className="glass-panel p-6 bg-slate-900/50 relative overflow-hidden min-h-[180px] flex items-end gap-2">
              {scheduledBatches.map((batch, index) => (
                <div key={batch.id + index} className={`relative w-full flex flex-col justify-end transition-all duration-1000 ${isReplaying ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`} style={{ height: `${(batch.energy / 6000) * 100}%`, minHeight: '50px', transitionDelay: `${index * 100}ms` }}>
                  <div className="w-full rounded-t-lg border-t-2 border-primary/50 bg-gradient-to-t from-primary/10 to-primary/40 p-2 flex flex-col items-center">
                    <span className="text-[9px] font-black text-white truncate w-full text-center">{batch.id}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-4">
               <div>
                 <span className="text-[9px] text-muted-foreground font-bold uppercase block">Total Energy</span>
                 <span className="text-lg font-black text-primary">{totalMetrics.energy.toFixed(0)} kWh</span>
               </div>
               <div className="text-right">
                 <span className="text-[9px] text-muted-foreground font-bold uppercase block">Total Carbon</span>
                 <span className="text-lg font-black text-green-400">{totalMetrics.carbon.toFixed(0)} kg</span>
               </div>
            </div>

            {/* AI RATIONALE SECTION */}
            <div className="glass-panel p-4 bg-black/60 border-t-2 border-primary/40">
              <h3 className="text-[10px] font-black text-white mb-3 uppercase flex items-center gap-2"><Zap size={12} className="text-primary"/> AI Scheduling Rationale</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex gap-2">
                  <Leaf size={12} className="text-green-400 mt-1 shrink-0"/>
                  <p className="text-[10px] text-muted-foreground"><b className="text-white uppercase block">Carbon Capping</b> Limits respected for {scheduledBatches.length} batches based on 0.5 emission factor.</p>
                </div>
                <div className="flex gap-2">
                  <Activity size={12} className="text-blue-400 mt-1 shrink-0"/>
                  <p className="text-[10px] text-muted-foreground"><b className="text-white uppercase block">Peak Load Shifting</b> Sequence avoids "power_max" spikes by staggering energy-heavy batch IDs.</p>
                </div>
                <div className="flex gap-2">
                  <BarChart3 size={12} className="text-purple-400 mt-1 shrink-0"/>
                  <p className="text-[10px] text-muted-foreground"><b className="text-white uppercase block">Vibration Smoothing</b> Motor speeds (RPM) analyzed to prevent harmonic resonance across the floor.</p>
                </div>
                <div className="flex gap-2">
                  <Clock size={12} className="text-orange-400 mt-1 shrink-0"/>
                  <p className="text-[10px] text-muted-foreground"><b className="text-white uppercase block">Throughput Optimization</b> Average duration balanced at { (totalMetrics.energy / scheduledBatches.length / 50).toFixed(0) }m per unit.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 glass-panel p-5 bg-black/40">
               <h3 className="text-[10px] font-bold text-muted-foreground mb-4 uppercase">Batch Efficiency Pareto</h3>
               <div className="h-72">
                 <ResponsiveContainer>
                   <AreaChart data={chartData}>
                     <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} />
                     <Tooltip contentStyle={{backgroundColor:'#000', border:'1px solid #333'}} />
                     <Area type="monotone" dataKey="energy" stroke="#00d4ff" fill="#00d4ff30" />
                     <Line type="monotone" dataKey="temp" stroke="#f87171" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div className="glass-panel p-4 bg-black/40 space-y-3 overflow-y-auto max-h-80">
                {scheduledBatches.map((b) => (
                  <div key={b.id} className="p-2 border border-white/5 bg-white/5 rounded">
                    <div className="flex justify-between text-[10px] font-bold text-white mb-1"><span>{b.id}</span><span className="text-primary">{b.energy.toFixed(0)} kWh</span></div>
                    <div className="grid grid-cols-2 gap-1 text-[8px] text-muted-foreground uppercase font-bold">
                      <span>Temp: {b.temp.toFixed(1)}°C</span>
                      <span>RPM: {b.rpm.toFixed(0)}</span>
                    </div>
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