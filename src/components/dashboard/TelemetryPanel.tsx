import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity, Cpu, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface MetricCardProps {
  label: string;
  unit: string;
  value: number;
  target: number;
  driftPct: number;
}

const MetricCard = ({ label, unit, value, target, driftPct }: MetricCardProps) => {
  const isDanger = Math.abs(driftPct) > 10;
  const DriftIcon = driftPct > 0 ? TrendingUp : TrendingDown;

  return (
    <div className="glass-panel p-5 bg-black/40 border-white/5 transition-all duration-300">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-4xl font-black text-white">{value.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
          <span className="ml-2 text-xs font-bold text-muted-foreground">{unit}</span>
        </div>
        <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-colors ${
          isDanger
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : "bg-green-500/20 text-green-400 border border-green-500/30"
        }`}>
          <DriftIcon className="h-4 w-4" />
          {driftPct > 0 ? "+" : ""}{driftPct.toFixed(1)}%
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground border-t border-white/10 pt-3">
        <span className="uppercase font-bold">Golden Target</span>
        <span className="font-mono font-black text-primary">{target.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
};

// Generate initial seed data for the chart so it's not empty on load
const generateInitialData = () => {
  const data = [];
  let currentDrift = 5.0;
  for (let i = 20; i >= 0; i--) {
    const d = new Date();
    d.setSeconds(d.getSeconds() - i * 2);
    data.push({
      time: d.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
      drift: currentDrift
    });
    currentDrift += (Math.random() - 0.45) * 1.5; // Slight upward bias
  }
  return data;
};

const LiveTelemetryPanel = () => {
  // --- DYNAMIC STATE ---
  const [chartData, setChartData] = useState(generateInitialData());
  const [metrics, setMetrics] = useState({
    power: { val: 325, target: 310, drift: 4.8 },
    rpm: { val: 1480, target: 1500, drift: -1.3 },
    temp: { val: 73.5, target: 72, drift: 2.1 }
  });
  const [aiLogs, setAiLogs] = useState([
    { time: new Date().toLocaleTimeString(), msg: "Initialized continuous monitoring...", type: "info" }
  ]);

  // --- THE "LIVE" ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });

      setChartData(prevData => {
        const lastDrift = prevData[prevData.length - 1].drift;
        // Random walk for the drift line
        let newDrift = lastDrift + (Math.random() - 0.45) * 1.2; 
        if (newDrift < 0) newDrift = Math.abs(newDrift); // Keep it mostly positive for the demo

        const newData = [...prevData, { time: timeStr, drift: Number(newDrift.toFixed(2)) }];
        if (newData.length > 20) newData.shift(); // Keep only the last 20 points so it "scrolls"
        return newData;
      });

      // Add "Jitter" to the Metric Cards to simulate live sensors
      setMetrics(prev => ({
        power: { ...prev.power, val: prev.power.target + (Math.random() * 20 - 5), drift: ((prev.power.val - prev.power.target) / prev.power.target) * 100 },
        rpm: { ...prev.rpm, val: prev.rpm.target + (Math.random() * 30 - 20), drift: ((prev.rpm.val - prev.rpm.target) / prev.rpm.target) * 100 },
        temp: { ...prev.temp, val: prev.temp.target + (Math.random() * 4 - 1), drift: ((prev.temp.val - prev.temp.target) / prev.temp.target) * 100 }
      }));

      // Randomly spawn AI Action Logs
      if (Math.random() > 0.7) {
        const actions = [
          "Micro-adjusting HVAC chillers...",
          "Compensating for RPM harmonic resonance.",
          "Golden Signature bounds verified.",
          "Slight thermal deviation detected. Smoothing power draw."
        ];
        const newMsg = actions[Math.floor(Math.random() * actions.length)];
        setAiLogs(prev => {
          const newLogs = [{ time: timeStr, msg: newMsg, type: newMsg.includes("deviation") ? "warn" : "info" }, ...prev];
          return newLogs.slice(0, 5); // Keep last 5 logs
        });
      }

    }, 1500); // Updates every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentOverallDrift = chartData[chartData.length - 1].drift;

  return (
    <div className="flex flex-col gap-6 h-full p-6 bg-slate-950 font-sans overflow-y-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-primary font-mono tracking-widest uppercase">Global Factory Stream</span>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Live Telemetry & Drift Analytics</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Sensors Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Global Power Load" unit="kW" value={metrics.power.val} target={metrics.power.target} driftPct={metrics.power.drift} />
        <MetricCard label="Average Motor Velocity" unit="RPM" value={metrics.rpm.val} target={metrics.rpm.target} driftPct={metrics.rpm.drift} />
        <MetricCard label="Floor Ambient Temp" unit="°C" value={metrics.temp.val} target={metrics.temp.target} driftPct={metrics.temp.drift} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[350px]">
        {/* Scrolling Drift Chart */}
        <div className="lg:col-span-3 glass-panel p-6 bg-black/40 border-white/5 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 z-10">
             <div>
               <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Aggregate L2 Drift Velocity</h3>
               <p className="text-sm font-black text-white mt-1">Real-time deviation from factory baseline</p>
             </div>
             <div className="text-right">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Current Drift</span>
               <span className={`text-2xl font-black ${currentOverallDrift > 10 ? 'text-red-400' : 'text-primary'}`}>
                 {currentOverallDrift.toFixed(2)}%
               </span>
             </div>
          </div>
          
          <div className="flex-1 w-full z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: "#64748b", fontFamily: "monospace" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "#64748b" }} 
                  axisLine={false} 
                  tickLine={false} 
                  domain={[0, 'auto']} 
                />
                <Tooltip 
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: 12, color: "#f8fafc" }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="drift" 
                  stroke={currentOverallDrift > 10 ? "#ef4444" : "#00d4ff"} 
                  strokeWidth={3} 
                  dot={false} 
                  isAnimationActive={false} // Crucial for smooth scrolling effect
                  style={{ transition: 'stroke 0.5s ease' }}
                />
                {/* The 10% Threshold Line */}
                <Line 
                  type="monotone" 
                  dataKey={() => 10} 
                  stroke="#ef4444" 
                  strokeWidth={1} 
                  strokeDasharray="4 4" 
                  dot={false} 
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider z-10 border-t border-white/5 pt-4">
            <span className="flex items-center gap-2">
              <span className={`inline-block h-1 w-4 rounded ${currentOverallDrift > 10 ? 'bg-red-500' : 'bg-primary'}`} /> Live Aggregate Drift
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-4 rounded bg-red-500/50" style={{ borderTop: "2px dashed #ef4444" }} /> Critical Threshold (10%)
            </span>
          </div>
        </div>

        {/* Live AI Activity Feed */}
        <div className="glass-panel p-5 bg-black/60 border-primary/20 flex flex-col relative">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu size={100} className="text-primary" />
           </div>
           <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3 z-10">
             <Cpu size={14} className="text-primary" />
             <h3 className="text-[10px] font-black text-white uppercase tracking-widest">AI Action Log</h3>
           </div>
           
           <div className="flex-1 flex flex-col gap-3 overflow-hidden z-10">
             {aiLogs.map((log, i) => (
               <div key={i} className={`p-3 rounded-lg border flex flex-col gap-1 transition-all duration-500 ${i === 0 ? 'bg-primary/10 border-primary/30 translate-x-0 opacity-100' : 'bg-white/5 border-white/5 translate-x-0 opacity-60'}`}>
                 <span className="text-[9px] font-mono text-muted-foreground">{log.time}</span>
                 <p className={`text-[10px] font-bold ${log.type === 'warn' ? 'text-red-400' : 'text-white'}`}>
                   {log.msg}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTelemetryPanel;