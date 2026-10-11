import React from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (symbol: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
}) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: '1',
      title: 'TCS: Golden Cross Confirmed',
      desc: 'SMA 20 crossed SMA 50. TreeSHAP attribution momentum +0.28 driver active.',
      time: '12m ago',
      type: 'bull',
      symbol: 'TCS',
    },
    {
      id: '2',
      title: 'Macro Alert: US Tech Volatility',
      desc: 'NASDAQ 100 volatility spread elevated. Defensive beta assets recommended.',
      time: '45m ago',
      type: 'warning',
      symbol: 'AAPL',
    },
    {
      id: '3',
      title: 'NVDA: Target Range Update',
      desc: 'Target range calibrated upward to $925 – $955 based on hyperscaler CapEx metrics.',
      time: '2h ago',
      type: 'bull',
      symbol: 'NVDA',
    },
    {
      id: '4',
      title: 'TSLA: Drawdown Warning',
      desc: 'Bearish divergence flagged on EV price reduction sentiment. VaR at 95% elevated to -4.2%.',
      time: '4h ago',
      type: 'bear',
      symbol: 'TSLA',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#171b26] border border-[#262a35] rounded-2xl w-full max-w-md mt-16 p-4 shadow-2xl flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#262a35]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">
              notifications_active
            </span>
            <span className="font-semibold text-[#dfe2f1] text-[15px]">
              Algorithmic Telemetry Alerts
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1c1f2a] flex items-center justify-center text-[#c7c4d7] hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                onSelectStock(alert.symbol);
                onClose();
              }}
              className="p-3 rounded-xl bg-[#1c1f2a] hover:bg-[#262a35] cursor-pointer transition-all border border-transparent hover:border-[#4cd7f6]/30 flex flex-col space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.type === 'bull'
                        ? 'bg-[#4cd7f6]'
                        : alert.type === 'bear'
                        ? 'bg-[#ffb4ab]'
                        : 'bg-[#d0bcff]'
                    }`}
                  />
                  <span className="text-[13px] font-semibold text-[#dfe2f1]">
                    {alert.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#908fa0]">{alert.time}</span>
              </div>
              <p className="text-[12px] text-[#c7c4d7] leading-relaxed pl-3.5">
                {alert.desc}
              </p>
              <div className="flex justify-end pt-1">
                <span className="text-[10px] font-mono text-[#4cd7f6] flex items-center gap-0.5">
                  Inspect {alert.symbol}
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#262a35] text-[#dfe2f1] text-[12px] hover:bg-[#313540] font-medium"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
};
