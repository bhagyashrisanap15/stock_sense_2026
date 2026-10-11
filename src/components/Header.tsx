import React, { useState, useEffect } from 'react';
import { TabType, StockData } from '../types/stock';
import { MARKET_TICKER_ITEMS } from '../data/stocksData';
import { StockSenseLogo } from './StockSenseLogo';
import {
  Bell,
  Menu,
  X,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onOpenNotifications: () => void;
  onSelectStock: (symbol: string) => void;
  onOpenMobileNav?: () => void;
  isLive: boolean;
  onToggleLive: () => void;
  activeStock?: StockData;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenNotifications,
  onSelectStock,
  onOpenMobileNav,
  isLive,
  onToggleLive,
  activeStock,
}) => {
  const [tickerItems, setTickerItems] = useState(MARKET_TICKER_ITEMS);

  // Tab display name mapping
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
      case 'predictions':
        return 'Market Predictions';
      case 'risk-matrix':
        return 'Risk Assessment';
      case 'xai-explainability':
        return 'Explainable AI';
      case 'watchlist':
        return 'Watchlist';
      case 'news-sentiment':
        return 'News & Sentiment';
      case 'portfolio':
        return 'Portfolio';
      case 'settings':
        return 'Settings';
      case 'terminal-hub':
        return 'Terminal Hub';
      default:
        return 'Dashboard';
    }
  };

  // Simulated live market ticker micro-updates when LIVE mode is enabled
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setTickerItems((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.6) {
            const jitter = (Math.random() - 0.48) * 0.05;
            const currentPct = parseFloat(item.change.replace('%', ''));
            const newPct = (currentPct + jitter).toFixed(2);
            const isPos = parseFloat(newPct) >= 0;
            return {
              ...item,
              change: (isPos ? '+' : '') + newPct + '%',
              isPositive: isPos,
            };
          }
          return item;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <header className="sticky top-0 z-30 bg-[#070d19]/90 backdrop-blur-xl border-b border-[#1e293b] select-none">
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger + Brand Logo or Section Title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          {onOpenMobileNav && (
            <button
              onClick={onOpenMobileNav}
              className="md:hidden p-2 rounded-xl bg-[#101a2b] hover:bg-[#16243c] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e293b] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo visible on mobile (since sidebar is hidden) */}
          <div className="md:hidden">
            <StockSenseLogo size="sm" showSubtitle={false} />
          </div>

          {/* Breadcrumb Section Indicator for desktop */}
          <div className="hidden md:flex items-center gap-2 font-mono text-[13px]">
            <span className="text-[#64748b]">StockSense AI</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-[#22d3ee] font-semibold">{getTabLabel(currentTab)}</span>
            {activeStock && (
              <>
                <span className="text-[#64748b]">•</span>
                <span className="text-[#f1f5f9] px-2 py-0.5 rounded bg-[#101a2b] border border-[#1e293b] text-[11px]">
                  {activeStock.symbol} ({activeStock.priceFormatted})
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Live Horizontal Ticker Tape (desktop only) */}
        <div className="hidden lg:flex items-center gap-3 overflow-x-auto no-scrollbar font-mono text-[11px] text-[#94a3b8] max-w-xl">
          {tickerItems.slice(0, 5).map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.symbol !== 'NIFTY 50') {
                  onSelectStock(item.symbol);
                }
              }}
              className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-[#101a2b] border border-[#1e293b] hover:border-[#1e3a5f] hover:text-[#f1f5f9] transition-colors"
            >
              <span className="text-[#f1f5f9] font-medium">{item.symbol}</span>
              <span>{item.price}</span>
              <span
                className={`font-semibold ${
                  item.isPositive ? 'text-[#34d399]' : 'text-[#f87171]'
                }`}
              >
                {item.change}
              </span>
            </button>
          ))}
        </div>

        {/* Right Actions: LIVE Telemetry Toggle & Notifications */}
        <div className="flex items-center gap-2">
          {/* Live Telemetry Toggle */}
          <button
            onClick={onToggleLive}
            aria-label="Live telemetry toggle"
            className={`h-9 px-3 flex items-center gap-2 rounded-xl transition-all font-mono text-[11px] font-semibold border ${
              isLive
                ? 'bg-[#101a2b] text-[#22d3ee] border-[#22d3ee]/40 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                : 'bg-[#101a2b] text-[#64748b] border-[#1e293b]'
            }`}
            title={isLive ? 'Live real-time telemetry streaming active' : 'Live telemetry stream paused'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-[#22d3ee] animate-pulse' : 'bg-[#64748b]'
              }`}
            />
            <span className="hidden sm:inline">{isLive ? 'STREAMING' : 'OFFLINE'}</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#101a2b] border border-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#16243c] relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22d3ee]" />
          </button>

          {/* User Profile Avatar with Initials */}
          <div
            title="User: Bhagyashri Sanap (Engineering Lead)"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16243c] to-[#0a1120] border border-[#1e3a5f] flex items-center justify-center font-mono text-[11px] font-bold text-[#22d3ee] select-none"
          >
            BS
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
