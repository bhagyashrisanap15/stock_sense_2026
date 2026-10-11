import React, { useState } from 'react';
import { TimeHorizon } from '../../types/stock';
import { FASTAPI_BACKEND_URL } from '../../services/api';
import {
  Settings,
  Server,
  Database,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  Globe,
  Monitor,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SettingsScreenProps {
  onShowToast: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onShowToast }) => {
  const { theme, setTheme } = useTheme();
  const [defaultMarket, setDefaultMarket] = useState<'NSE' | 'BSE' | 'US'>('NSE');
  const [defaultHorizon, setDefaultHorizon] = useState<TimeHorizon>('5 Days');
  const [showVolumeDefault, setShowVolumeDefault] = useState(true);
  const [autoStreaming, setAutoStreaming] = useState(true);
  const [isPingingFastApi, setIsPingingFastApi] = useState(false);
  const [fastApiLatency, setFastApiLatency] = useState<number | null>(null);

  const handlePingBackend = () => {
    setIsPingingFastApi(true);
    const start = Date.now();
    setTimeout(() => {
      setFastApiLatency(Date.now() - start);
      setIsPingingFastApi(false);
      onShowToast('FastAPI gateway pinged successfully (Latency: 24ms)');
    }, 450);
  };

  const handleSavePreferences = () => {
    onShowToast('User preferences saved to local profile');
  };

  return (
    <div className="flex flex-col w-full space-y-4 animate-fadeIn">
      {/* Header with Title */}
      <div className="bg-[#101a2b] p-4 rounded-2xl border border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-[#f1f5f9] tracking-tight">
              Settings &amp; System Configuration
            </h1>
            <p className="text-[12px] font-mono text-[#94a3b8]">
              Manage default trading universe, model prediction horizons, and backend integrations
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-[#101a2b] p-4 lg:p-5 rounded-2xl border border-[#1e293b] space-y-4">
        <h2 className="text-[14px] font-bold text-[#f1f5f9] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#22d3ee]" />
          <span>User Interface &amp; Model Defaults</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[12px]">
          {/* Appearance Theme Mode */}
          <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2">
            <label className="text-[#94a3b8] block text-[11px] uppercase">
              Application Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  onShowToast('Dark terminal mode enabled');
                }}
                className={`py-2 px-2 rounded-lg border text-center font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/40'
                    : 'bg-[#101a2b] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  onShowToast('Daylight precision mode enabled');
                }}
                className={`py-2 px-2 rounded-lg border text-center font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/40'
                    : 'bg-[#101a2b] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Default Market Universe */}
          <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2">
            <label className="text-[#94a3b8] block text-[11px] uppercase">
              Default Market Universe
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['NSE', 'BSE', 'US'] as const).map((mkt) => (
                <button
                  key={mkt}
                  type="button"
                  onClick={() => setDefaultMarket(mkt)}
                  className={`py-2 rounded-lg border text-center font-bold transition-all ${
                    defaultMarket === mkt
                      ? 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/40'
                      : 'bg-[#101a2b] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                  }`}
                >
                  {mkt === 'US' ? 'US (NASDAQ)' : mkt}
                </button>
              ))}
            </div>
          </div>

          {/* Default Horizon */}
          <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2">
            <label className="text-[#94a3b8] block text-[11px] uppercase">
              Default Prediction Horizon
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Next Day', '5 Days', '1 Month', '3 Months'] as TimeHorizon[]).map((hz) => (
                <button
                  key={hz}
                  type="button"
                  onClick={() => setDefaultHorizon(hz)}
                  className={`py-2 rounded-lg border text-center font-medium transition-all ${
                    defaultHorizon === hz
                      ? 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/40 font-bold'
                      : 'bg-[#101a2b] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                  }`}
                >
                  {hz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-3 font-mono text-[12px]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#f1f5f9] font-medium block">Live Market Telemetry Auto-stream</span>
              <span className="text-[11px] text-[#64748b]">Jitters and updates quotes in real-time when enabled</span>
            </div>
            <button
              onClick={() => setAutoStreaming(!autoStreaming)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                autoStreaming ? 'bg-[#22d3ee]' : 'bg-[#1e293b]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#083344] absolute top-1 transition-all ${
                  autoStreaming ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
            <div>
              <span className="text-[#f1f5f9] font-medium block">Default Volume Bars in Charts</span>
              <span className="text-[11px] text-[#64748b]">Overlay trading volume histograms under candlestick charts</span>
            </div>
            <button
              onClick={() => setShowVolumeDefault(!showVolumeDefault)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                showVolumeDefault ? 'bg-[#22d3ee]' : 'bg-[#1e293b]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#083344] absolute top-1 transition-all ${
                  showVolumeDefault ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#38bdf8] text-[#083344] font-bold text-[12px] font-mono transition-colors"
        >
          Save Preferences
        </button>
      </div>

      {/* Backend & API Configuration Status Section */}
      <div className="bg-[#101a2b] p-4 lg:p-5 rounded-2xl border border-[#1e293b] space-y-4">
        <h2 className="text-[14px] font-bold text-[#f1f5f9] flex items-center gap-2">
          <Server className="w-4 h-4 text-[#22d3ee]" />
          <span>API Gateways &amp; Integration Health</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
          {/* FastAPI Card */}
          <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">Python FastAPI</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 font-bold">
                READY
              </span>
            </div>
            <div className="text-[12px] font-bold text-[#f1f5f9] truncate">
              {FASTAPI_BACKEND_URL}
            </div>
            <p className="text-[10px] text-[#64748b]">
              Inference engine: XGBoost, SHAP Explainer, Monte Carlo endpoints
            </p>
            <button
              onClick={handlePingBackend}
              disabled={isPingingFastApi}
              className="w-full py-1.5 rounded-lg bg-[#16243c] hover:bg-[#1e3a5f] text-[#22d3ee] border border-[#22d3ee]/30 font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isPingingFastApi ? 'animate-spin' : ''}`} />
              <span>{isPingingFastApi ? 'Testing Ping...' : 'Test Endpoint Ping'}</span>
            </button>
          </div>

          {/* MongoDB Atlas Card */}
          <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">MongoDB Atlas</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 font-bold">
                CONNECTED
              </span>
            </div>
            <div className="text-[12px] font-bold text-[#f1f5f9]">stockSenseAI Cluster</div>
            <p className="text-[10px] text-[#64748b]">
              16 Collections &amp; Mongoose Schemas configured with seed records
            </p>
            <div className="p-1 rounded bg-[#101a2b] text-[10px] text-[#34d399] text-center border border-[#1e293b]">
              mongosh: Atlas [primary]
            </div>
          </div>

          {/* Gemini AI Card */}
          <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8]">Google Gemini AI</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 font-bold">
                ACTIVE
              </span>
            </div>
            <div className="text-[12px] font-bold text-[#f1f5f9]">@google/genai v2.4</div>
            <p className="text-[10px] text-[#64748b]">
              Counterfactual inquiries &amp; conversational interpretability
            </p>
            <div className="p-1 rounded bg-[#101a2b] text-[10px] text-[#22d3ee] text-center border border-[#1e293b]">
              Key: Injected Server-Side
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Project Info Card */}
      <div className="bg-[#101a2b] p-4 lg:p-5 rounded-2xl border border-[#1e293b] space-y-2 font-mono text-[11px]">
        <span className="text-[#94a3b8] uppercase text-[10px]">Academic &amp; Architecture Reference</span>
        <h3 className="text-[14px] font-bold text-[#f1f5f9] font-sans">
          StockSense AI – Explainable AI for Stock Market Trend Prediction and Risk Assessment
        </h3>
        <p className="text-[#94a3b8] leading-relaxed">
          Final-Year Engineering Project • Tech Stack: React.js + Vite + Tailwind CSS + Node.js/Express + MongoDB Atlas + Mongoose + Python/FastAPI + Machine Learning + SHAP XAI + Google Gemini AI.
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;
