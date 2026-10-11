import React, { useState, useEffect } from 'react';
import { PriceAlert, WatchlistItem } from '../types/stock';
import {
  Bell,
  BellRing,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Check,
  Trash2,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: WatchlistItem | null;
  currentAlert?: PriceAlert;
  onSaveAlert: (alert: PriceAlert) => void;
  onDeleteAlert?: (symbol: string) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  stockItem,
  currentAlert,
  onSaveAlert,
  onDeleteAlert,
}) => {
  if (!isOpen || !stockItem) return null;

  // Helper to extract numeric price and currency
  const extractPriceAndCurrency = (priceStr: string) => {
    const isRupee = priceStr.includes('₹');
    const currency = isRupee ? '₹' : '$';
    const cleanNum = parseFloat(priceStr.replace(/[₹$,]/g, '').trim());
    return {
      price: isNaN(cleanNum) ? 100 : cleanNum,
      currency,
    };
  };

  const { price: currentNumericPrice, currency } = extractPriceAndCurrency(stockItem.price);

  const [upperThreshold, setUpperThreshold] = useState<string>('');
  const [lowerThreshold, setLowerThreshold] = useState<string>('');
  const [strategyTag, setStrategyTag] = useState<
    'Target Profit' | 'Stop Loss' | 'Breakout Alert' | 'Support Watch' | 'Custom'
  >('Target Profit');
  const [note, setNote] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(true);

  // Initialize form when opening with current alert
  useEffect(() => {
    if (currentAlert) {
      setUpperThreshold(currentAlert.upperThreshold ? currentAlert.upperThreshold.toString() : '');
      setLowerThreshold(currentAlert.lowerThreshold ? currentAlert.lowerThreshold.toString() : '');
      setStrategyTag(currentAlert.strategyTag || 'Target Profit');
      setNote(currentAlert.note || '');
      setEnabled(currentAlert.enabled !== false);
    } else {
      // Sensible default suggestions based on current price (+5% target, -5% stop)
      const defaultUpper = (currentNumericPrice * 1.05).toFixed(2);
      const defaultLower = (currentNumericPrice * 0.95).toFixed(2);
      setUpperThreshold(defaultUpper);
      setLowerThreshold(defaultLower);
      setStrategyTag('Target Profit');
      setNote('');
      setEnabled(true);
    }
  }, [currentAlert, currentNumericPrice, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const upperNum = parseFloat(upperThreshold);
  const lowerNum = parseFloat(lowerThreshold);

  const upperDeltaPct =
    !isNaN(upperNum) && currentNumericPrice > 0
      ? (((upperNum - currentNumericPrice) / currentNumericPrice) * 100).toFixed(2)
      : null;

  const lowerDeltaPct =
    !isNaN(lowerNum) && currentNumericPrice > 0
      ? (((lowerNum - currentNumericPrice) / currentNumericPrice) * 100).toFixed(2)
      : null;

  // Check if currently triggered
  const isUpperTriggered = !isNaN(upperNum) && upperNum > 0 && currentNumericPrice >= upperNum;
  const isLowerTriggered = !isNaN(lowerNum) && lowerNum > 0 && currentNumericPrice <= lowerNum;
  const isTriggered = enabled && (isUpperTriggered || isLowerTriggered);

  // Preset percentage buttons
  const applyPresetUpper = (pct: number) => {
    const calculated = currentNumericPrice * (1 + pct / 100);
    setUpperThreshold(calculated.toFixed(2));
  };

  const applyPresetLower = (pct: number) => {
    const calculated = currentNumericPrice * (1 - pct / 100);
    setLowerThreshold(calculated.toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let triggeredMessage = '';
    if (isUpperTriggered) {
      triggeredMessage = `Upper trigger reached: ${currency}${currentNumericPrice.toFixed(2)} ≥ ${currency}${upperNum.toFixed(2)}`;
    } else if (isLowerTriggered) {
      triggeredMessage = `Lower stop triggered: ${currency}${currentNumericPrice.toFixed(2)} ≤ ${currency}${lowerNum.toFixed(2)}`;
    }

    const newAlert: PriceAlert = {
      id: currentAlert?.id || `alert-${stockItem.symbol}-${Date.now()}`,
      symbol: stockItem.symbol,
      upperThreshold: !isNaN(upperNum) && upperNum > 0 ? upperNum : undefined,
      lowerThreshold: !isNaN(lowerNum) && lowerNum > 0 ? lowerNum : undefined,
      enabled,
      createdAt: currentAlert?.createdAt || new Date().toISOString(),
      strategyTag,
      note: note.trim() || undefined,
      currency,
      isTriggered,
      triggeredMessage: isTriggered ? triggeredMessage : undefined,
      triggeredAt: isTriggered ? new Date().toISOString() : undefined,
    };

    onSaveAlert(newAlert);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteAlert) {
      onDeleteAlert(stockItem.symbol);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-[#101a2b] border border-[#1e3a5f] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col space-y-0 text-[#f1f5f9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0c1422] border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold font-mono tracking-tight text-[#f1f5f9]">
                  {stockItem.symbol} Price Alert Triggers
                </h2>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#16243c] text-[#94a3b8] border border-[#1e293b]">
                  {stockItem.exchange}
                </span>
              </div>
              <p className="text-[12px] text-[#94a3b8] truncate max-w-[280px]">
                {stockItem.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#16243c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Price Banner */}
        <div className="px-5 py-3.5 bg-[#070d19] border-b border-[#1e293b] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#64748b] block">
              Current Market Price
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[20px] font-extrabold font-mono text-[#f1f5f9]">
                {stockItem.price}
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  stockItem.isPositive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {stockItem.change}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer bg-[#101a2b] px-3 py-1.5 rounded-xl border border-[#1e293b]">
              <span className="text-[11px] font-mono text-[#94a3b8]">Alert Active</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#22d3ee] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Trigger Warning Banner if already met */}
        {isTriggered && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[12px] font-mono">
              <span className="font-bold text-amber-300 block">Trigger Condition Currently Met!</span>
              <span className="text-amber-200/90 text-[11px]">
                {isUpperTriggered && `Current price is above upper target (${currency}${currentNumericPrice.toFixed(2)} ≥ ${currency}${upperNum.toFixed(2)})`}
                {isLowerTriggered && `Current price is below lower stop (${currency}${currentNumericPrice.toFixed(2)} ≤ ${currency}${lowerNum.toFixed(2)})`}
              </span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Upper Threshold (Take Profit / Target) */}
          <div className="space-y-1.5 bg-[#0b1320] p-3.5 rounded-xl border border-[#1e293b]">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Upper Target Trigger (Price ≥ Target)</span>
              </label>
              {upperDeltaPct && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    parseFloat(upperDeltaPct) >= 0
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  {parseFloat(upperDeltaPct) >= 0 ? `+${upperDeltaPct}%` : `${upperDeltaPct}%`} vs current
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-mono text-[#64748b]">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                value={upperThreshold}
                onChange={(e) => setUpperThreshold(e.target.value)}
                placeholder={`e.g. ${(currentNumericPrice * 1.05).toFixed(2)}`}
                className="w-full pl-8 pr-3 py-2 bg-[#070d19] border border-[#1e293b] focus:border-emerald-400 rounded-lg text-[13px] font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
              />
            </div>

            {/* Quick Presets for Target */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-[#64748b]">Quick Targets:</span>
              {[2, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyPresetUpper(pct)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#16243c] hover:bg-emerald-950/50 hover:text-emerald-300 text-[#94a3b8] border border-[#1e293b] transition-colors"
                >
                  +{pct}%
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#64748b] font-mono">
              Triggers when price crosses above resistance or reaches your profit goal.
            </p>
          </div>

          {/* Lower Threshold (Stop Loss / Support) */}
          <div className="space-y-1.5 bg-[#0b1320] p-3.5 rounded-xl border border-[#1e293b]">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-bold font-mono text-rose-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Lower Stop Trigger (Price ≤ Support / Stop-Loss)</span>
              </label>
              {lowerDeltaPct && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    parseFloat(lowerDeltaPct) <= 0
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  {parseFloat(lowerDeltaPct) <= 0 ? `${lowerDeltaPct}%` : `+${lowerDeltaPct}%`} vs current
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-mono text-[#64748b]">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                value={lowerThreshold}
                onChange={(e) => setLowerThreshold(e.target.value)}
                placeholder={`e.g. ${(currentNumericPrice * 0.95).toFixed(2)}`}
                className="w-full pl-8 pr-3 py-2 bg-[#070d19] border border-[#1e293b] focus:border-rose-400 rounded-lg text-[13px] font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
              />
            </div>

            {/* Quick Presets for Stop Loss */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-[#64748b]">Quick Stops:</span>
              {[2, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyPresetLower(pct)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#16243c] hover:bg-rose-950/50 hover:text-rose-300 text-[#94a3b8] border border-[#1e293b] transition-colors"
                >
                  -{pct}%
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#64748b] font-mono">
              Triggers when price falls below support to protect capital against severe drawdown.
            </p>
          </div>

          {/* Strategy Classification Tag */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-[#64748b] block">
              Strategy Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(
                [
                  'Target Profit',
                  'Stop Loss',
                  'Breakout Alert',
                  'Support Watch',
                  'Custom',
                ] as const
              ).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setStrategyTag(tag)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-colors text-center border ${
                    strategyTag === tag
                      ? 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/50 font-bold'
                      : 'bg-[#070d19] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-[#64748b] block">
              Custom Trigger Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Sell 50% on breakout or recheck FinBERT sentiment..."
              className="w-full px-3 py-2 bg-[#070d19] border border-[#1e293b] focus:border-[#22d3ee] rounded-lg text-[12px] font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
            />
          </div>

          {/* Range Visualizer */}
          {!isNaN(upperNum) && !isNaN(lowerNum) && upperNum > lowerNum && (
            <div className="p-3 rounded-xl bg-[#070d19] border border-[#1e293b] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b] block">
                Visual Threshold Channel
              </span>
              <div className="relative pt-4 pb-2">
                <div className="h-1.5 bg-gradient-to-r from-rose-500 via-slate-600 to-emerald-500 rounded-full" />
                <div className="flex justify-between text-[10px] font-mono text-[#94a3b8] mt-1.5">
                  <span className="text-rose-400 font-bold">
                    Stop: {currency}{lowerNum.toFixed(2)}
                  </span>
                  <span className="text-[#22d3ee] font-bold">
                    Current: {stockItem.price}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Target: {currency}{upperNum.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between gap-2">
            {currentAlert && onDeleteAlert ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-[12px] font-mono flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Alert</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#16243c] hover:bg-[#1e3a5f] text-[#94a3b8] hover:text-[#f1f5f9] text-[12px] font-mono transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#22d3ee] hover:bg-[#38bdf8] text-[#083344] font-bold text-[12px] font-mono flex items-center gap-1.5 transition-colors shadow-lg shadow-[#22d3ee]/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Alert Triggers</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal;
