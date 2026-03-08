import { useEffect, useState } from "react";
import { Activity, Wifi } from "lucide-react";

const DashboardHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-panel flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <Activity className="h-5 w-5 text-primary" />
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          Aura-Optimize: <span className="glow-text">Spatial Intelligence</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <time className="font-mono text-sm text-muted-foreground">
          {time.toLocaleTimeString("en-US", { hour12: false })}
          <span className="ml-2 text-xs opacity-60">
            {time.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
          </span>
        </time>

        <div className="status-badge">
          <span className="glow-dot" />
          <Wifi className="h-3 w-3" />
          System API: Connected
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
