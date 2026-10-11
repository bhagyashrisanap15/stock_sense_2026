import React, { useState, useEffect, useMemo } from 'react';
import { ALL_STOCKS } from '../data/stocksData';
import { useAlerts } from '../context/AlertContext';
import {
  Bell,
  X,
  TrendingUp,
  TrendingDown,
  Percent,
  Check,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SetPriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSymbol?: string;
  onAlertCreated?: (msg: string) => void;
}

export const SetPriceAlertModal: React.FC<SetPriceAlertModalProps> = ({
  isOpen,
  onClose,
  defaultSymbol = 'TCS',
  onAlertCreated,
}) => {
  const { createAlert, simulateBreach } = useAlerts();

  const stockList = useMemo(() => Object.values(ALL_STOCKS), []);
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [condition, setCondition] = useState<'GREATER_THAN' | 'LESS_THAN'>('GREATER_THAN');
  const [targetPriceStr, setTargetPriceStr] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentStock = ALL_STOCKS[selectedSymbol] || stockList[0];

  // Whenever defaultSymbol or modal opens, update defaults
  useEffect(() => {
    if (isOpen) {
      const sym = defaultSymbol.toUpperCase();
      const stock = ALL_STOCKS[sym] || stockList[0];
      setSelectedSymbol(stock.symbol);

      // Default target price to +2% if GREATER_THAN, -2% if LESS_THAN
      const multiplier = condition === 'GREATER_THAN' ? 1.025 : 0.975;
      setTargetPriceStr((stock.price * multiplier).toFixed(2));
      setError(null);
    }
  }, [isOpen, defaultSymbol]);

  if (!isOpen) return null;

  const currentPrice = currentStock.price;
  const targetPriceNum = parseFloat(targetPriceStr);
  const isValidTarget = !isNaN(targetPriceNum) && targetPriceNum > 0;

  // Calculate percentage distance
  const deltaPercent = isValidTarget
    ? (((targetPriceNum - currentPrice) / currentPrice) * 100).toFixed(2)
    : null;

  const handleQuickPercent = (pct: number) => {
    const newPrice = Number((currentPrice * (1 + pct / 100)).toFixed(2));
    setTargetPriceStr(newPrice.toString());
    if (pct > 0) {
      setCondition('GREATER_THAN');
    } else if (pct < 0) {
      setCondition('LESS_THAN');
    }
    setError(null);
  };

  const handleSave = (autoSimulateBreach = false) => {
    if (!isValidTarget) {
      setError('Please enter a valid numeric target price greater than 0.');
      return;
    }

    if (condition === 'GREATER_THAN' && targetPriceNum <= currentPrice) {
      setError(`For a 'Rises Above' alert, target price must be higher than current price (${currentStock.currency}${currentPrice}).`);
      return;
    }

    if (condition === 'LESS_THAN' && targetPriceNum >= currentPrice) {
      setError(`For a 'Drops Below' alert, target price must be lower than current price (${currentStock.currency}${currentPrice}).`);
      return;
    }

    const created = createAlert({
      symbol: currentStock.symbol,
      condition,
      targetPrice: targetPriceNum,
      note: note.trim() || undefined,
    });

    if (autoSimulateBreach) {
      // Simulate immediate breach trigger
      setTimeout(() => {
        simulateBreach(created.id);
      }, 400);
      if (onAlertCreated) {
        onAlertCreated(`Alert set for ${created.symbol} & simulated breach trigger activated!`);
      }
    } else {
      if (onAlertCreated) {
        onAlertCreated(`Price alert set for ${created.symbol} at ${created.currency}${created.targetPrice.toLocaleString()}`);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101a2b] border border-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#f1f5f9] text-[16px] tracking-tight">
                Configure Price Alert
              </h3>
              <p className="text-[11px] font-mono text-[#94a3b8]">
                Real-time trigger notification when asset breaches target
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#070d19] hover:bg-[#16243c] flex items-center justify-center text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 pt-1 space-y-4 font-mono text-[12px]">
          {/* Select Stock Asset */}
          <div className="space-y-1.5">
            <label className="text-[#94a3b8] text-[11px] uppercase block font-semibold">
              Target Asset
            </label>
            <div className="flex items-center gap-2 bg-[#070d19] p-2 rounded-xl border border-[#1e293b]">
              <select
                value={selectedSymbol}
                onChange={(e) => {
                  const sym = e.target.value;
                  setSelectedSymbol(sym);
                  const st = ALL_STOCKS[sym];
                  if (st) {
                    const mult = condition === 'GREATER_THAN' ? 1.025 : 0.975;
                    setTargetPriceStr((st.price * mult).toFixed(2));
                  }
                }}
                className="bg-transparent text-[#f1f5f9] font-bold text-[13px] flex-1 focus:outline-none cursor-pointer"
              >
                {stockList.map((s) => (
                  <option key={s.symbol} value={s.symbol} className="bg-[#101a2b] text-[#f1f5f9]">
                    {s.symbol} — {s.name} ({s.exchange})
                  </option>
                ))}
              </select>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-[#64748b] block">Current Price</span>
                <span className="text-[13px] font-bold text-[#22d3ee]">
                  {currentStock.currency}{currentStock.priceFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Alert Condition: Greater Than vs Less Than */}
          <div className="space-y-1.5">
            <label className="text-[#94a3b8] text-[11px] uppercase block font-semibold">
              Trigger Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCondition('GREATER_THAN');
                  if (isValidTarget && targetPriceNum <= currentPrice) {
                    setTargetPriceStr((currentPrice * 1.025).toFixed(2));
                  }
                  setError(null);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  condition === 'GREATER_THAN'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold shadow-sm'
                    : 'bg-[#070d19] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[12px]">Rises Above (▲)</div>
                  <div className="text-[10px] text-[#94a3b8] font-normal">Resistance / Breakout</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCondition('LESS_THAN');
                  if (isValidTarget && targetPriceNum >= currentPrice) {
                    setTargetPriceStr((currentPrice * 0.975).toFixed(2));
                  }
                  setError(null);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  condition === 'LESS_THAN'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 font-bold shadow-sm'
                    : 'bg-[#070d19] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                }`}
              >
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <div className="text-left">
                  <div className="text-[12px]">Drops Below (▼)</div>
                  <div className="text-[10px] text-[#94a3b8] font-normal">Support / Stop-Loss</div>
                </div>
              </button>
            </div>
          </div>

          {/* Target Price Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[#94a3b8] text-[11px] uppercase font-semibold">
                Target Threshold ({currentStock.currency})
              </label>
              {deltaPercent && (
                <span
                  className={`text-[11px] font-bold ${
                    parseFloat(deltaPercent) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {parseFloat(deltaPercent) >= 0 ? '+' : ''}
                  {deltaPercent}% from current
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold text-[14px]">
                {currentStock.currency}
              </span>
              <input
                type="number"
                step="any"
                value={targetPriceStr}
                onChange={(e) => {
                  setTargetPriceStr(e.target.value);
                  setError(null);
                }}
                placeholder="Enter target price..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#070d19] border border-[#1e293b] focus:border-[#22d3ee] rounded-xl text-[14px] font-bold text-[#f1f5f9] focus:outline-none"
              />
            </div>

            {/* Quick Percentage Chips */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-[#64748b] mr-1 uppercase">Quick:</span>
              {[1, 2, 5, 10].map((pct) => (
                <button
                  key={`pos-${pct}`}
                  type="button"
                  onClick={() => handleQuickPercent(pct)}
                  className="px-2 py-1 rounded-lg bg-[#070d19] hover:bg-[#16243c] text-emerald-400 border border-[#1e293b] text-[10px] font-bold transition-colors cursor-pointer"
                >
                  +{pct}%
                </button>
              ))}
              {[-1, -2, -5, -10].map((pct) => (
                <button
                  key={`neg-${pct}`}
                  type="button"
                  onClick={() => handleQuickPercent(pct)}
                  className="px-2 py-1 rounded-lg bg-[#070d19] hover:bg-[#16243c] text-rose-400 border border-[#1e293b] text-[10px] font-bold transition-colors cursor-pointer"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note / Annotation */}
          <div className="space-y-1.5">
            <label className="text-[#94a3b8] text-[11px] uppercase block font-semibold">
              Reason / Trading Strategy Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Breakout retest of 50-day SMA, Take profit target"
              className="w-full px-3 py-2 bg-[#070d19] border border-[#1e293b] focus:border-[#22d3ee] rounded-xl text-[12px] text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Informational Guidance Box */}
          <div className="bg-[#070d19] p-3 rounded-xl border border-[#1e293b] text-[11px] text-[#94a3b8] space-y-1">
            <div className="flex items-center gap-1.5 text-[#22d3ee] font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Institutional Telemetry Trigger</span>
            </div>
            <p className="leading-relaxed">
              When market order flow breaches {currentStock.currency}{isValidTarget ? targetPriceNum.toLocaleString() : '---'}, a system notification is pushed to your Bell tray with audit logs.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 font-mono text-[12px]">
          {/* Test & Simulate Breach button */}
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-3.5 py-2 rounded-xl bg-[#16243c] hover:bg-[#1e3a5f] text-[#22d3ee] border border-[#22d3ee]/30 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Create alert and immediately simulate price breach trigger for demonstration"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>Save &amp; Simulate Breach</span>
          </button>

          <div className="flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#070d19] hover:bg-[#16243c] text-[#94a3b8] border border-[#1e293b] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#38bdf8] text-[#083344] font-bold transition-colors cursor-pointer shadow-sm"
            >
              Set Price Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPriceAlertModal;
