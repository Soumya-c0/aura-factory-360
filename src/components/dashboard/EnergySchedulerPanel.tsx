import { Zap, Clock, Leaf, Battery } from "lucide-react";

const batches = [
  { id: "T001", status: "running", energy: "32 kWh", time: "08:00 – 10:30", progress: 78 },
  { id: "T002", status: "queued", energy: "28 kWh", time: "10:45 – 12:15", progress: 0 },
  { id: "T003", status: "queued", energy: "19 kWh", time: "13:00 – 14:00", progress: 0 },
  { id: "T004", status: "queued", energy: "24 kWh", time: "14:30 – 16:00", progress: 0 },
  { id: "T005", status: "queued", energy: "15 kWh", time: "16:15 – 17:00", progress: 0 },
];

const EnergySchedulerPanel = () => (
  <div className="glass-panel flex flex-col overflow-hidden h-full">
    <div className="flex items-center gap-2 border-b border-border/50 px-5 py-3">
      <Zap className="h-4 w-4 text-primary" />
      <span className="section-title">Energy Bin-Packing Scheduler</span>
    </div>

    <div className="flex-1 space-y-6 p-5 overflow-y-auto">
      {/* Carbon budget */}
      <div className="glass-panel p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-foreground">Daily Carbon/Energy Budget</span>
          </div>
          <span className="font-mono text-lg font-semibold text-warning">85%</span>
        </div>
        <div className="progress-bar-track h-3">
          <div className="progress-bar-fill h-3" style={{ width: "85%" }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>127.5 / 150 kWh consumed</span>
          <div className="flex items-center gap-1.5">
            <Battery className="h-3.5 w-3.5" />
            <span className="font-mono text-foreground/70">22.5 kWh remaining</span>
          </div>
        </div>
      </div>

      {/* Batch timeline */}
      <div>
        <p className="section-title mb-3">Production Queue</p>
        <div className="space-y-3">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                batch.status === "running"
                  ? "border-primary/25 bg-primary/5"
                  : "border-border/50 bg-secondary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${
                  batch.status === "running" ? "glow-dot !bg-primary !shadow-[0_0_8px_hsl(var(--glow-primary)/0.6)]" : "bg-muted-foreground/40"
                }`} />
                <div>
                  <span className="text-sm font-medium text-foreground">Batch {batch.id}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {batch.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm text-foreground/70">{batch.energy}</span>
                {batch.status === "running" && (
                  <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${batch.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default EnergySchedulerPanel;
