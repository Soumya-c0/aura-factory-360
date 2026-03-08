import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ARCanvasPanel from "@/components/dashboard/ARCanvasPanel";
import TelemetryPanel from "@/components/dashboard/TelemetryPanel";
import AssetLedgerPanel from "@/components/dashboard/AssetLedgerPanel";
import EnergySchedulerPanel from "@/components/dashboard/EnergySchedulerPanel";

const Index = () => (
  <div className="flex h-screen w-screen overflow-hidden bg-background p-2 gap-2">
    {/* Sidebar */}
    <DashboardSidebar />

    {/* Main area */}
    <div className="flex flex-1 flex-col gap-2 min-w-0">
      {/* Header */}
      <DashboardHeader />

      {/* Content grid */}
      <div className="flex-1 grid grid-cols-[1fr_280px] grid-rows-[1fr_auto] gap-2 min-h-0">
        {/* AR Canvas - top center */}
        <div className="min-h-0">
          <ARCanvasPanel />
        </div>

        {/* Telemetry - right column spanning full height */}
        <div className="row-span-2 overflow-y-auto scrollbar-thin pr-1">
          <TelemetryPanel />
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-2 gap-2 min-h-[240px]">
          <AssetLedgerPanel />
          <EnergySchedulerPanel />
        </div>
      </div>
    </div>
  </div>
);

export default Index;
