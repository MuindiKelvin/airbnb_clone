// ─── src/airbnbApi.js ────────────────────────────────────────────
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY || '';
const BASE         = 'https://airbnb13.p.rapidapi.com';
const CACHE_PREFIX = 'airbnb_cache_v2_';

const apiHeaders = {
  'X-RapidAPI-Key':  RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com',
};

const isoDate = (d) => {
  if (!d || !(d instanceof Date) || isNaN(d)) {
    const fallback = new Date();
    return fallback.toISOString().split('T')[0];
  }
  return d.toISOString().split('T')[0];
};

// ── SessionStorage cache (5 min TTL) ─────────────────────────────
function getCached(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > 5 * 60 * 1000) return null;
    return data;
  } catch { return null; }
}
function setCache(key, data) {
  try { sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() })); }
  catch { /* quota full */ }
}

// ── searchListings ────────────────────────────────────────────────
export async function searchListings({ location, checkIn, checkOut, guests = 1, currency = 'USD' }) {
  const cacheKey = `${location}_${isoDate(checkIn)}_${isoDate(checkOut)}_${guests}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log('[airbnbApi] Serving from cache');
    return cached;
  }

  // ── No key: use mock ──────────────────────────────────────────
  if (!RAPIDAPI_KEY) {
    console.warn('[airbnbApi] No API key — using mock data');
    return getMockData(location, guests);
  }

  // ── Live API call ─────────────────────────────────────────────
  const today     = new Date();
  const safeIn    = checkIn  instanceof Date && !isNaN(checkIn)  ? checkIn  : today;
  const safeOut   = checkOut instanceof Date && !isNaN(checkOut) && checkOut > safeIn
    ? checkOut : new Date(safeIn.getTime() + 86400000 * 3);

  const params = new URLSearchParams({
    location,
    checkin:  isoDate(safeIn),
    checkout: isoDate(safeOut),
    adults:   Math.max(1, parseInt(guests, 10)),
    currency,
    page:     1,
  });

  try {
    const res = await fetch(`${BASE}/search-location?${params}`, { headers: apiHeaders });
    const body = await res.json().catch(() => ({}));

    if (res.status === 429) {
      console.warn('[airbnbApi] Rate limited (429) — using mock fallback');
      return getMockData(location, guests);
    }
    if (res.status === 401 || res.status === 403) {
      console.error('[airbnbApi] Auth error — check your RapidAPI key');
      return getMockData(location, guests);
    }
    if (!res.ok) {
      console.warn(`[airbnbApi] HTTP ${res.status} — using mock fallback`);
      return getMockData(location, guests);
    }

    const results = (body.results || []).map(normalise);
    const out = { results, total: body.count || results.length, source: 'live' };
    setCache(cacheKey, out);
    console.log(`[airbnbApi] Live: ${results.length} listings for "${location}"`);
    return out;

  } catch (networkErr) {
    console.warn('[airbnbApi] Network error — using mock fallback', networkErr);
    return getMockData(location, guests);
  }
}

// ── Normalisers ───────────────────────────────────────────────────
function normalise(item) {
  const priceRate = item.price?.rate ?? item.price?.basePrice ?? null;
  const priceTotal = item.price?.total ?? null;

  return {
    id:          String(item.id),
    type:        item.type        || '',
    city:        item.city        || '',
    location:    [item.type, item.city].filter(Boolean).join(' · '),
    title:       item.name        || 'Airbnb Listing',
    description: buildDesc(item),
    img:         (item.images || [])[0] || item.photo || '',
    images:      item.images      || [],
    star:        typeof item.rating === 'number' ? item.rating : null,
    reviews:     item.reviewsCount ?? 0,
    priceNum:    priceRate ? Math.round(priceRate) : null,
    price:       priceRate  ? `$${Math.round(priceRate)}`  : 'Price on request',
    total:       priceTotal ? `$${Math.round(priceTotal)} total` : '',
    superhost:   item.isSuperhost  || false,
    url:         item.url || `https://www.airbnb.com/rooms/${item.id}`,
    beds:        item.beds      ?? null,
    bedrooms:    item.bedrooms  ?? null,
    bathrooms:   item.bathrooms ?? null,
    persons:     item.persons   ?? null,
    // For filtering
    cancelFree:  item.isCancelable ?? false,
    placeType:   (item.type || '').toLowerCase(),
  };
}

function buildDesc(item) {
  const parts = [];
  if (item.persons)   parts.push(`${item.persons} guest${item.persons !== 1 ? 's' : ''}`);
  if (item.bedrooms)  parts.push(`${item.bedrooms} bedroom${item.bedrooms !== 1 ? 's' : ''}`);
  if (item.beds)      parts.push(`${item.beds} bed${item.beds !== 1 ? 's' : ''}`);
  if (item.bathrooms) parts.push(`${item.bathrooms} bath${item.bathrooms !== 1 ? 's' : ''}`);
  return parts.join(' · ');
}

// ── Mock data (fallback only) ─────────────────────────────────────
export function getMockData(location = 'London', guests = 1) {
  const loc = location.trim() || 'London';
  const g   = Math.max(1, parseInt(guests, 10));

  const listings = [
    {
      id: 'm1', placeType: 'entire place', cancelFree: true,
      location: `Entire flat · ${loc}`,
      title: 'Stylish Modern Apartment in the Heart of the City',
      description: `${g} guest${g>1?'s':''} · 1 bedroom · 1 bed · 1 bath`,
      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      ],
      star: 4.92, reviews: 387, priceNum: 89, price: '$89', total: '$534 total',
      superhost: true, url: 'https://www.airbnb.com', beds: 1, bedrooms: 1, bathrooms: 1, persons: 2,
    },
    {
      id: 'm2', placeType: 'private room', cancelFree: false,
      location: `Private room · ${loc}`,
      title: 'Cosy Edwardian Room with Garden — Walk to Transport',
      description: `${g} guest${g>1?'s':''} · 1 bed · 1 shared bath`,
      img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      ],
      star: 4.78, reviews: 214, priceNum: 45, price: '$45', total: '$270 total',
      superhost: false, url: 'https://www.airbnb.com', beds: 1, bedrooms: 1, bathrooms: 1, persons: 1,
    },
    {
      id: 'm3', placeType: 'entire place', cancelFree: true,
      location: `Entire townhouse · ${loc}`,
      title: 'Stunning 3-Bed Townhouse with Roof Terrace',
      description: `${Math.max(g,4)} guests · 3 bedrooms · 4 beds · 2 baths`,
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      ],
      star: 4.87, reviews: 512, priceNum: 245, price: '$245', total: '$1,470 total',
      superhost: true, url: 'https://www.airbnb.com', beds: 4, bedrooms: 3, bathrooms: 2, persons: 6,
    },
    {
      id: 'm4', placeType: 'entire place', cancelFree: true,
      location: `Entire flat · ${loc} City Centre`,
      title: 'Luxury Penthouse with Panoramic City Views',
      description: `${Math.max(g,2)} guests · 2 bedrooms · 2 beds · 2 baths`,
      img: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80',
      ],
      star: 4.95, reviews: 128, priceNum: 195, price: '$195', total: '$1,170 total',
      superhost: true, url: 'https://www.airbnb.com', beds: 2, bedrooms: 2, bathrooms: 2, persons: 4,
    },
    {
      id: 'm5', placeType: 'entire place', cancelFree: false,
      location: `Entire studio · ${loc}`,
      title: 'Bright Studio Flat — Perfect for Solo Travellers',
      description: `1 guest · Studio · 1 bed · 1 bath`,
      img: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80',
      ],
      star: 4.65, reviews: 89, priceNum: 62, price: '$62', total: '$372 total',
      superhost: false, url: 'https://www.airbnb.com', beds: 1, bedrooms: 0, bathrooms: 1, persons: 1,
    },
    {
      id: 'm6', placeType: 'entire place', cancelFree: true,
      location: `Entire flat · ${loc} East`,
      title: 'Industrial Loft in Vibrant Creative Quarter',
      description: `${Math.max(g,2)} guests · 1 bedroom · 2 beds · 1 bath`,
      img: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
      ],
      star: 4.73, reviews: 301, priceNum: 78, price: '$78', total: '$468 total',
      superhost: false, url: 'https://www.airbnb.com', beds: 2, bedrooms: 1, bathrooms: 1, persons: 3,
    },
    {
      id: 'm7', placeType: 'entire place', cancelFree: true,
      location: `Entire cottage · ${loc} Outskirts`,
      title: 'Charming Country Cottage with Private Garden',
      description: `${Math.max(g,4)} guests · 2 bedrooms · 3 beds · 1 bath`,
      img: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=800&q=80',
        'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80',
      ],
      star: 4.88, reviews: 445, priceNum: 115, price: '$115', total: '$690 total',
      superhost: true, url: 'https://www.airbnb.com', beds: 3, bedrooms: 2, bathrooms: 1, persons: 5,
    },
    {
      id: 'm8', placeType: 'private room', cancelFree: false,
      location: `Private room · ${loc} South`,
      title: 'Bright Room in Charming Victorian House',
      description: `${g} guest${g>1?'s':''} · 1 bed · 2 shared baths`,
      img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'],
      star: 4.61, reviews: 167, priceNum: 38, price: '$38', total: '$228 total',
      superhost: false, url: 'https://www.airbnb.com', beds: 1, bedrooms: 1, bathrooms: 1, persons: 1,
    },
    {
      id: 'm9', placeType: 'shared room', cancelFree: true,
      location: `Shared room · ${loc}`,
      title: 'Friendly Hostel-Style Room — Great for Backpackers',
      description: `${g} guest${g>1?'s':''} · 1 shared bed · shared bath`,
      img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'],
      star: 4.45, reviews: 92, priceNum: 22, price: '$22', total: '$132 total',
      superhost: false, url: 'https://www.airbnb.com', beds: 1, bedrooms: 1, bathrooms: 1, persons: 1,
    },
    {
      id: 'm10', placeType: 'entire place', cancelFree: true,
      location: `Entire flat · ${loc} West`,
      title: 'Chic Designer Flat with Terrace — Near All Amenities',
      description: `${Math.max(g,2)} guests · 1 bedroom · 1 bed · 1 bath`,
      img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      ],
      star: 4.82, reviews: 256, priceNum: 110, price: '$110', total: '$660 total',
      superhost: true, url: 'https://www.airbnb.com', beds: 1, bedrooms: 1, bathrooms: 1, persons: 2,
    },
  ];

  return { results: listings, total: listings.length, source: 'mock' };
}