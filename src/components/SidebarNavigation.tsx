import React from 'react';
import { TabType, StockData } from '../types/stock';
import { StockSenseLogo } from './StockSenseLogo';
import {
  LayoutDashboard,
  TrendingUp,
  ShieldAlert,
  Cpu,
  Bookmark,
  Newspaper,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeStock?: StockData;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  activeStock,
}) => {
  const { theme, toggleTheme } = useTheme();
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    {
      id: 'predictions',
      label: 'Market Predictions',
      icon: <TrendingUp className="w-5 h-5 shrink-0" />,
      badge: 'ML',
    },
    {
      id: 'risk-matrix',
      label: 'Risk Assessment',
      icon: <ShieldAlert className="w-5 h-5 shrink-0" />,
      badge: 'VaR',
    },
    {
      id: 'xai-explainability',
      label: 'Explainable AI',
      icon: <Cpu className="w-5 h-5 shrink-0" />,
      badge: 'SHAP',
    },
    { id: 'watchlist', label: 'Watchlist', icon: <Bookmark className="w-5 h-5 shrink-0" /> },
    {
      id: 'news-sentiment',
      label: 'News & Sentiment',
      icon: <Newspaper className="w-5 h-5 shrink-0" />,
      badge: 'FinBERT',
    },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#101a2b] border-r border-[#1e293b] h-screen sticky top-0 transition-all duration-300 z-40 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Brand Logo Section */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#1e293b] overflow-hidden">
        <StockSenseLogo collapsed={collapsed} size={collapsed ? 'sm' : 'md'} />
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="w-7 h-7 rounded-lg bg-[#070d19] hover:bg-[#16243c] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e293b] flex items-center justify-center transition-colors shrink-0 ml-1"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Active Ticker Context Pill (if expanded) */}
      {!collapsed && activeStock && (
        <div className="px-3 pt-3">
          <div className="bg-[#070d19] p-2 rounded-xl border border-[#1e293b] flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
              <span className="font-mono text-[12px] font-bold text-[#f1f5f9] truncate">
                {activeStock.symbol}
              </span>
              <span className="text-[10px] text-[#94a3b8] font-mono truncate">
                {activeStock.priceFormatted}
              </span>
            </div>
            <span
              className={`font-mono text-[10px] font-semibold px-1 rounded ${
                activeStock.change >= 0 ? 'text-[#34d399] bg-[#10b981]/15' : 'text-[#f87171] bg-[#ef4444]/15'
              }`}
            >
              {activeStock.changePercent >= 0 ? '+' : ''}
              {activeStock.changePercent.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all group relative ${
                isActive
                  ? 'bg-[#16243c] text-[#22d3ee] font-semibold shadow-sm border border-[#22d3ee]/30'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#16243c]/60'
              } ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`transition-colors ${
                    isActive ? 'text-[#22d3ee]' : 'text-[#94a3b8] group-hover:text-[#f1f5f9]'
                  }`}
                >
                  {item.icon}
                </span>

                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {/* Tag / Badge */}
              {!collapsed && item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono tracking-wider uppercase font-semibold ${
                    isActive
                      ? 'bg-[#22d3ee]/20 text-[#22d3ee]'
                      : 'bg-[#070d19] text-[#64748b] group-hover:text-[#94a3b8]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active bar indicator on collapsed mode */}
              {collapsed && isActive && (
                <span className="absolute left-0 w-1 h-5 bg-[#22d3ee] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status & Theme Footer */}
      <div className="p-3 border-t border-[#1e293b] bg-[#0a1120] font-mono text-[11px] space-y-2">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-8 h-8 rounded-lg bg-[#101a2b] hover:bg-[#16243c] border border-[#1e293b] flex items-center justify-center transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#f59e0b]" />
              ) : (
                <Moon className="w-4 h-4 text-[#0284c7]" />
              )}
            </button>
            <div title="Systems: Online • v2.4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse block" />
            </div>
          </div>
        ) : (
          <>
            {/* Quick Theme Switcher Pill */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-[#101a2b] hover:bg-[#16243c] border border-[#1e293b] transition-colors text-[11px] cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-[#22d3ee]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                )}
                <span className="text-[#f1f5f9] font-medium">
                  {theme === 'dark' ? 'Dark Terminal' : 'Daylight Mode'}
                </span>
              </div>
              <span className="text-[10px] text-[#22d3ee] font-semibold">
                {theme === 'dark' ? 'LIGHT' : 'DARK'}
              </span>
            </button>

            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span>Systems Active</span>
                </span>
                <span className="text-[10px] text-[#22d3ee]">v2.4</span>
              </div>
              <div className="text-[10px] text-[#64748b] truncate">
                FastAPI + SHAP + Atlas
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default SidebarNavigation;
