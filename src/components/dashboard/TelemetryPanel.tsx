import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

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
    <div className="glass-panel p-5">
      <p className="section-title mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="metric-value text-foreground text-4xl">{value.toLocaleString()}</span>
          <span className="ml-2 text-base text-muted-foreground">{unit}</span>
        </div>
        <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
          isDanger
            ? "bg-destructive/15 text-destructive"
            : "bg-success/15 text-success"
        }`}>
          <DriftIcon className="h-4 w-4" />
          {driftPct > 0 ? "+" : ""}{driftPct}%
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <span>Target:</span>
        <span className="font-mono font-medium text-foreground/70">{target.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
};

const driftData = [
  { t: "00:00", drift: 2.1 },
  { t: "04:00", drift: 3.5 },
  { t: "08:00", drift: 5.8 },
  { t: "10:00", drift: 8.2 },
  { t: "12:00", drift: 12.4 },
  { t: "14:00", drift: 15.1 },
  { t: "16:00", drift: 11.3 },
  { t: "18:00", drift: 9.7 },
  { t: "20:00", drift: 7.2 },
];

const TelemetryPanel = () => (
  <div className="flex flex-col gap-4 h-full">
    <div className="flex items-center gap-2 px-1">
      <Activity className="h-4 w-4 text-primary" />
      <span className="section-title">Live Telemetry & Drift Analytics</span>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <MetricCard label="Power Consumption" unit="kW" value={342} target={310} driftPct={10.3} />
      <MetricCard label="Motor Speed" unit="RPM" value={1475} target={1500} driftPct={-1.7} />
      <MetricCard label="Temperature" unit="°C" value={78} target={72} driftPct={8.3} />
    </div>

    {/* Drift Chart - expanded */}
    <div className="glass-panel p-5 flex-1 min-h-[300px]">
      <p className="section-title mb-4">L2 Drift Over Time</p>
      <div className="h-[calc(100%-3rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={driftData}>
            <XAxis
              dataKey="t"
              tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 20]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(220 20% 10% / 0.9)",
                border: "1px solid hsl(220 15% 25%)",
                borderRadius: "8px",
                fontSize: 12,
                color: "hsl(210 20% 90%)",
              }}
            />
            <Line
              type="monotone"
              dataKey="drift"
              stroke="hsl(170 80% 50%)"
              strokeWidth={2}
              dot={false}
              filter="drop-shadow(0 0 4px hsl(170 80% 50% / 0.4))"
            />
            <Line
              type="monotone"
              dataKey={() => 10}
              stroke="hsl(0 72% 55%)"
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-3 rounded bg-primary" /> Drift %
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-3 rounded bg-destructive opacity-60" style={{ borderTop: "1px dashed" }} /> Threshold (10%)
        </span>
      </div>
    </div>
  </div>
);

export default TelemetryPanel;
