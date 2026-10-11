import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PriceAlert, SystemNotification } from '../types/stock';
import { ALL_STOCKS } from '../data/stocksData';

interface AlertContextType {
  alerts: PriceAlert[];
  notifications: SystemNotification[];
  unreadCount: number;
  recentBreachedAlert: PriceAlert | null;
  isSetAlertModalOpen: boolean;
  alertTargetSymbol: string;
  openSetAlertModal: (symbol?: string) => void;
  closeSetAlertModal: () => void;
  createAlert: (alertData: {
    symbol: string;
    condition: 'GREATER_THAN' | 'LESS_THAN';
    targetPrice: number;
    note?: string;
  }) => PriceAlert;
  deleteAlert: (id: string) => void;
  toggleAlertActive: (id: string) => void;
  simulateBreach: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  dismissRecentBreach: () => void;
  checkPriceAgainstAlerts: (symbol: string, newPrice: number) => void;
}

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alert-tcs-1',
    symbol: 'TCS',
    stockName: 'Tata Consultancy Services',
    exchange: 'NSE',
    currency: '₹',
    condition: 'GREATER_THAN',
    targetPrice: 3980.0,
    currentPrice: 3942.5,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    active: true,
    triggered: false,
    note: 'Resistance breakout target near 50-day SMA',
  },
  {
    id: 'alert-aapl-1',
    symbol: 'AAPL',
    stockName: 'Apple Inc.',
    exchange: 'NASDAQ',
    currency: '$',
    condition: 'GREATER_THAN',
    targetPrice: 192.5,
    currentPrice: 189.8,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    active: true,
    triggered: false,
    note: 'Services revenue all-time high momentum threshold',
  },
  {
    id: 'alert-nvda-1',
    symbol: 'NVDA',
    stockName: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    currency: '$',
    condition: 'GREATER_THAN',
    targetPrice: 900.0,
    currentPrice: 892.4,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    active: true,
    triggered: false,
    note: 'Data center AI hardware demand upper target',
  },
  {
    id: 'alert-tsla-1',
    symbol: 'TSLA',
    stockName: 'Tesla Inc.',
    exchange: 'NASDAQ',
    currency: '$',
    condition: 'LESS_THAN',
    targetPrice: 172.0,
    currentPrice: 176.5,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    active: true,
    triggered: false,
    note: 'Risk stop-loss floor support level',
  },
  {
    id: 'alert-reliance-1',
    symbol: 'RELIANCE',
    stockName: 'Reliance Industries',
    exchange: 'NSE',
    currency: '₹',
    condition: 'GREATER_THAN',
    targetPrice: 2950.0,
    currentPrice: 2910.45,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    active: true,
    triggered: false,
    note: 'Refining crack spreads expansion continuation',
  },
];

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'TCS: Golden Cross Confirmed',
    desc: 'SMA 20 crossed SMA 50. TreeSHAP attribution momentum +0.28 driver active.',
    time: '12m ago',
    timestamp: Date.now() - 12 * 60 * 1000,
    type: 'bull',
    symbol: 'TCS',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Macro Alert: US Tech Volatility',
    desc: 'NASDAQ 100 volatility spread elevated. Defensive beta assets recommended.',
    time: '45m ago',
    timestamp: Date.now() - 45 * 60 * 1000,
    type: 'warning',
    symbol: 'AAPL',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'NVDA: Target Range Update',
    desc: 'Target range calibrated upward to $925 – $955 based on hyperscaler CapEx metrics.',
    time: '2h ago',
    timestamp: Date.now() - 120 * 60 * 1000,
    type: 'bull',
    symbol: 'NVDA',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'TSLA: Drawdown Warning',
    desc: 'Bearish divergence flagged on EV price reduction sentiment. VaR at 95% elevated to -4.2%.',
    time: '4h ago',
    timestamp: Date.now() - 240 * 60 * 1000,
    type: 'bear',
    symbol: 'TSLA',
    isRead: true,
  },
];

// Helper to play synthesized institutional telemetry chime on alert breach
const playAlertTone = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6 note

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio permission or context restrictions
  }
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stocksense_price_alerts');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore parse error
        }
      }
    }
    return INITIAL_ALERTS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stocksense_notifications');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore parse error
        }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [recentBreachedAlert, setRecentBreachedAlert] = useState<PriceAlert | null>(null);
  const [isSetAlertModalOpen, setIsSetAlertModalOpen] = useState(false);
  const [alertTargetSymbol, setAlertTargetSymbol] = useState('TCS');

  const openSetAlertModal = useCallback((symbol?: string) => {
    if (symbol) {
      setAlertTargetSymbol(symbol.toUpperCase());
    }
    setIsSetAlertModalOpen(true);
  }, []);

  const closeSetAlertModal = useCallback(() => {
    setIsSetAlertModalOpen(false);
  }, []);

  // Sync with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stocksense_price_alerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stocksense_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Trigger breach helper
  const triggerBreachInternal = useCallback((alert: PriceAlert, breachedPrice: number) => {
    const updatedAlert: PriceAlert = {
      ...alert,
      triggered: true,
      triggeredAt: new Date().toISOString(),
      triggeredPrice: breachedPrice,
      active: false,
    };

    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? updatedAlert : a)));

    // Generate triggered notification
    const conditionText = alert.condition === 'GREATER_THAN' ? 'exceeded target above' : 'dropped below target of';
    const newNotification: SystemNotification = {
      id: `breach-${alert.id}-${Date.now()}`,
      title: `🚨 Price Alert: ${alert.symbol} ${alert.condition === 'GREATER_THAN' ? '▲' : '▼'} Target Breached`,
      desc: `${alert.stockName} (${alert.symbol}) has ${conditionText} ${alert.currency}${alert.targetPrice.toLocaleString()} at ${alert.currency}${breachedPrice.toLocaleString()}!`,
      time: 'Just now',
      timestamp: Date.now(),
      type: 'alert',
      symbol: alert.symbol,
      isRead: false,
      alertId: alert.id,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setRecentBreachedAlert(updatedAlert);
    playAlertTone();
  }, []);

  // Check price against active alerts
  const checkPriceAgainstAlerts = useCallback((symbol: string, newPrice: number) => {
    alerts.forEach((alert) => {
      if (alert.symbol === symbol && alert.active && !alert.triggered) {
        let isBreached = false;
        if (alert.condition === 'GREATER_THAN' && newPrice >= alert.targetPrice) {
          isBreached = true;
        } else if (alert.condition === 'LESS_THAN' && newPrice <= alert.targetPrice) {
          isBreached = true;
        }

        if (isBreached) {
          triggerBreachInternal(alert, newPrice);
        }
      }
    });
  }, [alerts, triggerBreachInternal]);

  // Create new price alert
  const createAlert = useCallback((data: {
    symbol: string;
    condition: 'GREATER_THAN' | 'LESS_THAN';
    targetPrice: number;
    note?: string;
  }): PriceAlert => {
    const stock = ALL_STOCKS[data.symbol] || {
      name: data.symbol,
      exchange: 'NSE',
      currency: '₹',
      price: data.targetPrice,
    };

    const newAlert: PriceAlert = {
      id: `alert-${data.symbol.toLowerCase()}-${Date.now()}`,
      symbol: data.symbol.toUpperCase(),
      stockName: stock.name,
      exchange: stock.exchange,
      currency: stock.currency || '₹',
      condition: data.condition,
      targetPrice: data.targetPrice,
      currentPrice: stock.price,
      createdAt: new Date().toISOString(),
      active: true,
      triggered: false,
      note: data.note || undefined,
    };

    setAlerts((prev) => [newAlert, ...prev]);

    // Confirmation notification
    const confNotification: SystemNotification = {
      id: `create-alert-${Date.now()}`,
      title: `Price Alert Configured: ${newAlert.symbol}`,
      desc: `Target threshold set at ${newAlert.currency}${newAlert.targetPrice.toLocaleString()} (${newAlert.condition === 'GREATER_THAN' ? 'Rises above' : 'Drops below'}).`,
      time: 'Just now',
      timestamp: Date.now(),
      type: 'bull',
      symbol: newAlert.symbol,
      isRead: false,
      alertId: newAlert.id,
    };
    setNotifications((prev) => [confNotification, ...prev]);

    return newAlert;
  }, []);

  // Delete alert
  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Toggle active
  const toggleAlertActive = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            active: !a.active,
            // If reactivating a triggered alert, reset triggered flag
            triggered: a.active ? a.triggered : false,
          };
        }
        return a;
      })
    );
  }, []);

  // Simulate breach for demo / testing
  const simulateBreach = useCallback((id: string) => {
    const target = alerts.find((a) => a.id === id);
    if (!target) return;

    // Simulate price that exceeds the threshold
    const spikeDelta = target.condition === 'GREATER_THAN' ? 1.018 : 0.982;
    const simulatedPrice = Number((target.targetPrice * spikeDelta).toFixed(2));
    triggerBreachInternal(target, simulatedPrice);
  }, [alerts, triggerBreachInternal]);

  // Notifications management
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissRecentBreach = useCallback(() => {
    setRecentBreachedAlert(null);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alerts,
        notifications,
        unreadCount,
        recentBreachedAlert,
        isSetAlertModalOpen,
        alertTargetSymbol,
        openSetAlertModal,
        closeSetAlertModal,
        createAlert,
        deleteAlert,
        toggleAlertActive,
        simulateBreach,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        dismissRecentBreach,
        checkPriceAgainstAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
