import { LayoutDashboard, Eye, ShieldAlert, Zap, Settings, HelpCircle } from "lucide-react";

export type ViewTab = "landing" | "dashboard" | "ar-feed" | "asset-ledger" | "energy-scheduler";

const navItems: { icon: typeof LayoutDashboard; label: string; tab: ViewTab }[] = [
  { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
  { icon: Eye, label: "Spatial AR Feed", tab: "ar-feed" },
  { icon: ShieldAlert, label: "Asset Ledger", tab: "asset-ledger" },
  { icon: Zap, label: "Energy Scheduler", tab: "energy-scheduler" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

interface Props {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

const DashboardSidebar = ({ activeTab, onTabChange }: Props) => (
  <aside className="glass-panel flex w-16 flex-col items-center justify-between py-6">
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => onTabChange("landing")}
        className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary transition-all hover:shadow-[0_0_12px_hsl(var(--glow-primary)/0.3)]"
        title="Home"
      >
        <span className="text-lg font-bold glow-text">A</span>
      </button>

      {navItems.map(({ icon: Icon, label, tab }) => (
        <button
          key={tab}
          title={label}
          onClick={() => onTabChange(tab)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
            activeTab === tab
              ? "bg-primary/15 text-primary shadow-[0_0_12px_hsl(var(--glow-primary)/0.2)]"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </button>
      ))}
    </div>

    <div className="flex flex-col items-center gap-1">
      {bottomItems.map(({ icon: Icon, label }) => (
        <button
          key={label}
          title={label}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Icon className="h-[18px] w-[18px]" />
        </button>
      ))}
    </div>
  </aside>
);

export default DashboardSidebar;
