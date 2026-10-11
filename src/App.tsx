/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SidebarNavigation } from './components/SidebarNavigation';
import { Navigation } from './components/Navigation';
import { NotificationsModal } from './components/NotificationsModal';
import { MonteCarloModal } from './components/MonteCarloModal';
import { ExportDossierModal } from './components/ExportDossierModal';

// Dedicated Screen Views
import { DashboardScreen } from './components/screens/DashboardScreen';
import { PredictionsScreen } from './components/screens/PredictionsScreen';
import { RiskMatrixScreen } from './components/screens/RiskMatrixScreen';
import { ExplainXaiScreen } from './components/screens/ExplainXaiScreen';
import { WatchlistScreen } from './components/screens/WatchlistScreen';
import { NewsSentimentScreen } from './components/screens/NewsSentimentScreen';
import { PortfolioScreen } from './components/screens/PortfolioScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { TerminalHubScreen } from './components/screens/TerminalHubScreen';

import { ALL_STOCKS } from './data/stocksData';
import { TabType } from './types/stock';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('TCS');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMonteCarloOpen, setIsMonteCarloOpen] = useState(false);
  const [isExportDossierOpen, setIsExportDossierOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['TCS', 'AAPL', 'NVDA', 'INFY']);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const activeStock = ALL_STOCKS[selectedSymbol] || ALL_STOCKS['TCS'];
  const allSymbols = Object.keys(ALL_STOCKS);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectStock = (symbol: string) => {
    const sym = symbol.toUpperCase();
    if (ALL_STOCKS[sym]) {
      setSelectedSymbol(sym);
      showToast(`Active ticker switched to ${sym} • ${ALL_STOCKS[sym].exchange}`);
    } else {
      setSelectedSymbol(sym);
    }
  };

  const handleSelectStockAndTab = (
    symbol: string,
    tab: 'dashboard' | 'predictions' | 'risk-matrix' | 'xai-explainability' | 'watchlist' | 'news-sentiment' | 'portfolio' | 'settings'
  ) => {
    handleSelectStock(symbol);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWatchlist = (symbol: string) => {
    if (watchlistSymbols.includes(symbol)) {
      setWatchlistSymbols((prev) => prev.filter((s) => s !== symbol));
      showToast(`Removed ${symbol} from Watchlist`);
    } else {
      setWatchlistSymbols((prev) => [...prev, symbol]);
      showToast(`Added ${symbol} to Watchlist`);
    }
  };

  const handleRecalculateInference = () => {
    showToast(`Model recalculated with latest order flow & TreeSHAP weights`);
  };

  return (
    <div className="bg-[#070d19] text-[#f1f5f9] font-sans min-h-screen antialiased flex flex-row selection:bg-[#22d3ee]/30">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#16243c] border border-[#22d3ee]/50 text-[#f1f5f9] font-mono text-[12px] px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Collapsible Sidebar Navigation */}
      <SidebarNavigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeStock={activeStock}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Header */}
        <Header
          currentTab={currentTab}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onSelectStock={handleSelectStock}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          isLive={isLiveStreaming}
          onToggleLive={() => {
            setIsLiveStreaming(!isLiveStreaming);
            showToast(isLiveStreaming ? 'Live telemetry paused' : 'Live telemetry streaming active');
          }}
          activeStock={activeStock}
        />

        {/* Main Content Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-5 pb-24 md:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardScreen
              stock={activeStock}
              allSymbols={allSymbols}
              onSelectStock={handleSelectStock}
              onNavigateToTab={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={watchlistSymbols.includes(activeStock.symbol)}
              isLive={isLiveStreaming}
            />
          )}

          {currentTab === 'predictions' && (
            <PredictionsScreen
              stock={activeStock}
              onSelectStock={handleSelectStock}
              onRecalculate={handleRecalculateInference}
            />
          )}

          {currentTab === 'risk-matrix' && (
            <RiskMatrixScreen
              stock={activeStock}
              onOpenMonteCarlo={() => setIsMonteCarloOpen(true)}
            />
          )}

          {currentTab === 'xai-explainability' && (
            <ExplainXaiScreen stock={activeStock} />
          )}

          {currentTab === 'watchlist' && (
            <WatchlistScreen
              onSelectStockAndTab={handleSelectStockAndTab}
              onSelectStock={handleSelectStock}
              activeStockSymbol={activeStock.symbol}
            />
          )}

          {currentTab === 'news-sentiment' && (
            <NewsSentimentScreen
              stock={activeStock}
              allSymbols={allSymbols}
              onSelectStock={handleSelectStock}
              onNavigateToXai={() => {
                setCurrentTab('xai-explainability');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'portfolio' && (
            <PortfolioScreen
              onSelectStockAndTab={handleSelectStockAndTab}
              onOpenExportDossier={() => setIsExportDossierOpen(true)}
              onOpenMonteCarlo={() => setIsMonteCarloOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen onShowToast={showToast} />
          )}

          {currentTab === 'terminal-hub' && (
            <TerminalHubScreen
              onSelectStockAndTab={handleSelectStockAndTab}
              onOpenMonteCarlo={() => setIsMonteCarloOpen(true)}
              onOpenExportDossier={() => setIsExportDossierOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Responsive Drawer Sheet */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobileDrawer={isMobileNavOpen}
        onCloseMobileDrawer={() => setIsMobileNavOpen(false)}
      />

      {/* Interactive Modals */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectStock={handleSelectStock}
      />

      <MonteCarloModal
        isOpen={isMonteCarloOpen}
        onClose={() => setIsMonteCarloOpen(false)}
        activeStock={activeStock}
      />

      <ExportDossierModal
        isOpen={isExportDossierOpen}
        onClose={() => setIsExportDossierOpen(false)}
        activeStock={activeStock}
      />
    </div>
  );
}
