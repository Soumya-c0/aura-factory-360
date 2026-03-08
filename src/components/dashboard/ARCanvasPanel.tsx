import { Box, Maximize2 } from "lucide-react";

const ARCanvasPanel = () => (
  <div className="glass-panel-accent flex flex-col overflow-hidden h-full min-h-[500px]">
    <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
      <div className="flex items-center gap-2">
        <Box className="h-4 w-4 text-primary" />
        <span className="section-title">Live Machine AR Feed</span>
      </div>
      <button className="text-muted-foreground transition-colors hover:text-foreground">
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>

    <div className="relative flex flex-1 items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(145deg, hsl(220 20% 6%), hsl(230 25% 10%), hsl(220 20% 6%))" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
        <div
          className="absolute inset-x-0 h-[200%]"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.5) 2px, transparent 4px)",
            animation: "scan-line 8s linear infinite",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
          <Box className="h-7 w-7 text-primary opacity-60" />
        </div>
        <p className="font-mono text-sm text-muted-foreground">Three.js 3D Canvas Mount Point</p>
        <p className="mt-1 text-xs text-muted-foreground/50">WebGL context ready</p>
      </div>
    </div>
  </div>
);

export default ARCanvasPanel;
