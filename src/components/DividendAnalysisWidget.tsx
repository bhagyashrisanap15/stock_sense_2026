import React, { useState, useMemo } from 'react';
import { PortfolioHolding, HoldingDividendData, PortfolioDividendSummary } from '../types/stock';
import { PORTFOLIO_DIVIDEND_DETAILS } from '../data/stocksData';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Percent,
  Layers,
  Sparkles,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Clock,
  PieChart,
  Repeat,
  Sliders,
  Award,
} from 'lucide-react';

interface DividendAnalysisWidgetProps {
  holdings: PortfolioHolding[];
  onSelectStockAndTab?: (symbol: string, tab: 'dashboard' | 'predictions' | 'risk-matrix' | 'xai-explainability') => void;
}

type ChartViewMode = 'comparison' | 'monthly' | 'annual-income';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DividendAnalysisWidget: React.FC<DividendAnalysisWidgetProps> = ({
  holdings,
  onSelectStockAndTab,
}) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('comparison');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [enableDripSimulation, setEnableDripSimulation] = useState(true);
  const [dripYears, setDripYears] = useState<1 | 3 | 5>(3);

  // Compute comprehensive dividend data for current holdings
  const dividendSummary = useMemo<PortfolioDividendSummary>(() => {
    let totalPortfolioVal = 0;
    let totalAnnualDivIncome = 0;
    let weightedYieldSum = 0;
    let weightedPayoutSum = 0;

    const monthlyBuckets = MONTH_NAMES.map((name, idx) => ({
      month: name,
      monthIndex: idx,
      amount: 0,
      contributors: [] as { symbol: string; amount: number; dps: number }[],
    }));

    const enrichedHoldings: HoldingDividendData[] = holdings.map((h) => {
      const details = PORTFOLIO_DIVIDEND_DETAILS[h.symbol] || {
        dividendYield: 1.2,
        dps: (h.curPrice * 0.012),
        payoutRatio: 30.0,
        growth3Y: 10.0,
        fcfCoverage: 2.0,
        frequency: 'Annual' as const,
        nextExDate: 'Nov 15, 2026',
        nextPayoutPerShare: (h.curPrice * 0.012),
        safetyScore: 85,
        safetyRating: 'Safe' as const,
        payoutSchedule: [{ monthIndex: 6, dpsPortion: h.curPrice * 0.012 }],
      };

      const annualIncome = h.qty * details.dps;
      const monthlyRunRate = annualIncome / 12;

      // Calculate 12 monthly cashflows
      const monthlyCashflows = new Array(12).fill(0);
      details.payoutSchedule.forEach((sched) => {
        const payoutVal = h.qty * sched.dpsPortion;
        monthlyCashflows[sched.monthIndex] += payoutVal;

        // aggregate into bucket
        monthlyBuckets[sched.monthIndex].amount += payoutVal;
        monthlyBuckets[sched.monthIndex].contributors.push({
          symbol: h.symbol,
          amount: payoutVal,
          dps: sched.dpsPortion,
        });
      });

      totalPortfolioVal += h.curValue;
      totalAnnualDivIncome += annualIncome;
      weightedYieldSum += details.dividendYield * h.curValue;
      weightedPayoutSum += details.payoutRatio * h.curValue;

      return {
        symbol: h.symbol,
        name: h.name,
        exchange: h.exchange,
        qty: h.qty,
        curPrice: h.curPrice,
        curValue: h.curValue,
        dividendYield: details.dividendYield,
        dps: details.dps,
        payoutRatio: details.payoutRatio,
        growth3Y: details.growth3Y,
        fcfCoverage: details.fcfCoverage,
        frequency: details.frequency,
        nextExDate: details.nextExDate,
        nextPayoutPerShare: details.nextPayoutPerShare,
        safetyScore: details.safetyScore,
        safetyRating: details.safetyRating,
        annualIncome,
        monthlyRunRate,
        monthlyCashflows,
      };
    });

    const weightedYield = totalPortfolioVal > 0 ? weightedYieldSum / totalPortfolioVal : 0;
    const weightedPayout = totalPortfolioVal > 0 ? weightedPayoutSum / totalPortfolioVal : 0;

    return {
      totalAnnualIncome: totalAnnualDivIncome,
      weightedYield,
      weightedPayoutRatio: weightedPayout,
      monthlyAverageIncome: totalAnnualDivIncome / 12,
      portfolioValue: totalPortfolioVal,
      safetyScore: 92,
      benchmarkYield: 1.22, // NIFTY 50 Benchmark yield
      benchmarkPayoutRatio: 36.5,
      holdings: enrichedHoldings,
      monthlyAggregates: monthlyBuckets,
    };
  }, [holdings]);

  // DRIP (Dividend Reinvestment Plan) compounding projection
  const dripProjections = useMemo(() => {
    const annualDiv = dividendSummary.totalAnnualIncome;
    const expectedCagr = 0.12; // 12% equity growth assumption
    
    // Projections for 1, 3, 5 years with reinvestment
    let balance = annualDiv;
    const yearsData: Record<number, { reinvestedTotal: number; cashOnlyTotal: number; extraGain: number }> = {};

    [1, 2, 3, 4, 5].forEach((yr) => {
      const cashOnly = annualDiv * yr;
      // Future value of annuity: annualDiv * [((1 + r)^n - 1) / r]
      const reinvested = annualDiv * ((Math.pow(1 + expectedCagr, yr) - 1) / expectedCagr);
      yearsData[yr] = {
        reinvestedTotal: Math.round(reinvested),
        cashOnlyTotal: Math.round(cashOnly),
        extraGain: Math.round(reinvested - cashOnly),
      };
    });

    return yearsData;
  }, [dividendSummary]);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 35, right: 35, bottom: 45, left: 55 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Active highlighted holding
  const activeHolding = useMemo(() => {
    if (!selectedSymbol) return null;
    return dividendSummary.holdings.find((h) => h.symbol === selectedSymbol) || null;
  }, [selectedSymbol, dividendSummary]);

  return (
    <div className="bg-[#101a2b] rounded-2xl border border-[#1e293b] p-4 lg:p-5 space-y-5 shadow-lg relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#22d3ee]/5 blur-3xl pointer-events-none" />

      {/* Widget Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e293b]/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
              <DollarSign className="w-4 h-4" />
            </div>
            <h2 className="text-[17px] font-bold text-[#f1f5f9] tracking-tight">
              Dividend Analysis &amp; Passive Cash Flow
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 font-bold uppercase tracking-wider">
              {dividendSummary.safetyScore}/100 Safe
            </span>
          </div>
          <p className="text-[12px] font-mono text-[#94a3b8] mt-1">
            Annual yield distribution, payout sustainability matrix, and monthly dividend income stream
          </p>
        </div>

        {/* Chart View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#070d19] border border-[#1e293b] self-start sm:self-auto font-mono text-[11px]">
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'comparison'
                ? 'bg-[#16243c] text-[#22d3ee] font-bold shadow-sm'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Yield vs Payout
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-[#16243c] text-[#22d3ee] font-bold shadow-sm'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            12-Mo Passive Cashflow
          </button>
          <button
            onClick={() => setViewMode('annual-income')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'annual-income'
                ? 'bg-[#16243c] text-[#22d3ee] font-bold shadow-sm'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Income by Asset
          </button>
        </div>
      </div>

      {/* 4 Quantitative Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Annual Dividend Income */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] relative group hover:border-[#22d3ee]/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] text-[11px] font-mono uppercase">
            <span>Annual Dividend Income</span>
            <DollarSign className="w-3.5 h-3.5 text-[#22d3ee]" />
          </div>
          <div className="font-mono text-[22px] font-bold text-[#f1f5f9] mt-1.5">
            ₹{dividendSummary.totalAnnualIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono">
            <span className="text-[#34d399] font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +13.6%
            </span>
            <span className="text-[#64748b]">3Y div growth CAGR</span>
          </div>
        </div>

        {/* Weighted Portfolio Yield */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] relative group hover:border-[#22d3ee]/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] text-[11px] font-mono uppercase">
            <span>Portfolio Div Yield</span>
            <Percent className="w-3.5 h-3.5 text-[#38bdf8]" />
          </div>
          <div className="flex items-baseline gap-2 font-mono mt-1.5">
            <span className="text-[22px] font-bold text-[#22d3ee]">
              {dividendSummary.weightedYield.toFixed(2)}%
            </span>
            <span className="text-[11px] text-[#34d399] px-1.5 py-0.2 rounded bg-[#10b981]/15 font-semibold">
              +{((dividendSummary.weightedYield - dividendSummary.benchmarkYield) * 100).toFixed(0)} bps vs NIFTY
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#64748b] mt-1">
            NIFTY 50 Benchmark: {dividendSummary.benchmarkYield}%
          </div>
        </div>

        {/* Weighted Payout Ratio */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] relative group hover:border-[#22d3ee]/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] text-[11px] font-mono uppercase">
            <span>Avg Payout Ratio</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#a78bfa]" />
          </div>
          <div className="flex items-baseline gap-2 font-mono mt-1.5">
            <span className="text-[22px] font-bold text-[#a78bfa]">
              {dividendSummary.weightedPayoutRatio.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#34d399] px-1.5 py-0.2 rounded bg-[#10b981]/15 font-semibold uppercase">
              Very Safe
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#64748b] mt-1">
            Healthy capital retention &amp; FCF cover
          </div>
        </div>

        {/* Estimated Monthly Passive Income */}
        <div className="bg-[#070d19] p-3.5 rounded-xl border border-[#1e293b] relative group hover:border-[#22d3ee]/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] text-[11px] font-mono uppercase">
            <span>Monthly Run-Rate</span>
            <Calendar className="w-3.5 h-3.5 text-[#f59e0b]" />
          </div>
          <div className="font-mono text-[22px] font-bold text-[#34d399] mt-1.5">
            ₹{dividendSummary.monthlyAverageIncome.toFixed(2)}
            <span className="text-[12px] text-[#94a3b8] font-normal">/mo</span>
          </div>
          <div className="text-[10px] font-mono text-[#64748b] mt-1">
            Projected recurring passive cash flow
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="bg-[#070d19] p-4 rounded-xl border border-[#1e293b] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] font-mono">
          <div>
            <span className="font-bold text-[#f1f5f9]">
              {viewMode === 'comparison' && 'Annual Dividend Yield (%) vs Payout Ratio (%) by Asset'}
              {viewMode === 'monthly' && '12-Month Projected Passive Income Stream (Jan - Dec)'}
              {viewMode === 'annual-income' && 'Annual Passive Dividend Cashflow Contribution (₹)'}
            </span>
            <span className="text-[#64748b] text-[11px] block sm:inline sm:ml-2">
              {viewMode === 'comparison' && 'Hover on bars for detailed coverage and FCF metrics'}
              {viewMode === 'monthly' && 'Dashed line indicates ₹551.33 monthly run-rate average'}
              {viewMode === 'annual-income' && 'Distribution share generated by each core holding'}
            </span>
          </div>

          {/* Interactive Legend based on current viewMode */}
          <div className="flex items-center gap-3 text-[11px]">
            {viewMode === 'comparison' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-2.5 rounded-sm bg-[#22d3ee]" />
                  <span className="text-[#94a3b8]">Div Yield (%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-2.5 rounded-sm bg-[#a78bfa]" />
                  <span className="text-[#94a3b8]">Payout Ratio (%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t border-dashed border-[#f59e0b]" />
                  <span className="text-[#94a3b8]">NIFTY Benchmark (1.22%)</span>
                </div>
              </>
            )}
            {viewMode === 'monthly' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-2.5 rounded-sm bg-[#34d399]" />
                  <span className="text-[#94a3b8]">Monthly Inflow (₹)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t border-dashed border-[#22d3ee]" />
                  <span className="text-[#94a3b8]">Avg Run-Rate (₹551/mo)</span>
                </div>
              </>
            )}
            {viewMode === 'annual-income' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-2.5 rounded-sm bg-[#22d3ee]" />
                  <span className="text-[#94a3b8]">Total ₹ Inflow</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* SVG Responsive Bar Chart */}
        <div className="w-full overflow-x-auto no-scrollbar pt-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[300px] select-none text-[10px] font-mono"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding.top + chartHeight * (1 - ratio);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray={ratio === 0 ? 'none' : '3 3'}
                    strokeWidth={1}
                  />
                  {/* Y Axis labels depending on view mode */}
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    className="text-[9px]"
                  >
                    {viewMode === 'comparison' && `${Math.round(ratio * 70)}%`}
                    {viewMode === 'monthly' && `₹${Math.round(ratio * 2400)}`}
                    {viewMode === 'annual-income' && `₹${Math.round(ratio * 3600)}`}
                  </text>
                </g>
              );
            })}

            {/* VIEW 1: YIELD VS PAYOUT DUAL BAR CHART */}
            {viewMode === 'comparison' && (() => {
              const maxVal = 70; // 70% max scale for payout ratio
              const holdingsCount = dividendSummary.holdings.length;
              const groupWidth = chartWidth / holdingsCount;
              const barWidth = Math.min(28, (groupWidth - 20) / 2);

              // Benchmark yield line at 1.22%
              const benchmarkY = padding.top + chartHeight * (1 - dividendSummary.benchmarkYield / maxVal);
              // Payout safe threshold line at 50%
              const payoutThresholdY = padding.top + chartHeight * (1 - 50 / maxVal);

              return (
                <g>
                  {/* Benchmark Yield Line */}
                  <line
                    x1={padding.left}
                    y1={benchmarkY}
                    x2={padding.left + chartWidth}
                    y2={benchmarkY}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <text
                    x={padding.left + chartWidth - 4}
                    y={benchmarkY - 4}
                    textAnchor="end"
                    fill="#f59e0b"
                    className="text-[9px] font-bold"
                  >
                    NIFTY 50 Yield (1.22%)
                  </text>

                  {/* Payout Ratio Safe Limit Line */}
                  <line
                    x1={padding.left}
                    y1={payoutThresholdY}
                    x2={padding.left + chartWidth}
                    y2={payoutThresholdY}
                    stroke="#a78bfa"
                    strokeDasharray="2 3"
                    strokeOpacity={0.4}
                    strokeWidth={1}
                  />

                  {/* Grouped Bars per Asset */}
                  {dividendSummary.holdings.map((h, idx) => {
                    const groupCenterX = padding.left + idx * groupWidth + groupWidth / 2;
                    const yieldBarHeight = (h.dividendYield / maxVal) * chartHeight;
                    const payoutBarHeight = (h.payoutRatio / maxVal) * chartHeight;

                    const yieldBarX = groupCenterX - barWidth - 2;
                    const payoutBarX = groupCenterX + 2;

                    const isHovered = hoveredBarIndex === idx;
                    const isSelected = selectedSymbol === h.symbol;

                    return (
                      <g
                        key={h.symbol}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        onClick={() => setSelectedSymbol(selectedSymbol === h.symbol ? null : h.symbol)}
                      >
                        {/* Background hover highlight */}
                        {(isHovered || isSelected) && (
                          <rect
                            x={groupCenterX - groupWidth / 2 + 5}
                            y={padding.top}
                            width={groupWidth - 10}
                            height={chartHeight}
                            fill="#16243c"
                            fillOpacity={0.5}
                            rx={6}
                          />
                        )}

                        {/* Yield Bar (Cyan) */}
                        <rect
                          x={yieldBarX}
                          y={padding.top + chartHeight - yieldBarHeight}
                          width={barWidth}
                          height={yieldBarHeight}
                          fill={isSelected ? '#38bdf8' : '#22d3ee'}
                          rx={3}
                          className="transition-all hover:brightness-125"
                        />
                        {/* Yield value label */}
                        <text
                          x={yieldBarX + barWidth / 2}
                          y={padding.top + chartHeight - yieldBarHeight - 4}
                          textAnchor="middle"
                          fill="#22d3ee"
                          className="text-[9px] font-bold"
                        >
                          {h.dividendYield.toFixed(2)}%
                        </text>

                        {/* Payout Ratio Bar (Purple) */}
                        <rect
                          x={payoutBarX}
                          y={padding.top + chartHeight - payoutBarHeight}
                          width={barWidth}
                          height={payoutBarHeight}
                          fill={isSelected ? '#c4b5fd' : '#a78bfa'}
                          rx={3}
                          className="transition-all hover:brightness-125"
                        />
                        {/* Payout value label */}
                        <text
                          x={payoutBarX + barWidth / 2}
                          y={padding.top + chartHeight - payoutBarHeight - 4}
                          textAnchor="middle"
                          fill="#a78bfa"
                          className="text-[9px] font-bold"
                        >
                          {h.payoutRatio.toFixed(1)}%
                        </text>

                        {/* X-Axis Ticker Label */}
                        <text
                          x={groupCenterX}
                          y={padding.top + chartHeight + 18}
                          textAnchor="middle"
                          fill={isSelected ? '#22d3ee' : '#f1f5f9'}
                          className="font-bold text-[11px]"
                        >
                          {h.symbol}
                        </text>

                        {/* X-Axis Subtext (Frequency) */}
                        <text
                          x={groupCenterX}
                          y={padding.top + chartHeight + 32}
                          textAnchor="middle"
                          fill="#64748b"
                          className="text-[9px]"
                        >
                          {h.frequency}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* VIEW 2: 12-MONTH PASSIVE CASHFLOW STREAM BAR CHART */}
            {viewMode === 'monthly' && (() => {
              const maxMonthlyVal = 2400; // max Y scale
              const totalMonths = 12;
              const slotWidth = chartWidth / totalMonths;
              const barWidth = Math.min(34, slotWidth - 12);

              // Average line
              const avgY = padding.top + chartHeight * (1 - dividendSummary.monthlyAverageIncome / maxMonthlyVal);

              return (
                <g>
                  {/* Dashed Average Run-rate Line */}
                  <line
                    x1={padding.left}
                    y1={avgY}
                    x2={padding.left + chartWidth}
                    y2={avgY}
                    stroke="#22d3ee"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <text
                    x={padding.left + 8}
                    y={avgY - 4}
                    textAnchor="start"
                    fill="#22d3ee"
                    className="text-[9px] font-bold"
                  >
                    Average: ₹{dividendSummary.monthlyAverageIncome.toFixed(0)}/mo
                  </text>

                  {/* 12 Monthly Bars */}
                  {dividendSummary.monthlyAggregates.map((m, idx) => {
                    const barHeight = (m.amount / maxMonthlyVal) * chartHeight;
                    const barX = padding.left + idx * slotWidth + (slotWidth - barWidth) / 2;
                    const isHovered = hoveredBarIndex === idx;
                    const hasPayout = m.amount > 0;

                    return (
                      <g
                        key={m.month}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Hover column background */}
                        {isHovered && (
                          <rect
                            x={padding.left + idx * slotWidth}
                            y={padding.top}
                            width={slotWidth}
                            height={chartHeight}
                            fill="#16243c"
                            fillOpacity={0.6}
                            rx={4}
                          />
                        )}

                        {/* Bar */}
                        <rect
                          x={barX}
                          y={padding.top + chartHeight - barHeight}
                          width={barWidth}
                          height={Math.max(barHeight, hasPayout ? 4 : 1)}
                          fill={hasPayout ? (m.amount > 1500 ? '#10b981' : '#34d399') : '#1e293b'}
                          fillOpacity={hasPayout ? 1 : 0.4}
                          rx={3}
                          className="transition-all hover:brightness-125"
                        />

                        {/* Amount Value on top of bar */}
                        {hasPayout && (
                          <text
                            x={barX + barWidth / 2}
                            y={padding.top + chartHeight - barHeight - 4}
                            textAnchor="middle"
                            fill="#34d399"
                            className="text-[9px] font-bold"
                          >
                            ₹{m.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </text>
                        )}

                        {/* Month Label */}
                        <text
                          x={barX + barWidth / 2}
                          y={padding.top + chartHeight + 16}
                          textAnchor="middle"
                          fill={hasPayout ? '#f1f5f9' : '#64748b'}
                          className={`text-[10px] ${hasPayout ? 'font-bold' : ''}`}
                        >
                          {m.month}
                        </text>

                        {/* Active contributor count indicator */}
                        {m.contributors.length > 0 && (
                          <circle
                            cx={barX + barWidth / 2}
                            cy={padding.top + chartHeight + 28}
                            r={2.5}
                            fill="#22d3ee"
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* VIEW 3: ANNUAL INCOME CONTRIBUTION BY ASSET */}
            {viewMode === 'annual-income' && (() => {
              const maxIncome = 3600;
              const count = dividendSummary.holdings.length;
              const slotWidth = chartWidth / count;
              const barWidth = Math.min(48, slotWidth - 30);

              return (
                <g>
                  {dividendSummary.holdings.map((h, idx) => {
                    const barHeight = (h.annualIncome / maxIncome) * chartHeight;
                    const barX = padding.left + idx * slotWidth + (slotWidth - barWidth) / 2;
                    const sharePct = (h.annualIncome / dividendSummary.totalAnnualIncome) * 100;
                    const isHovered = hoveredBarIndex === idx;
                    const isSelected = selectedSymbol === h.symbol;

                    return (
                      <g
                        key={h.symbol}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        onClick={() => setSelectedSymbol(selectedSymbol === h.symbol ? null : h.symbol)}
                      >
                        {/* Hover column background */}
                        {(isHovered || isSelected) && (
                          <rect
                            x={padding.left + idx * slotWidth + 4}
                            y={padding.top}
                            width={slotWidth - 8}
                            height={chartHeight}
                            fill="#16243c"
                            fillOpacity={0.6}
                            rx={6}
                          />
                        )}

                        {/* Income Bar */}
                        <rect
                          x={barX}
                          y={padding.top + chartHeight - barHeight}
                          width={barWidth}
                          height={barHeight}
                          fill={isSelected ? '#38bdf8' : '#22d3ee'}
                          rx={4}
                          className="transition-all hover:brightness-125"
                        />

                        {/* Top Label: Inflow in ₹ */}
                        <text
                          x={barX + barWidth / 2}
                          y={padding.top + chartHeight - barHeight - 4}
                          textAnchor="middle"
                          fill="#22d3ee"
                          className="text-[10px] font-bold"
                        >
                          ₹{h.annualIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </text>

                        {/* Share percentage pill inside or above */}
                        <text
                          x={barX + barWidth / 2}
                          y={padding.top + chartHeight - Math.min(barHeight / 2, chartHeight - 12)}
                          textAnchor="middle"
                          fill="#083344"
                          className="text-[9px] font-extrabold"
                        >
                          {sharePct.toFixed(0)}%
                        </text>

                        {/* Ticker label */}
                        <text
                          x={barX + barWidth / 2}
                          y={padding.top + chartHeight + 18}
                          textAnchor="middle"
                          fill={isSelected ? '#22d3ee' : '#f1f5f9'}
                          className="font-bold text-[11px]"
                        >
                          {h.symbol}
                        </text>

                        {/* Shares Qty & DPS */}
                        <text
                          x={barX + barWidth / 2}
                          y={padding.top + chartHeight + 32}
                          textAnchor="middle"
                          fill="#64748b"
                          className="text-[9px]"
                        >
                          {h.qty} shs × ₹{h.dps.toFixed(0)}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Dynamic Tooltip details banner on hover */}
        {viewMode === 'monthly' && hoveredBarIndex !== null && (
          <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#22d3ee]/30 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#22d3ee]" />
              <span className="font-bold text-[#f1f5f9]">
                {dividendSummary.monthlyAggregates[hoveredBarIndex].month} Payouts:
              </span>
              <span className="text-[#34d399] font-bold">
                ₹{dividendSummary.monthlyAggregates[hoveredBarIndex].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#94a3b8]">
              {dividendSummary.monthlyAggregates[hoveredBarIndex].contributors.length > 0 ? (
                dividendSummary.monthlyAggregates[hoveredBarIndex].contributors.map((c) => (
                  <span key={c.symbol} className="px-1.5 py-0.5 rounded bg-[#16243c] border border-[#1e293b]">
                    <strong className="text-[#f1f5f9]">{c.symbol}</strong>: ₹{c.amount.toLocaleString('en-IN')} (₹{c.dps}/sh)
                  </span>
                ))
              ) : (
                <span className="text-[#64748b]">No dividend distributions scheduled this month</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Holdings Dividend Breakdown Table & Safety Matrix */}
      <div className="bg-[#070d19] rounded-xl border border-[#1e293b] overflow-hidden">
        <div className="p-3 bg-[#0a1120] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#22d3ee]" />
            <span className="text-[12px] font-bold text-[#f1f5f9] font-mono uppercase">
              Individual Asset Dividend Metrics &amp; Safety Coverage
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#64748b]">
            Click any row to filter or navigate to technical deep-dive
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-[#1e293b] text-[#64748b] text-[10px] uppercase bg-[#070d19]/80">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-2 text-right">Holding Qty</th>
                <th className="py-2.5 px-2 text-right">Dividend Yield</th>
                <th className="py-2.5 px-2 text-right">Annual DPS</th>
                <th className="py-2.5 px-2 text-right">Payout Ratio</th>
                <th className="py-2.5 px-2 text-right">FCF Coverage</th>
                <th className="py-2.5 px-2 text-right">Annual Inflow</th>
                <th className="py-2.5 px-2 text-right">Monthly Run-Rate</th>
                <th className="py-2.5 px-2 text-center">Safety Rating</th>
                <th className="py-2.5 px-3 text-right">Next Ex-Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {dividendSummary.holdings.map((h) => {
                const isSelected = selectedSymbol === h.symbol;
                return (
                  <tr
                    key={h.symbol}
                    onClick={() => setSelectedSymbol(selectedSymbol === h.symbol ? null : h.symbol)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#16243c]' : 'hover:bg-[#101a2b]'
                    }`}
                  >
                    {/* Asset Symbol & Name */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#f1f5f9]">{h.symbol}</span>
                        <span className="text-[9px] px-1 rounded bg-[#16243c] text-[#94a3b8]">{h.exchange}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#64748b] font-sans truncate block max-w-[130px]">{h.name}</span>
                    </td>

                    {/* Qty */}
                    <td className="py-2.5 px-2 text-right font-medium text-[#f1f5f9]">
                      {h.qty} shares
                    </td>

                    {/* Dividend Yield */}
                    <td className="py-2.5 px-2 text-right">
                      <span className="font-bold text-[#22d3ee] bg-[#22d3ee]/10 px-1.5 py-0.5 rounded">
                        {h.dividendYield.toFixed(2)}%
                      </span>
                    </td>

                    {/* Annual DPS */}
                    <td className="py-2.5 px-2 text-right text-[#f1f5f9] font-medium">
                      ₹{h.dps.toFixed(2)}
                    </td>

                    {/* Payout Ratio */}
                    <td className="py-2.5 px-2 text-right">
                      <span
                        className={`font-semibold px-1.5 py-0.5 rounded ${
                          h.payoutRatio <= 30
                            ? 'text-[#34d399] bg-[#10b981]/15'
                            : h.payoutRatio <= 65
                            ? 'text-[#a78bfa] bg-[#8b5cf6]/15'
                            : 'text-[#f59e0b] bg-[#f59e0b]/15'
                        }`}
                      >
                        {h.payoutRatio.toFixed(1)}%
                      </span>
                    </td>

                    {/* FCF Coverage */}
                    <td className="py-2.5 px-2 text-right text-[#94a3b8]">
                      {h.fcfCoverage.toFixed(1)}x FCF
                    </td>

                    {/* Annual Inflow */}
                    <td className="py-2.5 px-2 text-right font-bold text-[#34d399]">
                      ₹{h.annualIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Monthly Run Rate */}
                    <td className="py-2.5 px-2 text-right text-[#f1f5f9]">
                      ₹{h.monthlyRunRate.toFixed(2)}/mo
                    </td>

                    {/* Safety Rating */}
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          h.safetyRating === 'Very Safe'
                            ? 'text-[#34d399] bg-[#10b981]/15 border border-[#10b981]/30'
                            : h.safetyRating === 'Safe'
                            ? 'text-[#22d3ee] bg-[#22d3ee]/15 border border-[#22d3ee]/30'
                            : 'text-[#f59e0b] bg-[#f59e0b]/15 border border-[#f59e0b]/30'
                        }`}
                      >
                        {h.safetyRating}
                      </span>
                    </td>

                    {/* Next Ex-Date */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="text-[#f1f5f9] font-medium text-[10px]">{h.nextExDate}</div>
                      <span className="text-[9px] text-[#64748b]">₹{h.nextPayoutPerShare.toFixed(2)} / sh</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRIP (Dividend Reinvestment Plan) Compounding Simulator */}
      <div className="bg-[#070d19] p-4 rounded-xl border border-[#1e293b] space-y-3 font-mono text-[11px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-[#34d399]" />
            <span className="font-bold text-[#f1f5f9] uppercase tracking-wider text-[12px]">
              DRIP (Dividend Reinvestment) Compounding Projector
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#34d399]/15 text-[#34d399] font-bold">
              +12% Expected CAGR
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[#94a3b8] text-[10px]">Horizon:</span>
            {([1, 3, 5] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => setDripYears(yr)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  dripYears === yr
                    ? 'bg-[#22d3ee] text-[#083344]'
                    : 'bg-[#16243c] text-[#94a3b8] hover:text-[#f1f5f9]'
                }`}
              >
                {yr} Year{yr > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Compounding Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Cash Withdrawal Route */}
          <div className="bg-[#101a2b] p-3 rounded-lg border border-[#1e293b]">
            <span className="text-[#94a3b8] text-[10px] uppercase block">Cash Withdrawal Only</span>
            <div className="text-[16px] font-bold text-[#f1f5f9] mt-1">
              ₹{dripProjections[dripYears].cashOnlyTotal.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#64748b]">
              Linear cumulative cash without equity compounding
            </span>
          </div>

          {/* Reinvestment Route */}
          <div className="bg-[#101a2b] p-3 rounded-lg border border-[#34d399]/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#34d399]/5 rounded-bl-full pointer-events-none" />
            <span className="text-[#34d399] text-[10px] font-bold uppercase block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-Reinvested (DRIP)
            </span>
            <div className="text-[16px] font-bold text-[#34d399] mt-1">
              ₹{dripProjections[dripYears].reinvestedTotal.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#64748b]">
              Full dividend reinvestment at 12% portfolio growth
            </span>
          </div>

          {/* Wealth Acceleration Alpha */}
          <div className="bg-[#101a2b] p-3 rounded-lg border border-[#22d3ee]/40">
            <span className="text-[#22d3ee] text-[10px] font-bold uppercase block">
              Compounding Wealth Boost
            </span>
            <div className="text-[16px] font-bold text-[#22d3ee] mt-1">
              +₹{dripProjections[dripYears].extraGain.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-[#64748b]">
              Additional wealth created purely by compounding distributions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendAnalysisWidget;
