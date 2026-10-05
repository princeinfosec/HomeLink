import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { INDIA_LOCATIONS, CITY_TO_STATE } from '../data/indiaLocations';

const norm = (s) => s.toLowerCase().trim();

/* ───────────── Panel: search + State list → City list ───────────── */
export function LocationPickerPanel({ onDone, className = '' }) {
  const { selectedCity, changeCity, userLocation, detectLocation } = useApp();
  const [query, setQuery] = useState('');
  const [activeState, setActiveState] = useState(null); // state name or null
  const inputRef = useRef(null);

  const selectedState = CITY_TO_STATE[selectedCity] || null;
  const q = norm(query);

  const pick = (cityId) => {
    changeCity(cityId);
    onDone?.();
  };

  const stateObj = activeState ? INDIA_LOCATIONS.find((s) => s.state === activeState) : null;

  // Global search (no state opened): matching states + matching cities
  const results = useMemo(() => {
    if (!q || stateObj) return null;
    const states = INDIA_LOCATIONS.filter((s) => norm(s.state).includes(q));
    const cities = [];
    INDIA_LOCATIONS.forEach((s) =>
      s.cities.forEach((c) => {
        if (norm(c).includes(q)) cities.push({ city: c, state: s.state });
      })
    );
    return { states, cities: cities.slice(0, 60) };
  }, [q, stateObj]);

  const visibleCities = stateObj
    ? stateObj.cities.filter((c) => !q || norm(c).includes(q))
    : [];

  const openState = (name) => {
    setActiveState(name);
    setQuery('');
    inputRef.current?.focus();
  };

  const rowBase =
    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer';

  const CityRow = ({ city, state }) => {
    const isSel = selectedCity === city;
    return (
      <button
        key={city + state}
        onClick={() => pick(city)}
        className={`${rowBase} ${isSel ? 'bg-primary-container/15 text-primary' : 'hover:bg-surface-container text-on-surface'}`}
      >
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isSel ? 'bg-primary-container text-white' : 'bg-surface-container text-outline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">location_city</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold truncate">{city}</span>
          {state && <span className="block text-[11px] text-outline font-medium truncate">{state}</span>}
        </span>
        {isSel && <span className="material-symbols-outlined text-lg text-primary-container shrink-0">check_circle</span>}
      </button>
    );
  };

  const StateRow = ({ s }) => {
    const isSel = selectedState === s.state;
    return (
      <button
        key={s.state}
        onClick={() => openState(s.state)}
        className={`${rowBase} ${isSel ? 'bg-primary-container/10' : 'hover:bg-surface-container'}`}
      >
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isSel ? 'bg-primary-container text-white' : 'bg-secondary-container/50 text-secondary'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold text-on-surface truncate">{s.state}</span>
          <span className="block text-[11px] text-outline font-medium">{s.cities.length} cities</span>
        </span>
        <span className="material-symbols-outlined text-lg text-outline shrink-0">chevron_right</span>
      </button>
    );
  };

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      {/* Title */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {stateObj && (
            <button
              onClick={() => {
                setActiveState(null);
                setQuery('');
              }}
              className="w-8 h-8 -ml-1 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface cursor-pointer shrink-0"
              aria-label="Back to states"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
          )}
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-on-surface truncate">
              {stateObj ? stateObj.state : 'Select Location'}
            </p>
            <p className="text-[11px] text-outline font-medium truncate">
              {stateObj ? `Choose a city (${stateObj.cities.length})` : 'Pick a state, then a city'}
            </p>
          </div>
        </div>
        {onDone && (
          <button
            onClick={onDone}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-surface-container border border-transparent focus-within:border-primary-container focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container/15 transition-all">
          <span className="material-symbols-outlined text-lg text-outline">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={stateObj ? `Search city in ${stateObj.state}…` : 'Search state or city…'}
            className="flex-1 min-w-0 bg-transparent text-[14px] font-semibold text-on-surface placeholder:text-outline/70 placeholder:font-normal focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-outline hover:text-on-surface cursor-pointer" aria-label="Clear">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {!stateObj && !q && (
        <div className="px-3 pb-2 grid grid-cols-2 gap-2 shrink-0">
          <button
            onClick={async () => {
              try {
                await detectLocation();
                onDone?.();
              } catch (e) {
                /* error shown below */
              }
            }}
            disabled={userLocation?.isDetecting}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-container/10 hover:bg-primary-container/20 border border-primary-container/25 text-primary text-xs font-bold cursor-pointer active:scale-[0.98] transition-all"
          >
            <span className={`material-symbols-outlined text-lg text-primary-container ${userLocation?.isDetecting ? 'animate-spin' : ''}`}>
              {userLocation?.isDetecting ? 'progress_activity' : 'near_me'}
            </span>
            <span className="truncate">{userLocation?.isDetecting ? 'Locating…' : 'Use GPS'}</span>
          </button>
          <button
            onClick={() => pick('All Cities')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer active:scale-[0.98] transition-all ${
              selectedCity === 'All Cities'
                ? 'bg-primary-container/15 border-primary-container/40 text-primary'
                : 'bg-surface-container-low border-outline-variant/40 text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-lg text-primary-container">public</span>
            <span className="truncate">All India</span>
          </button>
          {userLocation?.error && (
            <p className="col-span-2 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {userLocation.error}
            </p>
          )}
        </div>
      )}

      {/* List */}
      <div className="hl-scroll flex-1 min-h-0 overflow-y-auto px-2 pb-3 space-y-0.5 border-t border-outline-variant/30 pt-2">
        {stateObj ? (
          visibleCities.length ? (
            visibleCities.map((c) => <CityRow key={c} city={c} state={null} />)
          ) : (
            <Empty text={`No city matches “${query}” in ${stateObj.state}`} />
          )
        ) : results ? (
          results.states.length + results.cities.length === 0 ? (
            <Empty text={`No state or city matches “${query}”`} />
          ) : (
            <>
              {results.states.length > 0 && <SectionLabel>States</SectionLabel>}
              {results.states.map((s) => <StateRow key={s.state} s={s} />)}
              {results.cities.length > 0 && <SectionLabel>Cities</SectionLabel>}
              {results.cities.map((r) => <CityRow key={r.city + r.state} city={r.city} state={r.state} />)}
            </>
          )
        ) : (
          <>
            <SectionLabel>All States & Union Territories</SectionLabel>
            {INDIA_LOCATIONS.map((s) => <StateRow key={s.state} s={s} />)}
          </>
        )}
      </div>
    </div>
  );
}

const SectionLabel = ({ children }) => (
  <p className="px-3 pt-1.5 pb-1 text-[10.5px] font-extrabold uppercase tracking-wider text-outline">{children}</p>
);

const Empty = ({ text }) => (
  <div className="py-10 text-center text-xs font-semibold text-outline">
    <span className="material-symbols-outlined text-3xl block mb-1 text-outline/50">search_off</span>
    {text}
  </div>
);

/* ───────────── Trigger + popover (desktop) / bottom sheet (mobile) ───────────── */
function useIsMobile(max = 640) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < max : false));
  useEffect(() => {
    const on = () => setM(window.innerWidth < max);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [max]);
  return m;
}

export default function LocationPicker({ variant = 'field', className = '' }) {
  const { selectedCity, userLocation } = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!isMobile && wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (!(open && isMobile)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  const isAll = !selectedCity || selectedCity === 'All Cities';
  const state = CITY_TO_STATE[selectedCity];
  const label =
    userLocation?.detected && userLocation?.locality && selectedCity === userLocation?.cityId
      ? userLocation.locality
      : isAll
        ? 'All India'
        : selectedCity;

  const trigger =
    variant === 'pill' ? (
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold border border-outline-variant/40 transition-all cursor-pointer shadow-2xs"
        title="Change location"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${userLocation?.detected ? 'bg-emerald-500' : 'bg-primary-container animate-pulse'}`} />
        <span className="text-on-surface font-extrabold max-w-[130px] truncate">{label}</span>
        <span className={`material-symbols-outlined text-[16px] text-outline transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
    ) : (
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 h-11 pl-2.5 pr-3 rounded-xl bg-surface-container-lowest border text-left cursor-pointer transition-all shadow-2xs ${
          open ? 'border-primary-container ring-4 ring-primary-container/15' : 'border-outline-variant/50 hover:border-primary-container/60'
        }`}
      >
        <span className="w-7 h-7 rounded-lg bg-primary-container/15 text-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-outline">Location</span>
          <span className="block text-[13px] font-bold text-on-surface truncate">
            {label}
            {!isAll && state && <span className="text-outline font-semibold">, {state}</span>}
          </span>
        </span>
        <span className={`material-symbols-outlined text-xl text-outline transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
    );

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {trigger}

      {open && !isMobile && (
        <div className="absolute left-0 top-full mt-2 w-[min(92vw,400px)] h-[480px] flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          <LocationPickerPanel onDone={() => setOpen(false)} className="h-full" />
        </div>
      )}

      {open &&
        isMobile &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-end">
            <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-150" onClick={() => setOpen(false)} />
            <div className="relative w-full h-[82dvh] flex flex-col bg-surface-container-lowest rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-200 pb-[env(safe-area-inset-bottom)]">
              <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto mt-2 shrink-0" />
              <LocationPickerPanel onDone={() => setOpen(false)} className="flex-1" />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
