import React from 'react';

interface StockSenseLogoProps {
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const StockSenseLogo: React.FC<StockSenseLogoProps> = ({
  collapsed = false,
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Brand Icon SVG */}
      <div
        className={`${iconSizeClasses[size]} relative rounded-lg bg-gradient-to-br from-[#101a2b] via-[#16243c] to-[#0a1120] p-1.5 flex items-center justify-center border border-[#22d3ee]/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] shrink-0`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle grid background */}
          <path
            d="M4 16H28M16 4V28"
            stroke="#1e3a5f"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          {/* Candlestick shadow stem */}
          <path
            d="M10 7V25M22 9V23"
            stroke="#22d3ee"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          {/* Primary Trend Wave / Candlestick Core */}
          <path
            d="M6 22L12 16L18 19L26 8"
            stroke="#22d3ee"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Glowing Neural Vertex Nodes */}
          <circle cx="6" cy="22" r="2" fill="#10b981" />
          <circle cx="12" cy="16" r="2" fill="#22d3ee" />
          <circle cx="18" cy="19" r="2" fill="#38bdf8" />
          <circle cx="26" cy="8" r="2.5" fill="#22d3ee" />
          <circle cx="26" cy="8" r="4.5" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.6" />
        </svg>
      </div>

      {/* Brand Typography (Hidden if collapsed) */}
      {!collapsed && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[17px] tracking-tight text-[#f1f5f9] leading-tight">
              StockSense<span className="text-[#22d3ee] ml-0.5">AI</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#16243c] text-[#22d3ee] border border-[#22d3ee]/30 tracking-wider">
              XAI v2.4
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] font-mono text-[#94a3b8] tracking-wider uppercase font-medium">
              Explainable Quant Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSenseLogo;
