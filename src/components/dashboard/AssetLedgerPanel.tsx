import { ShieldAlert, Clock, AlertTriangle } from "lucide-react";

const AssetLedgerPanel = () => (
  <div className="glass-panel flex flex-col overflow-hidden">
    <div className="flex items-center gap-2 border-b border-border/50 px-5 py-3">
      <ShieldAlert className="h-4 w-4 text-primary" />
      <span className="section-title">Self-Healing Asset Ledger</span>
    </div>

    <div className="flex-1 space-y-3 p-4">
      {/* Critical Alert */}
      <div className="alert-critical">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-destructive">CRITICAL</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> 2 min ago
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground/90">
              ⚠️ 15% Power Drift Detected in Granulation Phase.
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Root cause: Material Dampness — auto-diagnosed via spectral analysis
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button className="btn-heal">
                Approve Healing Action (-50 RPM)
              </button>
              <button className="btn-reject">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resolved alert */}
      <div className="rounded-lg border border-success/15 bg-success/5 p-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-success">RESOLVED</span>
              <span className="text-xs text-muted-foreground">18 min ago</span>
            </div>
            <p className="mt-0.5 text-sm text-foreground/70">
              Thermal drift auto-corrected. Coolant flow +12% applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AssetLedgerPanel;
