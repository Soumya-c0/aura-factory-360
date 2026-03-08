import { ShieldAlert, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const alerts = [
  {
    type: "critical" as const,
    title: "15% Power Drift Detected in Granulation Phase",
    description: "Root cause: Material Dampness — auto-diagnosed via spectral analysis",
    time: "2 min ago",
    actions: true,
  },
  {
    type: "critical" as const,
    title: "Motor Vibration Anomaly on Unit M-04",
    description: "Bearing wear pattern detected — predictive replacement recommended in 48h",
    time: "14 min ago",
    actions: true,
  },
  {
    type: "resolved" as const,
    title: "Thermal drift auto-corrected. Coolant flow +12% applied.",
    description: "Self-healing action executed successfully. System stable.",
    time: "18 min ago",
  },
  {
    type: "resolved" as const,
    title: "Pressure regulator recalibrated on Line 3.",
    description: "Deviation corrected from 4.2 bar to target 4.0 bar.",
    time: "42 min ago",
  },
  {
    type: "resolved" as const,
    title: "Feed rate optimization applied to hopper H-02.",
    description: "Throughput improved by 3.1% with no quality impact.",
    time: "1h ago",
  },
];

const AssetLedgerPanel = () => (
  <div className="glass-panel flex flex-col overflow-hidden h-full">
    <div className="flex items-center gap-2 border-b border-border/50 px-5 py-3">
      <ShieldAlert className="h-4 w-4 text-primary" />
      <span className="section-title">Self-Healing Asset Ledger</span>
    </div>

    <div className="flex-1 space-y-4 p-5 overflow-y-auto">
      {alerts.map((alert, i) =>
        alert.type === "critical" ? (
          <div key={i} className="alert-critical">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-destructive">CRITICAL</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {alert.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/90">⚠️ {alert.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>

                {alert.actions && (
                  <div className="mt-3 flex items-center gap-2">
                    <button className="btn-heal">Approve Healing Action (-50 RPM)</button>
                    <button className="btn-reject">Reject</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div key={i} className="rounded-lg border border-success/15 bg-success/5 p-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-success">RESOLVED</span>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-foreground/70">{alert.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  </div>
);

export default AssetLedgerPanel;
