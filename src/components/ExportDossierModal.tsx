import React, { useState } from 'react';
import { StockData } from '../types/stock';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStock: StockData;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  activeStock,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const textReport = `
=== STOCKSENSE AI QUANTITATIVE AUDIT DOSSIER ===
Target Asset: ${activeStock.name} (${activeStock.symbol} - ${activeStock.exchange})
Generated: ${new Date().toISOString()}
Model Version: XAI Ensemble v2.4 (TreeSHAP exact attribution)

1. ML HORIZON FORECAST
Direction: ${activeStock.forecastDirection}
Confidence: ${activeStock.confidence}%
Expected Delta: ${activeStock.expectedDelta}
Target Range: ${activeStock.targetRange}
Softmax Probability: Bullish ${activeStock.probabilities.bullish}% | Neutral ${activeStock.probabilities.neutral}% | Bearish ${activeStock.probabilities.bearish}%

2. QUANTITATIVE RISK SPECTRUM
Normalized Risk Score: ${activeStock.riskScore}/100 (${activeStock.riskCategory} Risk)
1-Day VaR (95% Confidence): ${activeStock.var95}% (${activeStock.varAmount})
Annualized Volatility: ${activeStock.volatilityAnn}%
Maximum 1Y Drawdown: ${activeStock.maxDrawdown}%
Market Beta: ${activeStock.beta}
Sharpe Ratio: ${activeStock.sharpeRatio} | Sortino Ratio: ${activeStock.sortinoRatio}

3. TREESHAP FEATURE ATTRIBUTION (Σ = ${activeStock.netShap})
${activeStock.shapFactors
  .map(
    (f) =>
      `- ${f.name} [${f.badge}]: ${f.rawFormatted} | ${f.description}`
  )
  .join('\n')}

4. SCENARIO SIMULATION SUMMARY
${activeStock.scenarios
  .map(
    (s) =>
      `- ${s.title} (${s.probability}%): ${s.description} [${s.targetOrBand}]`
  )
  .join('\n')}

==================================================
DISCLAIMER: AI predictions represent non-deterministic statistical estimates. This report is computational decision support and does not constitute registered investment advice.
    `.trim();

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#171b26] border border-[#262a35] rounded-2xl w-full max-w-lg p-5 shadow-2xl flex flex-col space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[22px]">
              picture_as_pdf
            </span>
            <div>
              <h3 className="font-semibold text-[#dfe2f1] text-[16px]">
                Export AI Audit Dossier
              </h3>
              <p className="text-[11px] font-mono text-[#908fa0]">
                Institutional Compliance &amp; Model Governance Report
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

        {/* Paper style dossier preview */}
        <div className="bg-[#0a0e18] p-4 rounded-xl border border-[#262a35] font-mono text-[11px] space-y-3 text-[#c7c4d7]">
          <div className="flex justify-between items-center border-b border-[#1c1f2a] pb-2 text-[10px] text-[#908fa0]">
            <span>STOCKSENSE-REPORT-2026-XAI</span>
            <span className="text-[#4cd7f6]">CONFIDENTIAL COMPLIANCE</span>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#dfe2f1] font-bold text-[14px]">
                {activeStock.name} ({activeStock.symbol})
              </span>
              <div className="text-[10px] text-[#908fa0]">
                Exchange: {activeStock.exchange} • Price: {activeStock.priceFormatted}
              </div>
            </div>
            <div className="text-right">
              <span className="px-1.5 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] text-[10px] font-bold">
                {activeStock.forecastDirection} ({activeStock.confidence}% Conf)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#171b26] p-2 rounded">
            <div>
              <span className="text-[#908fa0] text-[10px] block">Expected Delta</span>
              <span className="text-[#4cd7f6] font-bold">{activeStock.expectedDelta}</span>
            </div>
            <div>
              <span className="text-[#908fa0] text-[10px] block">1-Day VaR (95%)</span>
              <span className="text-[#ffb4ab] font-bold">{activeStock.var95}%</span>
            </div>
            <div>
              <span className="text-[#908fa0] text-[10px] block">Sharpe / Sortino</span>
              <span className="text-[#dfe2f1] font-bold">{activeStock.sharpeRatio} / {activeStock.sortinoRatio}</span>
            </div>
            <div>
              <span className="text-[#908fa0] text-[10px] block">Net SHAP Divergence</span>
              <span className="text-[#c0c1ff] font-bold">{activeStock.netShap}</span>
            </div>
          </div>

          <div>
            <span className="text-[#908fa0] text-[10px] block mb-1">Top Drivers (TreeSHAP Game Theory):</span>
            <ul className="space-y-1 text-[10px]">
              {activeStock.shapFactors.slice(0, 3).map((f, i) => (
                <li key={i} className="flex justify-between">
                  <span>{f.name}</span>
                  <span className={f.isDrag ? 'text-[#ffb4ab]' : 'text-[#4cd7f6]'}>
                    {f.rawFormatted}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#c0c1ff] text-[#1000a9] font-semibold text-[13px] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Dossier Copied!' : 'Copy Dossier to Clipboard'}
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="py-2.5 px-3 rounded-xl bg-[#262a35] text-[#dfe2f1] text-[13px] hover:bg-[#313540] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
