import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar, { type ViewTab } from "@/components/dashboard/DashboardSidebar";
import ARCanvasPanel from "@/components/dashboard/ARCanvasPanel";
import TelemetryPanel from "@/components/dashboard/TelemetryPanel";
import AssetLedgerPanel from "@/components/dashboard/AssetLedgerPanel";
import EnergySchedulerPanel from "@/components/dashboard/EnergySchedulerPanel";

const viewComponents: Record<ViewTab, React.FC> = {
  dashboard: TelemetryPanel,
  "ar-feed": ARCanvasPanel,
  "asset-ledger": AssetLedgerPanel,
  "energy-scheduler": EnergySchedulerPanel,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const ActiveView = viewComponents[activeTab];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background p-2 gap-2">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <DashboardHeader />

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1">
          <ActiveView />
        </div>
      </div>
    </div>
  );
};

export default Index;
