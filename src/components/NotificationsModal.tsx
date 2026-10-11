import React, { useState } from 'react';
import { useAlerts } from '../context/AlertContext';
import {
  Bell,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCheck,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (symbol: string) => void;
  onOpenSetAlert?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  onOpenSetAlert,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    alerts,
  } = useAlerts();

  const [activeTab, setActiveTab] = useState<'all' | 'breaches' | 'signals'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'breaches') return item.type === 'alert';
    if (activeTab === 'signals') return item.type !== 'alert';
    return true;
  });

  const breachCount = notifications.filter((n) => n.type === 'alert').length;
  const signalCount = notifications.filter((n) => n.type !== 'alert').length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#101a2b] border border-[#1e293b] rounded-2xl w-full max-w-lg mt-14 sm:mt-16 p-4 shadow-2xl flex flex-col space-y-3 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#f1f5f9] text-[15px] tracking-tight">
                  Telemetry &amp; Price Alerts
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#ef4444] text-white">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-[#94a3b8]">
                Real-time target threshold breaches &amp; model telemetry
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

        {/* Filter Tabs & Quick Actions */}
        <div className="flex items-center justify-between gap-2 font-mono text-[11px] pb-1">
          <div className="flex items-center gap-1 bg-[#070d19] p-0.5 rounded-lg border border-[#1e293b]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#16243c] text-[#22d3ee] font-semibold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('breaches')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'breaches'
                  ? 'bg-rose-950/80 text-rose-300 font-semibold border border-rose-800/40'
                  : 'text-[#94a3b8] hover:text-rose-300'
              }`}
            >
              Breaches ({breachCount})
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'signals'
                  ? 'bg-[#16243c] text-[#22d3ee] font-semibold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              XAI Signals ({signalCount})
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="px-2 py-1 rounded bg-[#070d19] hover:bg-[#16243c] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e293b] transition-colors flex items-center gap-1 cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3 h-3 text-[#22d3ee]" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="p-1 rounded bg-[#070d19] hover:bg-rose-950/60 text-[#94a3b8] hover:text-rose-300 border border-[#1e293b] transition-colors cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications Scroll List */}
        <div className="flex flex-col space-y-2 overflow-y-auto no-scrollbar max-h-[52vh] pr-0.5">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 text-center space-y-2 font-mono">
              <div className="w-10 h-10 rounded-full bg-[#070d19] border border-[#1e293b] flex items-center justify-center mx-auto text-[#64748b]">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-[13px] font-semibold text-[#f1f5f9]">No notifications yet</p>
              <p className="text-[11px] text-[#64748b]">
                When your watchlist price thresholds are breached, real-time alerts will appear here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isBreach = notif.type === 'alert';

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.symbol) {
                      onSelectStock(notif.symbol);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border flex flex-col space-y-1.5 ${
                    isBreach
                      ? 'bg-gradient-to-r from-rose-950/30 to-[#101a2b] border-rose-500/40 hover:border-rose-400/70 hover:shadow-md'
                      : notif.isRead
                      ? 'bg-[#070d19] hover:bg-[#16243c] border-[#1e293b]'
                      : 'bg-[#16243c]/70 hover:bg-[#16243c] border-[#22d3ee]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isBreach
                            ? 'bg-[#ef4444] animate-ping'
                            : notif.type === 'bull'
                            ? 'bg-[#34d399]'
                            : notif.type === 'bear'
                            ? 'bg-[#f87171]'
                            : 'bg-[#f59e0b]'
                        }`}
                      />
                      <span className="text-[12px] font-bold text-[#f1f5f9] font-mono flex items-center gap-1.5">
                        {notif.title}
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                        )}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-[#64748b] shrink-0">
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#c7c4d7] leading-relaxed pl-4 font-sans">
                    {notif.desc}
                  </p>

                  {notif.symbol && (
                    <div className="flex items-center justify-between pt-1 border-t border-[#1e293b]/60 pl-4 font-mono text-[10px]">
                      <span className="text-[#94a3b8]">
                        Asset: <strong className="text-[#f1f5f9]">{notif.symbol}</strong>
                      </span>
                      <span className="text-[#22d3ee] flex items-center gap-0.5 hover:underline font-semibold">
                        <span>Inspect in Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-[#94a3b8]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Price Monitors: <strong>{alerts.filter((a) => a.active).length}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSetAlert && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSetAlert();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#22d3ee]/15 hover:bg-[#22d3ee]/25 text-[#22d3ee] border border-[#22d3ee]/40 font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>+ Set Alert</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-[#070d19] hover:bg-[#16243c] text-[#dfe2f1] border border-[#1e293b] font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
