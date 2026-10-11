import React, { useState } from 'react';
import { StockData } from '../../types/stock';

interface ExplainXaiScreenProps {
  stock: StockData;
}

export const ExplainXaiScreen: React.FC<ExplainXaiScreenProps> = ({ stock }) => {
  const [viewMode, setViewMode] = useState<'technical' | 'beginner'>('technical');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [chatLog, setChatLog] = useState<
    { query: string; response: string; timestamp: string }[]
  >([
    {
      query: 'What happens if US tech indices drop 2% tonight?',
      response:
        'AI Counterfactual Simulation: If NASDAQ 100 declines >2.0%, the FinBERT sentiment feature flips from +0.11 to -0.16. This lowers overall bullish confidence from 78.4% to 54.1%, placing TCS in an immediate consolidation regime.',
      timestamp: '2m ago',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPrompt = (textToSend?: string) => {
    const q = (textToSend || userPrompt).trim();
    if (!q) return;

    setUserPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let resp = '';
      const lower = q.toLowerCase();
      if (lower.includes('finbert') || lower.includes('sentiment')) {
        resp = `FinBERT sentiment contributes +0.11 log-odds (+12.8% of net positive attribution). If quarterly commentary softens, this weight drops by 0.18 units, shifting the model toward neutral theta absorption.`;
      } else if (lower.includes('stop-loss') || lower.includes('invalidation')) {
        resp = `The primary model invalidation stop-loss is placed strictly below structural daily support at ${stock.invalidationLevel}. A daily close below this price triggers automatic model de-risking and resets the bullish thesis.`;
      } else if (lower.includes('crude') || lower.includes('oil')) {
        resp = `Energy pricing shock counterfactual: A 5% increase in Brent crude compresses IT operating margins by dampening discretionary enterprise IT allocations, reducing net SHAP by -0.14.`;
      } else {
        resp = `Evaluating ensemble TreeSHAP paths for "${q}": Based on current order flow and a beta of ${stock.beta}, the primary risk boundary remains bounded at ${stock.targetRange} with 95% single-day VaR of ${stock.var95}%.`;
      }

      setChatLog((prev) => [
        ...prev,
        {
          query: q,
          response: resp,
          timestamp: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-8 animate-fadeIn">
      {/* Interactive Sub-Header / Signal Context */}
      <section className="bg-[#171b26] rounded-xl p-3.5 shadow-md mb-3 border border-[#262a35]/60">
        <div className="flex items-center justify-between gap-2 mb-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#03b5d3]/20 text-[#4cd7f6] text-[11px] uppercase font-semibold">
              {stock.symbol} • {stock.exchange}
            </span>
            <span className="text-[#c7c4d7] text-[12px]">{stock.priceFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#262a35] text-[#c0c1ff] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff] animate-ping"></span>
            <span>TreeSHAP v4.2</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <h1 className="font-sans text-[20px] text-[#dfe2f1] font-semibold leading-tight">
            Why Did the AI Predict{' '}
            <span
              className={`font-bold ${
                stock.forecastDirection === 'BULLISH'
                  ? 'text-[#4cd7f6]'
                  : stock.forecastDirection === 'BEARISH'
                  ? 'text-[#ffb4ab]'
                  : 'text-[#d0bcff]'
              }`}
            >
              {stock.forecastDirection}
            </span>{' '}
            for {stock.symbol}?
          </h1>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#c7c4d7]">
            <span>
              Inference Confidence:{' '}
              <strong className="text-[#4cd7f6] font-semibold">{stock.confidence}%</strong>
            </span>
            <span>•</span>
            <span>
              Horizon: <strong>3-5 Sessions</strong>
            </span>
          </div>
        </div>

        {/* Probability Gauge Bar */}
        <div className="flex flex-col gap-1.5 mt-1 font-mono">
          <div className="w-full h-2 rounded bg-[#313540] overflow-hidden flex">
            <div
              className="bg-[#4cd7f6] h-full"
              style={{ width: `${stock.probabilities.bullish}%` }}
              title={`Bullish ${stock.probabilities.bullish}%`}
            ></div>
            <div
              className="bg-[#c0c1ff] h-full"
              style={{ width: `${stock.probabilities.neutral}%` }}
              title={`Neutral ${stock.probabilities.neutral}%`}
            ></div>
            <div
              className="bg-[#ffb4ab] h-full"
              style={{ width: `${stock.probabilities.bearish}%` }}
              title={`Bearish ${stock.probabilities.bearish}%`}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[12px] text-[#c7c4d7]">
            <span className="text-[#4cd7f6] font-medium">
              Bullish {stock.probabilities.bullish}%
            </span>
            <span>Neutral {stock.probabilities.neutral}%</span>
            <span className="text-[#ffb4ab]">Bearish {stock.probabilities.bearish}%</span>
          </div>
        </div>
      </section>

      {/* XAI Transparency Banner */}
      <div className="bg-[#1c1f2a] rounded-xl p-3.5 mb-3 shadow-sm border border-[#262a35]/60">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c0c1ff]/10 text-[#c0c1ff] flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[13px] text-[#dfe2f1] font-semibold mb-0.5">
              Glass-Box Verification Engine
            </span>
            <p className="font-mono text-[11px] text-[#c7c4d7] leading-relaxed">
              StockSense AI strictly excludes uninterpretable deep black-box models. Every probability delta is mathematically proven via cooperative game-theoretic TreeSHAP feature contributions.
            </p>
          </div>
        </div>
      </div>

      {/* Perspective Persona Switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-full p-1 rounded-xl bg-[#171b26] flex items-center shadow-inner border border-[#262a35]/60 font-sans">
          <button
            onClick={() => setViewMode('technical')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'technical'
                ? 'bg-[#c0c1ff] text-[#1000a9] shadow-sm font-semibold'
                : 'text-[#c7c4d7] hover:text-[#dfe2f1]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">stacked_bar_chart</span>
            <span>Technical (SHAP)</span>
          </button>
          <button
            onClick={() => setViewMode('beginner')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'beginner'
                ? 'bg-[#c0c1ff] text-[#1000a9] shadow-sm font-semibold'
                : 'text-[#c7c4d7] hover:text-[#dfe2f1]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sentiment_satisfied</span>
            <span>Plain English (ELI5)</span>
          </button>
        </div>
      </div>

      {/* Narrative Card: Dual Dynamic Perspective */}
      <div className="bg-[#171b26] rounded-xl p-3.5 mb-4 shadow-sm border border-[#262a35]/60">
        <div className="flex items-center gap-1.5 mb-2 text-[#c0c1ff]">
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span className="font-sans text-[11px] uppercase font-semibold">
            {viewMode === 'technical'
              ? 'Attribution Synthesis • Quant Mode'
              : 'Simplified Translation • Human First'}
          </span>
        </div>

        {viewMode === 'beginner' ? (
          <div className="flex flex-col gap-2 animate-fadeIn font-sans">
            <p className="text-[13px] text-[#dfe2f1] leading-relaxed">
              {stock.eli5Narrative}
            </p>
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg flex items-center gap-2 border border-[#262a35]/60">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px] shrink-0">
                lightbulb
              </span>
              <span className="font-mono text-[11px] text-[#c7c4d7]">
                Caution: Intraday market volatility remains elevated; model sets primary technical safety floor at {stock.invalidationLevel}.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 animate-fadeIn font-mono">
            <p className="text-[12px] text-[#dfe2f1] leading-relaxed">
              {stock.technicalNarrative}
            </p>
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg flex items-center justify-between text-[11px] border border-[#262a35]/60">
              <span className="text-[#c7c4d7]">
                Baseline Log-Odds E[f(x)]:{' '}
                <strong className="text-[#dfe2f1]">{stock.baselineLogOdds}</strong>
              </span>
              <span className="text-[#4cd7f6]">
                Final f(x):{' '}
                <strong className="text-[#4cd7f6] font-bold">
                  {stock.finalLogOdds} (+{stock.confidence}%)
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SHAP Waterfall / Feature Divergence Canvas */}
      <section className="flex flex-col mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-sans text-[16px] text-[#dfe2f1] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              waterfall_chart
            </span>
            <span>Feature Attribution (SHAP)</span>
          </h2>
          <span className="font-mono text-[12px] text-[#c7c4d7]">Σ = {stock.netShap}</span>
        </div>

        {/* Chart Surface */}
        <div className="bg-[#171b26] rounded-xl p-3.5 shadow-md flex flex-col gap-3.5 border border-[#262a35]/60 font-mono">
          {/* Axis Scale Guide */}
          <div className="flex items-center justify-between text-[11px] text-[#c7c4d7] px-1">
            <span className="text-[#ffb4ab]">-0.20 Drag</span>
            <div className="h-3 w-[1px] bg-[#313540]"></div>
            <span className="text-[#dfe2f1] font-semibold">0.00 Base</span>
            <div className="h-3 w-[1px] bg-[#313540]"></div>
            <span className="text-[#4cd7f6]">+0.30 Driver</span>
          </div>

          {/* Feature items */}
          {stock.shapFactors.map((factor, idx) => {
            const isNegative = factor.isDrag || factor.value < 0;
            // Bar width percentage relative to max 0.35
            const widthPct = Math.min(100, Math.round((Math.abs(factor.value) / 0.35) * 100));

            return (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#dfe2f1] font-medium">{factor.name}</span>
                    <span className="px-1 rounded bg-[#262a35] text-[#c7c4d7] text-[10px]">
                      {factor.badge}
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      isNegative ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'
                    }`}
                  >
                    {factor.rawFormatted}
                  </span>
                </div>

                <div className="h-3 w-full bg-[#1c1f2a] rounded flex overflow-hidden relative">
                  {/* Left side (negative drag) */}
                  <div className="w-1/2 flex justify-end">
                    {isNegative && (
                      <div
                        className="h-full bg-[#ffb4ab] rounded-l transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      ></div>
                    )}
                  </div>
                  {/* Zero axis divider */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#313540] z-10"></div>
                  {/* Right side (positive driver) */}
                  <div className="w-1/2 flex justify-start">
                    {!isNegative && (
                      <div
                        className="h-full bg-[#4cd7f6] rounded-r transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      ></div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-[#c7c4d7] leading-tight">
                  {factor.description}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Market Scenario Engine (Gemini LLM Synthesized) */}
      <section className="flex flex-col mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">neurology</span>
            <h2 className="font-sans text-[16px] text-[#dfe2f1] font-semibold">
              Gemini Scenario Simulations
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#a078ff]/30 text-[#d0bcff] font-mono text-[11px]">
            Multi-Path ML
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {stock.scenarios.map((scen, idx) => (
            <div
              key={idx}
              className="bg-[#171b26] rounded-xl p-3.5 shadow-sm border border-[#262a35]/60"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      scen.type === 'bull'
                        ? 'bg-[#4cd7f6]'
                        : scen.type === 'bear'
                        ? 'bg-[#ffb4ab]'
                        : 'bg-[#c0c1ff]'
                    }`}
                  ></span>
                  <span className="font-sans text-[13px] text-[#dfe2f1] font-semibold">
                    {scen.title}
                  </span>
                </div>
                <span
                  className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#262a35] ${
                    scen.type === 'bull'
                      ? 'text-[#4cd7f6]'
                      : scen.type === 'bear'
                      ? 'text-[#ffb4ab]'
                      : 'text-[#c7c4d7]'
                  }`}
                >
                  {scen.probability}% Probability
                </span>
              </div>

              <p className="font-mono text-[12px] text-[#c7c4d7] mb-1.5 leading-relaxed">
                {scen.description}
              </p>

              <div className="flex items-center gap-3 font-mono text-[11px] text-[#c7c4d7]">
                <span>
                  <strong className="text-[#dfe2f1]">{scen.targetOrBand}</strong>
                </span>
                <span>
                  <strong className="text-[#c7c4d7]">{scen.riskRewardOrStrategy}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive AI Inquiry Button & Drawer Trigger */}
      <section className="mb-3">
        <button
          onClick={() => setInquiryOpen(!inquiryOpen)}
          className="w-full h-12 rounded-xl bg-[#c0c1ff] text-[#1000a9] font-sans text-[13px] font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all hover:opacity-95"
        >
          <span className="material-symbols-outlined text-[20px]">chat_spark</span>
          <span>Ask StockSense AI About This Prediction</span>
        </button>
      </section>

      {/* Interactive Inquiry Drawer / Micro-Terminal */}
      {inquiryOpen && (
        <div className="flex flex-col bg-[#262a35] rounded-xl p-3.5 mb-3 shadow-xl transition-all border border-[#313540] animate-fadeIn">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#313540]">
            <div className="flex items-center gap-1.5 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span className="font-mono text-[11px] uppercase font-semibold">
                Conversational Interpretability
              </span>
            </div>
            <button
              onClick={() => setInquiryOpen(false)}
              className="text-[#c7c4d7] hover:text-[#dfe2f1]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex flex-col gap-2.5 mb-2.5 max-h-56 overflow-y-auto no-scrollbar font-mono text-[12px]">
            {chatLog.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-start gap-1 text-[#c7c4d7]">
                  <span className="text-[#c0c1ff] font-bold">Query:</span>
                  <span className="text-[#dfe2f1]">"{item.query}"</span>
                </div>
                <div className="bg-[#0a0e18] rounded-lg p-2.5 text-[#c7c4d7] leading-relaxed border border-[#313540]/60">
                  <div className="text-[#4cd7f6] font-medium mb-1">
                    AI Counterfactual Simulation:
                  </div>
                  {item.response}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-[11px] text-[#4cd7f6] animate-pulse">
                Analyzing TreeSHAP feature paths and simulation branches...
              </div>
            )}
          </div>

          {/* Quick Suggested Queries */}
          <div className="flex flex-wrap gap-1.5 mb-2 font-mono text-[11px]">
            <button
              onClick={() => handleSendPrompt('How much weight is on FinBERT?')}
              className="px-2 py-1 rounded bg-[#1c1f2a] text-[#c7c4d7] hover:text-[#dfe2f1] hover:bg-[#313540] transition-colors"
            >
              How much weight is on FinBERT?
            </button>
            <button
              onClick={() => handleSendPrompt('Where is the invalidation stop-loss?')}
              className="px-2 py-1 rounded bg-[#1c1f2a] text-[#c7c4d7] hover:text-[#dfe2f1] hover:bg-[#313540] transition-colors"
            >
              Where is the invalidation stop-loss?
            </button>
            <button
              onClick={() => handleSendPrompt('What happens if crude oil rises 5%?')}
              className="px-2 py-1 rounded bg-[#1c1f2a] text-[#c7c4d7] hover:text-[#dfe2f1] hover:bg-[#313540] transition-colors"
            >
              What if crude oil rises 5%?
            </button>
          </div>

          {/* Query input */}
          <div className="flex items-center gap-1.5">
            <input
              className="flex-1 h-10 px-3 rounded-lg bg-[#0a0e18] text-[#dfe2f1] font-mono text-[12px] placeholder-[#908fa0] focus:outline-none border border-[#313540]"
              placeholder="Ask counterfactual or feature query..."
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendPrompt();
              }}
            />
            <button
              onClick={() => handleSendPrompt()}
              className="h-10 px-3 rounded-lg bg-[#c0c1ff] text-[#1000a9] flex items-center justify-center font-sans text-[13px] font-semibold hover:opacity-90 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      )}

      {/* Compliance & Mathematical Integrity Disclaimer */}
      <div className="rounded-xl bg-[#171b26] p-3.5 shadow-sm border border-[#262a35]/60">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#908fa0] text-[18px] shrink-0 mt-0.5">
            policy
          </span>
          <p className="font-mono text-[11px] text-[#c7c4d7] leading-normal">
            TreeSHAP (Tree Shapley Additive exPlanations) computes exact local feature attributions via game-theoretic Shapley values. All algorithmic outputs represent conditional probabilistic states and do not constitute direct financial advice or fiduciary recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};
