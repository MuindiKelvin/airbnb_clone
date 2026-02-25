import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';
import LanguageIcon from '@material-ui/icons/Language';
import MenuIcon from '@material-ui/icons/Menu';
import { Avatar } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Link, useHistory } from 'react-router-dom';

const REGIONS = [
  { label: "I'm flexible",  img: 'https://a0.muscache.com/im/pictures/48b55f09-f51c-4e03-b1ee-3e5eca958d37.jpg?im_w=320' },
  { label: 'Africa',         img: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=320&q=80' },
  { label: 'Kenya',          img: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=320&q=80' },
  { label: 'Europe',         img: 'https://a0.muscache.com/im/pictures/ea5598d7-2b07-4ed7-84da-d1eabd9f2714.jpg?im_w=320' },
  { label: 'United Kingdom', img: 'https://a0.muscache.com/im/pictures/4e762891-75a3-4fe1-b73a-cd7e673ba915.jpg?im_w=320' },
  { label: 'United States',  img: 'https://a0.muscache.com/im/pictures/26891a81-b9db-4a9c-8aab-63486b7e627c.jpg?im_w=320' },
  { label: 'Asia',           img: 'https://a0.muscache.com/im/pictures/a78c9850-5f4d-4b8e-9e23-6a3a6f58b81e.jpg?im_w=320' },
  { label: 'Canada',         img: 'https://a0.muscache.com/im/pictures/4871c144-3e4d-42e9-a1f1-f59896dda0fb.jpg?im_w=320' },
  { label: 'Middle East',    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=320&q=80' },
];

function Header() {
  const history  = useHistory();
  const panelRef = useRef(null);

  const [activePanel, setActivePanel] = useState(null);
  const [location,    setLocation]    = useState('');
  const [guests,      setGuests]      = useState(1);
  const [startDate,   setStartDate]   = useState(new Date());
  const [endDate,     setEndDate]     = useState(new Date());

  const selectionRange = { startDate, endDate, key: 'selection' };
  const fmt    = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const isoFmt = (d) => d.toISOString().split('T')[0];
  const datesSet = startDate.getTime() !== endDate.getTime();

  const handleDateSelect = ({ selection }) => {
    setStartDate(selection.startDate);
    setEndDate(selection.endDate);
  };

  const handleSearch = () => {
    setActivePanel(null);
    const params = new URLSearchParams({
      location: location.trim() || 'London',
      checkIn:  isoFmt(startDate),
      checkOut: isoFmt(endDate),
      guests,
    });
    history.push(`/search?${params}`);
  };

  useEffect(() => {
    const fn = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setActivePanel(null);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const isActive = activePanel !== null;

  return (
    <header className={`header ${isActive ? 'header--expanded' : ''}`} ref={panelRef}>

      {/* ── Logo ─────────────────────────────── */}
      <Link to='/' className='header__logo' onClick={() => setActivePanel(null)}>
        <svg viewBox='0 0 32 32' className='header__logoIcon'>
          <path d='M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.09 12.54 7.96 16.512l.904 1.917c.539 1.101.773 1.693.773 2.56 0 1.496-.913 2.916-2.163 3.723C26.998 30.811 25.883 31 24.77 31c-1.674 0-3.034-.498-4.315-1.602l-.538-.476c-.349-.32-.638-.607-.921-.907l-3.009-3.226-.437.462c-1.208 1.31-2.768 2.96-4.93 4.121C9.765 30.34 8.58 31 7.373 31c-1.275 0-2.486-.374-3.508-1.115C2.753 29.05 2 27.847 2 26.383c0-.986.391-1.994 1.235-3.503l1.069-1.86C5.765 18.016 10.41 9.166 12.26 5.602L12.786 4.6C14.126 2.119 15.454 1 16 1zm0 2c-.31 0-1.17.535-2.243 2.501L13.23 6.5c-1.84 3.546-6.475 12.381-7.99 15.215l-1.052 1.83c-.647 1.145-.987 1.859-.987 2.838 0 .897.44 1.715 1.165 2.266.598.444 1.315.71 2.007.71.832 0 1.625-.391 2.707-1.006 1.817-1.026 3.186-2.48 4.273-3.66l1.17-1.265 1.174 1.258c.371.4.714.737 1.095 1.086l.527.467c1.05.892 2.013 1.26 3.328 1.26.822 0 1.618-.16 2.214-.535.85-.547 1.434-1.44 1.434-2.388 0-.623-.175-1.078-.608-1.985l-.919-1.951c-1.882-3.997-6.024-12.714-7.962-16.512L17.24 3.5C16.17 1.535 15.31 1 15.999 3z'/>
        </svg>
      </Link>

      {/* ── Search pill ──────────────────────── */}
      <div className={`header__search ${isActive ? 'header__search--open' : ''}`}>
        <button
          className={`header__field ${activePanel === 'location' ? 'header__field--active' : ''}`}
          onClick={() => setActivePanel(activePanel === 'location' ? null : 'location')}
        >
          <span className='header__fieldLabel'>Where</span>
          <span className='header__fieldValue'>{location || 'Search destinations'}</span>
        </button>

        <div className='header__sep'/>

        <button
          className={`header__field ${activePanel === 'dates' ? 'header__field--active' : ''}`}
          onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}
        >
          <span className='header__fieldLabel'>Check in</span>
          <span className='header__fieldValue'>{datesSet ? fmt(startDate) : 'Add dates'}</span>
        </button>

        <div className='header__sep'/>

        <button
          className={`header__field ${activePanel === 'dates' ? 'header__field--active' : ''}`}
          onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}
        >
          <span className='header__fieldLabel'>Check out</span>
          <span className='header__fieldValue'>{datesSet ? fmt(endDate) : 'Add dates'}</span>
        </button>

        <div className='header__sep'/>

        <button
          className={`header__field header__field--last ${activePanel === 'guests' ? 'header__field--active' : ''}`}
          onClick={() => setActivePanel(activePanel === 'guests' ? null : 'guests')}
        >
          <div className='header__fieldInner'>
            <span className='header__fieldLabel'>Who</span>
            <span className='header__fieldValue header__fieldValue--faded'>
              {`${guests} guest${guests !== 1 ? 's' : ''}`}
            </span>
          </div>
          <button
            className={`header__searchBtn ${isActive ? 'header__searchBtn--wide' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleSearch(); }}
            aria-label='Search'
          >
            <SearchIcon style={{ fontSize: 16 }}/>
            {isActive && <span className='header__searchBtnText'>Search</span>}
          </button>
        </button>
      </div>

      {/* ── Right nav ────────────────────────── */}
      <nav className='header__right'>
        <button className='header__hostLink'>Airbnb your home</button>
        <button className='header__iconBtn'><LanguageIcon style={{ fontSize: 18 }}/></button>
        <button className='header__profileBtn'>
          <MenuIcon style={{ fontSize: 18 }}/>
          <Avatar style={{ width: 30, height: 30, backgroundColor: '#717171' }}/>
        </button>
      </nav>

      {/* ── Location panel ───────────────────── */}
      {activePanel === 'location' && (
        <div className='header__panel header__panel--location'>
          <div className='header__locationSearch'>
            <SearchIcon style={{ fontSize: 18, color: '#717171' }}/>
            <input
              autoFocus
              placeholder='Search destinations'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setActivePanel('dates')}
            />
          </div>
          <p className='header__panelHint'>Search by region</p>
          <div className='header__regionGrid'>
            {REGIONS.map(({ label, img }) => (
              <button
                key={label}
                className='header__region'
                onClick={() => {
                  setLocation(label === "I'm flexible" ? '' : label);
                  setActivePanel('dates');
                }}
              >
                <img src={img} alt={label}/>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Dates panel ──────────────────────── */}
      {activePanel === 'dates' && (
        <div className='header__panel header__panel--dates'>
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleDateSelect}
            months={2}
            direction='horizontal'
            showDateDisplay={false}
            rangeColors={['#ff385c']}
            minDate={new Date()}
          />
          <div className='header__panelActions'>
            <button className='header__panelSkip' onClick={() => { setStartDate(new Date()); setEndDate(new Date()); }}>
              Clear dates
            </button>
            <button className='header__panelNext' onClick={() => setActivePanel('guests')}>Next →</button>
          </div>
        </div>
      )}

      {/* ── Guests panel ─────────────────────── */}
      {activePanel === 'guests' && (
        <div className='header__panel header__panel--guests'>
          <div className='header__guestRow'>
            <div>
              <p className='header__guestType'>Guests</p>
              <p className='header__guestSub'>Adults, children & infants</p>
            </div>
            <div className='header__guestCounter'>
              <button disabled={guests <= 1} onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
              <span>{guests}</span>
              <button onClick={() => setGuests(guests + 1)}>+</button>
            </div>
          </div>
          <div className='header__panelActions'>
            <button className='header__panelSkip' onClick={() => setGuests(1)}>Clear</button>
            <button className='header__panelNext' onClick={handleSearch}>Search →</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;