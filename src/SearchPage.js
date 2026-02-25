import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './SearchPage.css';
import SearchResult from './SearchResult';
import { searchListings } from './airbnbApi';

// ── Parse URL query params ────────────────────────────────────────
function useSearchParams() {
  const { search } = useLocation();
  const p = new URLSearchParams(search);
  const parseDate = (str) => {
    if (!str) return new Date();
    const d = new Date(str);
    return isNaN(d) ? new Date() : d;
  };
  return {
    location: p.get('location') || 'London',
    checkIn:  parseDate(p.get('checkIn')),
    checkOut: parseDate(p.get('checkOut')),
    guests:   parseInt(p.get('guests'), 10) || 1,
  };
}

// ── Skeleton card ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className='skeleton'>
      <div className='skeleton__img' />
      <div className='skeleton__body'>
        <div className='skeleton__line skeleton__line--sm' />
        <div className='skeleton__line skeleton__line--lg' />
        <div className='skeleton__line skeleton__line--md' />
        <div className='skeleton__line skeleton__line--sm' style={{ marginTop: 'auto', width: '28%' }} />
      </div>
    </div>
  );
}

// ── Counter sub-component (for Rooms & Beds) ──────────────────────
function Counter({ label, sub, value, onChange, min = 0 }) {
  return (
    <div className='filterPanel__row'>
      <div>
        <p className='filterPanel__rowLabel'>{label}</p>
        {sub && <p className='filterPanel__rowSub'>{sub}</p>}
      </div>
      <div className='filterPanel__counter'>
        <button
          className='filterPanel__counterBtn'
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >−</button>
        <span className='filterPanel__counterVal'>
          {value === 0 ? 'Any' : value === 8 ? '8+' : value}
        </span>
        <button
          className='filterPanel__counterBtn'
          disabled={value >= 8}
          onClick={() => onChange(Math.min(8, value + 1))}
        >+</button>
      </div>
    </div>
  );
}

// ── Default filter state ──────────────────────────────────────────
const DEFAULT_FILTERS = {
  cancelFree: false,
  placeTypes: [],        // 'entire place' | 'private room' | 'shared room'
  priceMin: 0,
  priceMax: 1000,
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
};

// ── Main component ────────────────────────────────────────────────
function SearchPage() {
  const history = useHistory();
  const params  = useSearchParams();

  const [allResults,   setAllResults]   = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [source,       setSource]       = useState(null);
  const [openFilter,   setOpenFilter]   = useState(null); // which panel is open
  const [filters,      setFilters]      = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS); // pending changes
  const panelRef = useRef(null);

  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

  // ── Fetch ───────────────────────────────────────────────────────
  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchListings(params);
      setAllResults(data.results);
      setTotal(data.total);
      setSource(data.source);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line
  }, [params.location, params.checkIn?.toDateString(), params.checkOut?.toDateString(), params.guests]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  // ── Close panel on outside click ────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpenFilter(null);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // ── Apply filters client-side ───────────────────────────────────
  const filtered = allResults.filter((r) => {
    if (filters.cancelFree && !r.cancelFree) return false;
    if (filters.placeTypes.length > 0) {
      const match = filters.placeTypes.some((pt) =>
        (r.placeType || r.location || '').toLowerCase().includes(pt)
      );
      if (!match) return false;
    }
    if (r.priceNum !== null) {
      if (r.priceNum < filters.priceMin || r.priceNum > filters.priceMax) return false;
    }
    if (filters.bedrooms  > 0 && (r.bedrooms  ?? 0) < filters.bedrooms)  return false;
    if (filters.beds      > 0 && (r.beds      ?? 0) < filters.beds)      return false;
    if (filters.bathrooms > 0 && (r.bathrooms ?? 0) < filters.bathrooms) return false;
    return true;
  });

  // ── Active filter count ─────────────────────────────────────────
  const activeCount = (f) => {
    if (f === 'cancel')   return filters.cancelFree ? 1 : 0;
    if (f === 'type')     return filters.placeTypes.length;
    if (f === 'price')    return (filters.priceMin > 0 || filters.priceMax < 1000) ? 1 : 0;
    if (f === 'rooms')    return [filters.bedrooms, filters.beds, filters.bathrooms].filter(v => v > 0).length;
    if (f === 'more') {
      return [filters.cancelFree, filters.placeTypes.length > 0,
        filters.priceMin > 0, filters.priceMax < 1000,
        filters.bedrooms > 0, filters.beds > 0, filters.bathrooms > 0].filter(Boolean).length;
    }
    return 0;
  };

  // ── Open a panel (copy current filters to draft) ────────────────
  const openPanel = (name) => {
    setDraftFilters({ ...filters });
    setOpenFilter(openFilter === name ? null : name);
  };

  // ── Apply draft → actual ────────────────────────────────────────
  const applyFilters = () => {
    setFilters({ ...draftFilters });
    setOpenFilter(null);
  };

  // ── Clear one filter group ──────────────────────────────────────
  const clearFilter = (f) => {
    const updates = {};
    if (f === 'cancel')  updates.cancelFree = false;
    if (f === 'type')    updates.placeTypes = [];
    if (f === 'price')   { updates.priceMin = 0; updates.priceMax = 1000; }
    if (f === 'rooms')   { updates.bedrooms = 0; updates.beds = 0; updates.bathrooms = 0; }
    if (f === 'more')    Object.assign(updates, DEFAULT_FILTERS);
    setFilters(prev => ({ ...prev, ...updates }));
    setOpenFilter(null);
  };

  const clearAll = () => { setFilters(DEFAULT_FILTERS); setOpenFilter(null); };

  const anyActive = Object.keys(DEFAULT_FILTERS).some((k) => {
    if (k === 'priceMin') return filters.priceMin > 0;
    if (k === 'priceMax') return filters.priceMax < 1000;
    if (Array.isArray(filters[k])) return filters[k].length > 0;
    return filters[k] !== DEFAULT_FILTERS[k];
  });

  // ── Toggle place type in draft ──────────────────────────────────
  const togglePlaceType = (type) => {
    setDraftFilters(prev => ({
      ...prev,
      placeTypes: prev.placeTypes.includes(type)
        ? prev.placeTypes.filter(t => t !== type)
        : [...prev.placeTypes, type],
    }));
  };

  // ── Pill helper ─────────────────────────────────────────────────
  const FilterBtn = ({ id, label }) => {
    const count = activeCount(id);
    const isOpen = openFilter === id;
    return (
      <button
        className={`searchPage__filter ${count > 0 ? 'searchPage__filter--active' : ''} ${isOpen ? 'searchPage__filter--open' : ''}`}
        onClick={() => openPanel(id)}
      >
        {label}
        {count > 0 && <span className='searchPage__filterBadge'>{count}</span>}
        <span className='searchPage__filterChevron'>{isOpen ? '▲' : '▼'}</span>
      </button>
    );
  };

  return (
    <div className='searchPage'>
      {/* ── Info bar ──────────────────────────────────────────────── */}
      <div className='searchPage__info'>
        {!loading && (
          <p className='searchPage__meta'>
            {filtered.length !== total
              ? `${filtered.length} of ${total.toLocaleString()} stays`
              : `${total.toLocaleString()} stays`}
            {params.checkIn && params.checkOut && ` · ${fmt(params.checkIn)} – ${fmt(params.checkOut)}`}
            {` · ${params.guests} guest${params.guests !== 1 ? 's' : ''}`}
          </p>
        )}
        <h1 className='searchPage__title'>
          {loading ? <span className='searchPage__titleLoading'>Finding stays in {params.location}…</span>
            : error ? 'Something went wrong'
            : `Stays in ${params.location}`}
        </h1>

        {/* Mock notice */}
        {source === 'mock' && !loading && (
          <div className='searchPage__mockBanner'>
            <span>💡</span>
            <div>
              <strong>Showing sample listings</strong> — RapidAPI quota exhausted or key missing.{' '}
              <a href='https://rapidapi.com/3b-data-3b-data-default/api/airbnb13' target='_blank' rel='noreferrer'>
                Upgrade for live data →
              </a>
            </div>
          </div>
        )}

        {/* ── Filter bar ─────────────────────────────────────────── */}
        <div className='searchPage__filterBar' ref={panelRef}>
          <div className='searchPage__filters'>
            <FilterBtn id='cancel' label='Free Cancellation' />
            <FilterBtn id='type'   label='Type of Place' />
            <FilterBtn id='price'  label='Price' />
            <FilterBtn id='rooms'  label='Rooms & Beds' />
            {anyActive && (
              <button className='searchPage__clearAll' onClick={clearAll}>
                Clear all filters
              </button>
            )}
          </div>

          {/* ── Cancellation panel ─────────────────────────────────── */}
          {openFilter === 'cancel' && (
            <div className='filterPanel filterPanel--sm'>
              <h3 className='filterPanel__title'>Cancellation flexibility</h3>
              <label className='filterPanel__toggle'>
                <div className='filterPanel__toggleInfo'>
                  <p className='filterPanel__toggleLabel'>Free cancellation</p>
                  <p className='filterPanel__toggleSub'>Show only listings with free cancellation</p>
                </div>
                <div
                  className={`filterPanel__switch ${draftFilters.cancelFree ? 'filterPanel__switch--on' : ''}`}
                  onClick={() => setDraftFilters(p => ({ ...p, cancelFree: !p.cancelFree }))}
                >
                  <div className='filterPanel__switchThumb' />
                </div>
              </label>
              <div className='filterPanel__actions'>
                <button className='filterPanel__clear' onClick={() => clearFilter('cancel')}>Clear</button>
                <button className='filterPanel__apply' onClick={applyFilters}>Show results</button>
              </div>
            </div>
          )}

          {/* ── Type of Place panel ────────────────────────────────── */}
          {openFilter === 'type' && (
            <div className='filterPanel filterPanel--type'>
              <h3 className='filterPanel__title'>Type of place</h3>
              <div className='filterPanel__typeGrid'>
                {[
                  { key: 'entire place', label: 'Entire place', icon: '🏠', sub: 'A place all to yourself' },
                  { key: 'private room', label: 'Private room', icon: '🚪', sub: 'Your own room in a home or hotel' },
                  { key: 'shared room',  label: 'Shared room',  icon: '🛏️', sub: 'A sleeping space and common areas shared' },
                ].map(({ key, label, icon, sub }) => (
                  <button
                    key={key}
                    className={`filterPanel__typeCard ${draftFilters.placeTypes.includes(key) ? 'filterPanel__typeCard--active' : ''}`}
                    onClick={() => togglePlaceType(key)}
                  >
                    <span className='filterPanel__typeIcon'>{icon}</span>
                    <span className='filterPanel__typeLabel'>{label}</span>
                    <span className='filterPanel__typeSub'>{sub}</span>
                  </button>
                ))}
              </div>
              <div className='filterPanel__actions'>
                <button className='filterPanel__clear' onClick={() => clearFilter('type')}>Clear</button>
                <button className='filterPanel__apply' onClick={applyFilters}>Show results</button>
              </div>
            </div>
          )}

          {/* ── Price panel ────────────────────────────────────────── */}
          {openFilter === 'price' && (
            <div className='filterPanel filterPanel--price'>
              <h3 className='filterPanel__title'>Price per night</h3>
              <div className='filterPanel__priceDisplay'>
                <div className='filterPanel__priceField'>
                  <label>Minimum</label>
                  <div className='filterPanel__priceInput'>
                    <span>$</span>
                    <input
                      type='number'
                      min={0}
                      max={draftFilters.priceMax - 10}
                      value={draftFilters.priceMin}
                      onChange={(e) => setDraftFilters(p => ({ ...p, priceMin: Math.max(0, +e.target.value) }))}
                    />
                  </div>
                </div>
                <div className='filterPanel__priceDash'>—</div>
                <div className='filterPanel__priceField'>
                  <label>Maximum</label>
                  <div className='filterPanel__priceInput'>
                    <span>$</span>
                    <input
                      type='number'
                      min={draftFilters.priceMin + 10}
                      max={1000}
                      value={draftFilters.priceMax}
                      onChange={(e) => setDraftFilters(p => ({ ...p, priceMax: Math.min(1000, +e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
              <div className='filterPanel__rangeWrap'>
                <input
                  type='range' min={0} max={990}
                  value={draftFilters.priceMin}
                  onChange={(e) => setDraftFilters(p => ({ ...p, priceMin: Math.min(+e.target.value, p.priceMax - 10) }))}
                  className='filterPanel__range filterPanel__rangeMin'
                />
                <input
                  type='range' min={10} max={1000}
                  value={draftFilters.priceMax}
                  onChange={(e) => setDraftFilters(p => ({ ...p, priceMax: Math.max(+e.target.value, p.priceMin + 10) }))}
                  className='filterPanel__range filterPanel__rangeMax'
                />
                <div
                  className='filterPanel__rangeTrack'
                  style={{
                    left:  `${(draftFilters.priceMin / 1000) * 100}%`,
                    right: `${100 - (draftFilters.priceMax / 1000) * 100}%`,
                  }}
                />
              </div>
              <p className='filterPanel__rangeHint'>
                ${draftFilters.priceMin} – ${draftFilters.priceMax === 1000 ? '1,000+' : draftFilters.priceMax}
              </p>
              <div className='filterPanel__actions'>
                <button className='filterPanel__clear' onClick={() => clearFilter('price')}>Clear</button>
                <button className='filterPanel__apply' onClick={applyFilters}>Show results</button>
              </div>
            </div>
          )}

          {/* ── Rooms & Beds panel ─────────────────────────────────── */}
          {openFilter === 'rooms' && (
            <div className='filterPanel filterPanel--rooms'>
              <h3 className='filterPanel__title'>Rooms and beds</h3>
              <Counter label='Bedrooms' value={draftFilters.bedrooms} min={0}
                onChange={(v) => setDraftFilters(p => ({ ...p, bedrooms: v }))} />
              <Counter label='Beds'     value={draftFilters.beds}     min={0}
                onChange={(v) => setDraftFilters(p => ({ ...p, beds: v }))} />
              <Counter label='Bathrooms' value={draftFilters.bathrooms} min={0}
                onChange={(v) => setDraftFilters(p => ({ ...p, bathrooms: v }))} />
              <div className='filterPanel__actions'>
                <button className='filterPanel__clear' onClick={() => clearFilter('rooms')}>Clear</button>
                <button className='filterPanel__apply' onClick={applyFilters}>Show results</button>
              </div>
            </div>
          )}
        </div>
        {/* Active filter summary */}
        {anyActive && !loading && (
          <p className='searchPage__filterSummary'>
            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} with active filters
          </p>
        )}
      </div>

      {/* ── Error ─────────────────────────────────────────────────── */}
      {error && !loading && (
        <div className='searchPage__error'>
          <div className='searchPage__errorIcon'>⚠️</div>
          <p>{error}</p>
          <div className='searchPage__errorActions'>
            <button onClick={fetchResults}>Try again</button>
            <button className='searchPage__errorSecondary' onClick={() => history.push('/')}>← Back</button>
          </div>
        </div>
      )}

      {/* ── Skeletons ─────────────────────────────────────────────── */}
      {loading && (
        <div className='searchPage__results'>
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────── */}
      {!loading && !error && filtered.length > 0 && (
        <div className='searchPage__results'>
          {filtered.map((r, i) => <SearchResult key={r.id} delay={i} {...r} />)}
        </div>
      )}

      {/* ── No results ────────────────────────────────────────────── */}
      {!loading && !error && filtered.length === 0 && (
        <div className='searchPage__empty'>
          <div className='searchPage__emptyIcon'>🔍</div>
          <h3>{allResults.length > 0 ? 'No results match your filters' : 'No listings found'}</h3>
          <p>
            {allResults.length > 0
              ? 'Try adjusting or clearing your filters.'
              : 'Try a different destination or adjust your dates.'}
          </p>
          {allResults.length > 0
            ? <button onClick={clearAll}>Clear all filters</button>
            : <button onClick={() => history.push('/')}>Search again</button>}
        </div>
      )}
    </div>
  );
}

export default SearchPage;