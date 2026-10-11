import React, { useState } from 'react';
import { TabType } from '../types/stock';
import {
  LayoutDashboard,
  TrendingUp,
  ShieldAlert,
  Cpu,
  Bookmark,
  Newspaper,
  Briefcase,
  Settings,
  Grid,
  X,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isOpenMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  isOpenMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // 4 primary mobile bottom items + "More"
  const primaryItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'predictions' as TabType, label: 'Predictions', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'risk-matrix' as TabType, label: 'Risk', icon: <ShieldAlert className="w-5 h-5" /> },
    { id: 'xai-explainability' as TabType, label: 'XAI', icon: <Cpu className="w-5 h-5" /> },
  ];

  const moreItems: { id: TabType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'watchlist', label: 'Watchlist', icon: <Bookmark className="w-5 h-5 text-[#22d3ee]" />, desc: 'Tracked stocks & alerts' },
    { id: 'news-sentiment', label: 'News & Sentiment', icon: <Newspaper className="w-5 h-5 text-[#38bdf8]" />, desc: 'FinBERT NLP sentiment' },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5 text-[#a78bfa]" />, desc: 'Holdings & aggregate P&L' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 text-[#94a3b8]" />, desc: 'Trading universe & APIs' },
  ];

  const handleSelectTab = (tab: TabType) => {
    onTabChange(tab);
    setIsMoreMenuOpen(false);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  const isMoreActive =
    currentTab === 'watchlist' ||
    currentTab === 'news-sentiment' ||
    currentTab === 'portfolio' ||
    currentTab === 'settings';

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on mobile/tablet < md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#070d19]/95 backdrop-blur-xl border-t border-[#1e293b] select-none">
        <div className="flex justify-around items-center h-16 px-1 max-w-lg mx-auto w-full">
          {primaryItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-12 transition-all relative ${
                  isActive ? 'text-[#22d3ee] font-semibold' : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 w-7 h-0.5 bg-[#22d3ee] rounded-full" />
                )}
                <span className={isActive ? 'text-[#22d3ee]' : 'text-[#94a3b8]'}>
                  {item.icon}
                </span>
                <span className="text-[10px] mt-0.5 tracking-tight font-sans">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 h-12 transition-all relative ${
              isMoreActive ? 'text-[#22d3ee] font-semibold' : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            {isMoreActive && (
              <span className="absolute -top-2 w-7 h-0.5 bg-[#22d3ee] rounded-full" />
            )}
            <Grid className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-sans">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More / Mobile Drawer Sheet */}
      {(isMoreMenuOpen || isOpenMobileDrawer) && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-[#101a2b] border-t border-[#1e3a5f] rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div>
                <h3 className="text-[16px] font-bold text-[#f1f5f9]">All Navigation Sections</h3>
                <span className="text-[11px] font-mono text-[#94a3b8]">StockSense AI Modular Suite</span>
              </div>
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className="w-8 h-8 rounded-full bg-[#16243c] text-[#94a3b8] hover:text-[#f1f5f9] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Toggle in Mobile Drawer */}
            <div className="bg-[#070d19] p-3 rounded-xl border border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-[#22d3ee]" />
                ) : (
                  <Sun className="w-4 h-4 text-[#f59e0b]" />
                )}
                <div>
                  <span className="text-[12px] font-semibold text-[#f1f5f9] block">
                    {theme === 'dark' ? 'Dark Terminal Mode' : 'Daylight Precision Mode'}
                  </span>
                  <span className="text-[10px] text-[#64748b] font-mono">
                    {theme === 'dark' ? 'Institutional high-contrast dark' : 'Clean daytime high-contrast'}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg bg-[#16243c] hover:bg-[#1e3a5f] text-[#22d3ee] border border-[#22d3ee]/30 text-[11px] font-mono font-bold transition-colors cursor-pointer"
              >
                {theme === 'dark' ? 'Set Light' : 'Set Dark'}
              </button>
            </div>

            {/* Grid of All 8 Sections */}
            <div className="grid grid-cols-1 gap-2">
              {[...primaryItems, ...moreItems].map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`p-3 rounded-xl flex items-center justify-between border transition-all text-left ${
                      isActive
                        ? 'bg-[#16243c] border-[#22d3ee]/40 text-[#22d3ee]'
                        : 'bg-[#070d19] border-[#1e293b] text-[#f1f5f9] hover:bg-[#16243c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#22d3ee]' : 'text-[#94a3b8]'}>
                        {item.icon}
                      </span>
                      <div>
                        <span className="font-semibold text-[13px] block">{item.label}</span>
                        {'desc' in item && (
                          <span className="text-[11px] text-[#64748b] font-mono block">
                            {item.desc}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#64748b]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
