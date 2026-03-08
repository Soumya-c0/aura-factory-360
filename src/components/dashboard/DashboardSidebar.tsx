import { LayoutDashboard, Eye, BarChart3, ShieldCheck, Zap, Settings, HelpCircle } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Eye, label: "AR Feed" },
  { icon: BarChart3, label: "Analytics" },
  { icon: ShieldCheck, label: "Self-Heal" },
  { icon: Zap, label: "Energy" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

const DashboardSidebar = () => (
  <aside className="glass-panel flex w-16 flex-col items-center justify-between py-6">
    <div className="flex flex-col items-center gap-1">
      {/* Logo mark */}
      <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <span className="text-lg font-bold glow-text">A</span>
      </div>

      {navItems.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          title={label}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
            active
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
