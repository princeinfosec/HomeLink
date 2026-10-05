import React, { useState, useEffect, useRef } from 'react';

export default function AISearchBar({
  value = '',
  onChange,
  onSubmit,
  onClear,
  placeholderExamples = [
    'Try: furnished room near university under ₹5,000…',
    'Find a room near my college under ₹5,000',
    'Show PGs with Wi-Fi for a female student',
    'Find a furnished room near the railway station',
    'I need a room for two people under ₹8,000'
  ],
  aiLabel = 'Ask HomeLink',
  actions = null,
  suggestions = [],
  onSelectSuggestion,
  className = '',
  size = 'default'
}) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Smoothly rotate realistic natural-language query examples
  useEffect(() => {
    if (value || isFocused || placeholderExamples.length <= 1) return;

    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setExampleIndex((prev) => (prev + 1) % placeholderExamples.length);
        setFadeState('fade-in');
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [value, isFocused, placeholderExamples.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
    inputRef.current?.focus();
  };

  const handleChipClick = (suggestion) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    } else if (onChange) {
      onChange({ target: { value: suggestion } });
      if (onSubmit) {
        setTimeout(() => {
          onSubmit({ preventDefault: () => {} });
        }, 50);
      }
    }
  };

  const isCompact = size === 'compact';

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {/* Compact single-row search bar: never wraps to a second line */}
      <form
        onSubmit={handleSubmit}
        className={`group relative flex items-center gap-1.5 min-w-0 bg-surface-container-lowest rounded-2xl border border-primary-container/30 shadow-xs hover:shadow-sm focus-within:border-primary-container focus-within:ring-4 focus-within:ring-primary-container/15 transition-all duration-200 ${
          isCompact ? 'h-10 pl-2 pr-1' : 'h-11 sm:h-12 pl-2 pr-1.5 sm:pl-2.5'
        }`}
      >
        {/* AI badge: icon only on phones, label from md up */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex items-center justify-center gap-1.5 h-8 min-w-8 px-0 md:px-2.5 rounded-full bg-primary-container/10 border border-primary-container/25 text-primary text-xs font-bold shrink-0 select-none cursor-pointer hover:bg-primary-container/15 transition-colors"
          title="Natural language search powered by HomeLink"
        >
          <span className="material-symbols-outlined text-[18px] text-primary-container leading-none transition-transform group-focus-within:rotate-12">
            auto_awesome
          </span>
          <span className="hidden md:inline whitespace-nowrap">{aiLabel}</span>
        </div>

        {/* Input + rotating placeholder */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholderExamples[exampleIndex] : ''}
            className="w-full min-w-0 text-[14px] sm:text-[15px] font-semibold text-on-surface bg-transparent focus:outline-none placeholder:text-outline/50 placeholder:font-normal placeholder:italic truncate py-1"
          />

          {!value && !isFocused && (
            <div
              onClick={() => inputRef.current?.focus()}
              className={`absolute inset-0 flex items-center pointer-events-none select-none text-[13px] sm:text-sm text-outline/80 overflow-hidden transition-all duration-300 ease-out ${
                fadeState === 'fade-in' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5'
              }`}
            >
              <span className="truncate font-normal italic">{placeholderExamples[exampleIndex]}</span>
            </div>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="w-7 h-7 flex items-center justify-center rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
            title="Clear search"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">close</span>
          </button>
        )}

        {/* Optional actions (Filters, Map) – icon-only on phones */}
        {actions && (
          <div className="flex items-center gap-1 border-l border-outline-variant/30 pl-1.5 shrink-0 [&_button]:h-8 [&_button]:min-w-8 [&_button]:px-2 [&_button]:py-0 [&_button]:rounded-lg">
            {actions}
          </div>
        )}

        {/* Search button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 h-8 sm:h-9 w-8 sm:w-auto sm:px-3.5 rounded-xl bg-primary-container hover:bg-primary active:scale-95 text-on-primary font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer shrink-0"
          title="Search listings"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">search</span>
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Natural Prompt Suggestion Chips */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <div className="flex items-center gap-1 text-outline font-bold text-[11px] shrink-0 select-none pl-1">
            <span className="material-symbols-outlined text-[14px] text-primary-container">temp_preferences_custom</span>
            <span className="hidden sm:inline">Try asking:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(suggestion)}
                className="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary-container/10 border border-primary-container/20 hover:border-primary-container text-on-surface hover:text-primary text-[11px] font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
