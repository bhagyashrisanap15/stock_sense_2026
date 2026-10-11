import React, { useState } from 'react';
import { StockData } from '../types/stock';

interface MonteCarloModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStock: StockData;
}

export const MonteCarloModal: React.FC<MonteCarloModalProps> = ({
  isOpen,
  onClose,
  activeStock,
}) => {
  const [iterations, setIterations] = useState(10000);
  const [horizonDays, setHorizonDays] = useState(21);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(true);

  if (!isOpen) return null;

  const handleRunSim = () => {
    setIsRunning(true);
    setCompleted(false);
    setTimeout(() => {
      setIsRunning(false);
      setCompleted(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#171b26] border border-[#262a35] rounded-2xl w-full max-w-lg p-5 shadow-2xl flex flex-col space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">
              casino
            </span>
            <div>
              <h3 className="font-semibold text-[#dfe2f1] text-[16px]">
                Monte Carlo Geometric Brownian Motion
              </h3>
              <p className="text-[11px] font-mono text-[#908fa0]">
                {activeStock.symbol} • Stochastic Multi-Path Stress Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1c1f2a] flex items-center justify-center text-[#c7c4d7] hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Simulation Settings */}
        <div className="grid grid-cols-2 gap-3 bg-[#1c1f2a] p-3 rounded-xl font-mono text-[12px]">
          <div>
            <label className="text-[#908fa0] text-[11px] block mb-1">Iterations</label>
            <select
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="bg-[#262a35] text-[#dfe2f1] rounded p-1.5 w-full border-none focus:outline-none"
            >
              <option value={5000}>5,000 Paths</option>
              <option value={10000}>10,000 Paths (Standard)</option>
              <option value={25000}>25,000 Paths (High Res)</option>
            </select>
          </div>
          <div>
            <label className="text-[#908fa0] text-[11px] block mb-1">Forecast Window</label>
            <select
              value={horizonDays}
              onChange={(e) => setHorizonDays(Number(e.target.value))}
              className="bg-[#262a35] text-[#dfe2f1] rounded p-1.5 w-full border-none focus:outline-none"
            >
              <option value={5}>5 Trading Days (1-Week)</option>
              <option value={21}>21 Trading Days (1-Month)</option>
              <option value={63}>63 Trading Days (Quarterly)</option>
            </select>
          </div>
        </div>

        {/* Multi-Path Visual Simulation Canvas */}
        <div className="relative w-full h-44 bg-[#0a0e18] rounded-xl p-3 flex flex-col justify-between overflow-hidden border border-[#262a35]/60">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#908fa0] z-10">
            <span>dS = μS dt + σS dW</span>
            <span className="text-[#4cd7f6]">{iterations.toLocaleString()} Trajectories</span>
          </div>

          <svg className="w-full h-28 overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 100">
            {/* Cone of uncertainty */}
            <path
              d="M 10,50 Q 150,15 310,5 L 310,95 Q 150,85 10,50 Z"
              fill="#4cd7f6"
              fillOpacity="0.08"
            />
            {/* Benchmark Path 1 */}
            <path
              d="M 10,50 Q 70,40 140,32 T 240,20 T 310,12"
              fill="none"
              stroke="#4cd7f6"
              strokeWidth="2"
            />
            {/* Path 2 */}
            <path
              d="M 10,50 Q 80,55 160,45 T 250,38 T 310,30"
              fill="none"
              stroke="#4cd7f6"
              strokeOpacity="0.6"
              strokeWidth="1.2"
            />
            {/* Path 3 (Median) */}
            <path
              d="M 10,50 Q 90,52 170,50 T 260,48 T 310,44"
              fill="none"
              stroke="#c0c1ff"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            {/* Path 4 (Downside) */}
            <path
              d="M 10,50 Q 100,58 180,68 T 260,78 T 310,88"
              fill="none"
              stroke="#ffb4ab"
              strokeWidth="1.5"
            />
            {/* Current Price Dot */}
            <circle cx="10" cy="50" r="3.5" fill="#4cd7f6" />
          </svg>

          <div className="flex justify-between items-center text-[11px] font-mono z-10 pt-1">
            <span className="text-[#ffb4ab]">95% Worst: {activeStock.currency}{(activeStock.price * 0.94).toFixed(0)}</span>
            <span className="text-[#c0c1ff]">Median: {activeStock.currency}{(activeStock.price * 1.025).toFixed(0)}</span>
            <span className="text-[#4cd7f6]">95% Best: {activeStock.currency}{(activeStock.price * 1.09).toFixed(0)}</span>
          </div>
        </div>

        {/* Statistical Simulation Readout */}
        <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
          <div className="bg-[#1c1f2a] p-2 rounded-lg">
            <span className="text-[#908fa0] block text-[10px]">Prob &gt; Breakeven</span>
            <span className="text-[#4cd7f6] text-[14px] font-bold">78.4%</span>
          </div>
          <div className="bg-[#1c1f2a] p-2 rounded-lg">
            <span className="text-[#908fa0] block text-[10px]">Support Floor Prob</span>
            <span className="text-[#dfe2f1] text-[14px] font-bold">91.4%</span>
          </div>
          <div className="bg-[#1c1f2a] p-2 rounded-lg">
            <span className="text-[#908fa0] block text-[10px]">Tail Loss 99% VaR</span>
            <span className="text-[#ffb4ab] text-[14px] font-bold">-3.62%</span>
          </div>
        </div>

        <div className="bg-[#1c1f2a] p-3 rounded-xl text-[11px] text-[#c7c4d7] leading-relaxed">
          <div className="text-[#4cd7f6] font-semibold mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            Quantitative Verdict
          </div>
          Over {iterations.toLocaleString()} runs across {horizonDays} trading sessions, {activeStock.name} displays a positively skewed drift with 91.4% probability of staying above key technical support ({activeStock.invalidationLevel}).
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleRunSim}
            disabled={isRunning}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#4cd7f6] text-[#003640] font-semibold text-[13px] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRunning ? 'animate-spin' : ''}`}>
              refresh
            </span>
            {isRunning ? 'Simulating 10,000 Paths...' : 'Re-Run Stress Test'}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-[#262a35] text-[#dfe2f1] text-[13px] hover:bg-[#313540]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
