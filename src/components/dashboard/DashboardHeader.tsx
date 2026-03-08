import { Activity, Wifi } from "lucide-react";

const DashboardHeader = () => (
  <header className="glass-panel flex items-center justify-between px-6 py-3">
    <div className="flex items-center gap-3">
      <Activity className="h-5 w-5 text-primary" />
      <h1 className="text-base font-semibold tracking-tight text-foreground">
        Aura Factory 360: <span className="glow-text">Spatial Intelligence</span>
      </h1>
    </div>

    <div className="status-badge">
      <span className="glow-dot" />
      <Wifi className="h-3 w-3" />
      System API: Connected
    </div>
  </header>
);

export default DashboardHeader;
