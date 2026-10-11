import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StockSearchResult } from '../types/stock';
import { stockService } from '../services/stockService';
import { ALL_STOCKS } from '../data/stocksData';
import {
  Search,
  X,
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';

interface StockSearchBarProps {
  onSelectStock: (symbol: string) => void;
  activeSymbol?: string;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Text highlight component: splits text by query and highlights matching letters
 */
const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query || !query.trim()) {
    return <span>{text}</span>;
  }

  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="text-[#22d3ee] font-bold bg-[#22d3ee]/20 px-0.5 rounded transition-colors"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export const StockSearchBar: React.FC<StockSearchBarProps> = ({
  onSelectStock,
  activeSymbol,
  className = '',
  placeholder = 'Search stocks by company name or ticker (e.g., TCS, RELIANCE, AAPL)',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce query changes (280ms) to avoid duplicate and excessive requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Execute debounced search
  useEffect(() => {
    let isCurrent = true;

    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      setIsError(false);
      setErrorMessage(null);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    stockService
      .searchStocks(debouncedQuery)
      .then((data) => {
        if (!isCurrent) return;
        setResults(data);
        setIsLoading(false);
        setIsOpen(true);
        setSelectedIndex(data.length > 0 ? 0 : -1);
      })
      .catch((err) => {
        if (!isCurrent) return;
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(
          err?.message || 'Unable to query connected market data provider. Retrying locally.'
        );
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  // Close dropdown when user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle stock selection
  const handleSelect = useCallback(
    (symbol: string) => {
      const sym = symbol.toUpperCase();
      onSelectStock(sym);
      setQuery('');
      setDebouncedQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    [onSelectStock]
  );

  // Clear query
  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setIsError(false);
    setErrorMessage(null);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation within input & dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && (results.length > 0 || query.trim())) {
        setIsOpen(true);
        return;
      }
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        scrollToIndex(selectedIndex < results.length - 1 ? selectedIndex + 1 : 0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen && (results.length > 0 || query.trim())) {
        setIsOpen(true);
        return;
      }
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        scrollToIndex(selectedIndex > 0 ? selectedIndex - 1 : results.length - 1);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex].symbol);
      } else if (results.length > 0) {
        handleSelect(results[0].symbol);
      } else if (query.trim()) {
        const directSymbol = query.trim().toUpperCase();
        if (ALL_STOCKS[directSymbol]) {
          handleSelect(directSymbol);
        } else {
          // Show invalid-symbol alert in error state
          setIsError(true);
          setErrorMessage(
            `Symbol "${directSymbol}" was not found. Try TCS, RELIANCE, INFY, AAPL, MSFT, or TSLA.`
          );
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Scroll active item into view inside dropdown
  const scrollToIndex = (index: number) => {
    if (!dropdownRef.current) return;
    const items = dropdownRef.current.querySelectorAll('[data-result-item]');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  // Quick suggestions for empty / focus state
  const quickSuggestions = useMemo(() => {
    return [
      { sym: 'TCS', name: 'Tata Consultancy Services', ex: 'NSE' },
      { sym: 'RELIANCE', name: 'Reliance Industries', ex: 'NSE' },
      { sym: 'INFY', name: 'Infosys Ltd', ex: 'NSE' },
      { sym: 'AAPL', name: 'Apple Inc.', ex: 'NASDAQ' },
      { sym: 'MSFT', name: 'Microsoft Corporation', ex: 'NASDAQ' },
      { sym: 'TSLA', name: 'Tesla Inc.', ex: 'NASDAQ' },
    ];
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar with Glowing Focus State */}
      <div
        className={`relative flex items-center w-full bg-[#070d19] border rounded-xl transition-all duration-200 group ${
          isOpen && (results.length > 0 || isLoading || isError || query.trim())
            ? 'border-[#22d3ee] shadow-[0_0_24px_rgba(34,211,238,0.22)]'
            : 'border-[#1e293b] hover:border-[#22d3ee]/50 focus-within:border-[#22d3ee] focus-within:shadow-[0_0_24px_rgba(34,211,238,0.20)]'
        }`}
      >
        {/* Search Icon on Left */}
        <div className="pl-3.5 pr-1.5 flex items-center justify-center text-[#22d3ee] pointer-events-none transition-colors">
          <Search className="w-4 h-4 md:w-4.5 md:h-4.5" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (isError) setIsError(false);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search stocks by company name or ticker"
          aria-autocomplete="list"
          aria-controls="stock-search-dropdown"
          aria-expanded={isOpen}
          className="w-full bg-transparent py-2.5 md:py-3 pr-2 text-[13px] md:text-[14px] font-sans text-[#f1f5f9] placeholder-[#64748b] focus:outline-none transition-colors"
        />

        {/* Right Actions: Loader, Clear Button, Keyboard Hint */}
        <div className="flex items-center gap-1.5 pr-2.5 shrink-0">
          {isLoading && (
            <div className="flex items-center text-[#22d3ee] animate-spin" title="Searching...">
              <Loader2 className="w-4 h-4" />
            </div>
          )}

          {query.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 rounded-lg text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#16243c] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Active symbol badge if no query */}
          {query.length === 0 && activeSymbol && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg bg-[#101a2b] border border-[#1e3a5f] text-[10px] font-mono text-[#22d3ee] font-semibold">
              {activeSymbol}
            </span>
          )}

          {/* Quick shortcut indicator */}
          {query.length === 0 && (
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#64748b] bg-[#101a2b] border border-[#1e293b] rounded">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          id="stock-search-dropdown"
          ref={dropdownRef}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#101a2b] border border-[#1e3a5f] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden animate-fadeIn"
        >
          {/* Header Bar */}
          <div className="px-3.5 py-2 bg-[#070d19]/80 border-b border-[#1e293b] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
            <span>
              {isLoading
                ? 'SEARCHING DATA PROVIDER...'
                : results.length > 0
                ? `${results.length} MATCHING INSTRUMENT${results.length > 1 ? 'S' : ''}`
                : query.trim()
                ? 'NO EXACT MATCHES'
                : 'POPULAR MARKET BENCHMARKS'}
            </span>
            <span className="hidden sm:inline">↑↓ navigate • enter select • esc close</span>
          </div>

          {/* 1. Loading State */}
          {isLoading && (
            <div className="py-8 px-4 flex flex-col items-center justify-center gap-2 text-center">
              <Loader2 className="w-6 h-6 text-[#22d3ee] animate-spin" />
              <p className="text-[12px] font-mono text-[#94a3b8]">
                Searching connected market data provider &amp; quantitative universe...
              </p>
            </div>
          )}

          {/* 2. API Error / Invalid Symbol State */}
          {!isLoading && isError && (
            <div className="p-4 bg-[#ef4444]/10 border-b border-[#ef4444]/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
              <div className="text-[12px] space-y-1">
                <p className="font-semibold text-[#f87171]">Search Query Warning</p>
                <p className="text-[#cbd5e1] font-mono text-[11px] leading-relaxed">
                  {errorMessage || 'Symbol or company not identified. Verify ticker spelling.'}
                </p>
              </div>
            </div>
          )}

          {/* 3. Matching Results List */}
          {!isLoading && results.length > 0 && (
            <div className="max-h-72 overflow-y-auto divide-y divide-[#1e293b]/60">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isCurrentActive = item.symbol === activeSymbol;

                return (
                  <div
                    key={item.symbol}
                    data-result-item
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item.symbol)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-[#16243c] border-l-2 border-l-[#22d3ee]'
                        : 'hover:bg-[#16243c]/60'
                    }`}
                  >
                    {/* Left: Ticker + Exchange Badge + Company Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[13px] font-bold text-[#f1f5f9]">
                          <HighlightMatch text={item.symbol} query={debouncedQuery} />
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1e293b] text-[#94a3b8]">
                          <HighlightMatch text={item.exchange} query={debouncedQuery} />
                        </span>
                      </div>

                      <div className="text-[12px] text-[#94a3b8] font-sans truncate">
                        <HighlightMatch text={item.name} query={debouncedQuery} />
                      </div>
                    </div>

                    {/* Right: Latest Available Price + Change */}
                    <div className="flex items-center gap-3 shrink-0 text-right font-mono">
                      <div>
                        <div className="text-[13px] font-bold text-[#f1f5f9]">
                          {item.priceFormatted}
                        </div>
                        <div
                          className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                            item.isPositive ? 'text-[#34d399]' : 'text-[#f87171]'
                          }`}
                        >
                          {item.isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {item.isPositive ? '+' : ''}
                            {item.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {/* Active stock marker */}
                      {isCurrentActive && (
                        <span className="px-1.5 py-0.5 rounded bg-[#22d3ee]/10 text-[#22d3ee] text-[9px] font-mono font-bold uppercase">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. No Results State */}
          {!isLoading && !isError && query.trim() && results.length === 0 && (
            <div className="py-6 px-4 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#16243c] flex items-center justify-center mx-auto text-[#f59e0b]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[#f1f5f9]">
                  No stocks found matching &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] font-mono text-[#64748b]">
                  Supported symbols include Indian (NSE) and US (NASDAQ) equities:
                </p>
              </div>

              {/* Clickable Quick Ticker Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {quickSuggestions.map((s) => (
                  <button
                    key={s.sym}
                    type="button"
                    onClick={() => handleSelect(s.sym)}
                    className="px-2.5 py-1 rounded-lg bg-[#070d19] border border-[#1e293b] hover:border-[#22d3ee] text-[#22d3ee] font-mono text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>{s.sym}</span>
                    <span className="text-[9px] text-[#64748b]">({s.ex})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Default Suggestions when Query is Empty & Dropdown Focused */}
          {!isLoading && !query.trim() && (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#22d3ee] px-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>QUICK TICKER SELECTOR</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickSuggestions.map((s) => (
                  <button
                    key={s.sym}
                    type="button"
                    onClick={() => handleSelect(s.sym)}
                    className="p-2 rounded-xl bg-[#070d19] border border-[#1e293b] hover:border-[#22d3ee]/60 hover:bg-[#16243c]/60 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[12px] font-bold text-[#f1f5f9] group-hover:text-[#22d3ee]">
                        {s.sym}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#16243c] text-[#94a3b8]">
                        {s.ex}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748b] truncate mt-0.5 font-sans">
                      {s.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="px-3.5 py-2 bg-[#070d19]/80 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
            <span>StockSense AI Quant Engine • Real-time Data Provider</span>
            <span className="text-[#22d3ee]">NSE / BSE / NASDAQ</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearchBar;
