import { Activity, Zap, Leaf, Box, Server, ShieldCheck, Cpu } from "lucide-react";

const MainDashboardPanel = () => {
  const kpis = [
    { icon: <Activity size={18} />, label: "System Health", value: "94.2%", color: "text-primary" },
    { icon: <Box size={18} />, label: "Active Batches", value: "12", color: "text-white" },
    { icon: <Zap size={18} />, label: "Energy Saved", value: "420 kWh", color: "text-yellow-400" },
    { icon: <Leaf size={18} />, label: "Carbon Credits", value: "+1.2", color: "text-green-400" }
  ];

  const logs = [
    { time: "JUST NOW", msg: "Self-Healing executed on Compression Batch T002.", type: "success" },
    { time: "2M AGO", msg: "Bin-Packing Engine allocated 6 optimal batches.", type: "info" },
    { time: "15M AGO", msg: "RAG Pipeline vectorized new SOP Mechanical Manuals.", type: "info" },
    { time: "1H AGO", msg: "Golden Signature Drift detected on T018 (Resolved).", type: "success" },
    { time: "SYSTEM", msg: "Aura AI Handshake with Core Factory Database.", type: "system" }
  ];

  return (
    <div className="relative flex items-center justify-center h-full bg-[#020617] font-sans overflow-hidden">
      
      {/* --- ANIMATION STYLES --- */}
      <style>
        {`
          @keyframes orbit-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes orbit-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          
          .animate-orbit-cw { animation: orbit-cw 60s linear infinite; }
          .animate-orbit-ccw { animation: orbit-ccw 70s linear infinite; }
          
          /* Counter-rotations to keep text upright */
          .animate-counter-cw { animation: orbit-ccw 60s linear infinite; } 
          .animate-counter-ccw { animation: orbit-cw 70s linear infinite; }

          /* Pause everything when hovering over the radar */
          .radar-system:hover .animate-orbit-cw,
          .radar-system:hover .animate-orbit-ccw,
          .radar-system:hover .animate-counter-cw,
          .radar-system:hover .animate-counter-ccw {
             animation-play-state: paused;
          }
        `}
      </style>

      {/* --- BRIGHT WHITISH-GREEN GRID BACKGROUND --- */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.15) 1px, transparent 1px)
          `,
        }}
      />
      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0" />
      {/* ------------------------------------------------ */}

      {/* --- RADAR SYSTEM (Holds the Orbits) --- */}
      <div className="relative radar-system w-[850px] h-[850px] flex items-center justify-center z-10">
        
        {/* ORBIT 2: ACTION LOGS (Outer Circle - Counter-Clockwise) */}
        <div className="absolute w-[800px] h-[800px] rounded-full border border-primary/20 animate-orbit-ccw">
          {logs.map((log, i) => {
            // Distribute 5 items evenly (360 / 5 = 72 degrees)
            const angle = (i * 72) * (Math.PI / 180);
            const x = 50 + 50 * Math.cos(angle);
            const y = 50 + 50 * Math.sin(angle);
            
            const logColors: Record<string, string> = {
              success: "text-green-400 bg-green-400/20 border-green-400",
              info: "text-primary bg-primary/20 border-primary",
              system: "text-slate-300 bg-slate-500/20 border-slate-400"
            };

            return (
              <div 
                key={i} 
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-crosshair z-30"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                 {/* Counter-rotation applies to this wrapper so the text stays upright */}
                 <div className="animate-counter-ccw relative flex items-center justify-center">
                    
                    {/* The Node Dot & Time */}
                    <div className="flex flex-col items-center gap-1 transition-transform group-hover:scale-110">
                      <div className={`w-4 h-4 rounded-full border-2 shadow-[0_0_15px_currentColor] ${logColors[log.type]}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border border-white/10 ${logColors[log.type].split(' ')[0]}`}>
                        {log.time}
                      </span>
                    </div>

                    {/* The Hover Tooltip (Hidden by default) */}
                    <div className="absolute top-8 w-[220px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-2">
                      <div className="glass-panel p-3 bg-black/90 border-white/20 shadow-2xl backdrop-blur-xl rounded-lg text-center">
                        <Server size={12} className={`mx-auto mb-1 ${logColors[log.type].split(' ')[0]}`} />
                        <p className="text-[10px] font-bold text-white leading-relaxed">{log.msg}</p>
                      </div>
                    </div>

                 </div>
              </div>
            )
          })}
        </div>

        {/* ORBIT 1: KPIs (Inner Circle - Clockwise) */}
        <div className="absolute w-[500px] h-[500px] rounded-full border-2 border-dashed border-green-500/20 animate-orbit-cw">
          {kpis.map((kpi, i) => {
             // Distribute 4 items evenly (360 / 4 = 90 degrees)
             // Offset by 45 degrees so they don't block the direct top/bottom/sides
             const angle = (i * 90 + 45) * (Math.PI / 180);
             const x = 50 + 50 * Math.cos(angle);
             const y = 50 + 50 * Math.sin(angle);

             return (
               <div 
                 key={i} 
                 className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                 style={{ left: `${x}%`, top: `${y}%` }}
               >
                  <div className="animate-counter-cw">
                    <div className="glass-panel w-[160px] p-4 bg-black/80 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center text-center backdrop-blur-md rounded-xl hover:border-primary/50 transition-colors">
                      <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 mb-2 ${kpi.color}`}>
                        {kpi.icon}
                      </div>
                      <span className={`text-2xl font-black tracking-tight leading-none mb-1 ${kpi.color}`}>
                        {kpi.value}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {kpi.label}
                      </span>
                    </div>
                  </div>
               </div>
             )
          })}
        </div>

        {/* CENTERPIECE: TITLE & TAGLINE */}
        <div className="absolute z-40 bg-[#020617]/90 w-[300px] h-[300px] rounded-full flex flex-col items-center justify-center border-4 border-primary/30 shadow-[0_0_80px_rgba(0,212,255,0.3)] backdrop-blur-2xl">
          <Cpu size={32} className="text-primary mb-2 animate-pulse" />
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase text-center leading-none drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400 italic text-5xl">Aura <br/>Factory<br/>360</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent my-3" />

        </div>

      </div>
    </div>
  );
};

export default MainDashboardPanel;