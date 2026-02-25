import React, { useState } from 'react';
import './Home.css';
import Banner from './Banner';
import Card from './Card';
import { useHistory } from 'react-router-dom';

// ── Quick-search destination chip ────────────────────────────────
function DestChip({ emoji, label, sub, onClick }) {
  return (
    <button className='home__destChip' onClick={onClick}>
      <span className='home__destEmoji'>{emoji}</span>
      <span className='home__destLabel'>{label}</span>
      {sub && <span className='home__destSub'>{sub}</span>}
    </button>
  );
}

// ── Section header ────────────────────────────────────────────────
function SectionHeader({ title, sub, onSeeAll, seeAllLabel = 'See all' }) {
  return (
    <div className='home__sectionHeader'>
      <div>
        <h2 className='home__sectionTitle'>{title}</h2>
        {sub && <p className='home__sectionSub'>{sub}</p>}
      </div>
      {onSeeAll && (
        <button className='home__seeAll' onClick={onSeeAll}>{seeAllLabel} →</button>
      )}
    </div>
  );
}

function Home() {
  const history = useHistory();
  const [savedCards, setSavedCards] = useState({});

  const search = (location) => {
    const today    = new Date();
    const checkout = new Date(today.getTime() + 3 * 86400000);
    const fmt = (d) => d.toISOString().split('T')[0];
    history.push(`/search?location=${encodeURIComponent(location)}&checkIn=${fmt(today)}&checkOut=${fmt(checkout)}&guests=1`);
  };

  const toggleSave = (id) => setSavedCards(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className='home'>
      <Banner />

      {/* ── Quick destinations ─────────────────────────────────── */}
      <section className='home__quickSearch'>
        <SectionHeader title='Where to next?' sub='Tap a destination to search instantly' />
        <div className='home__destGrid'>
          {[
            { emoji: '🏙️', label: 'Nairobi',    sub: 'Capital city' },
            { emoji: '🏖️', label: 'Mombasa',    sub: 'Coastal paradise' },
            { emoji: '🦁', label: 'Maasai Mara', sub: 'Safari country' },
            { emoji: '🌿', label: 'Diani Beach', sub: 'White sand & sea' },
            { emoji: '🏔️', label: 'Nanyuki',    sub: 'Mt. Kenya foothills' },
            { emoji: '☕', label: 'Kisumu',      sub: 'Lake Victoria' },
            { emoji: '🏞️', label: 'Nakuru',     sub: 'Flamingo lakes' },
            { emoji: '🌍', label: 'London',      sub: 'United Kingdom' },
          ].map(({ emoji, label, sub }) => (
            <DestChip key={label} emoji={emoji} label={label} sub={sub} onClick={() => search(label)} />
          ))}
        </div>
      </section>

      {/* ── Category cards ─────────────────────────────────────── */}
      <section className='home__section'>
        <SectionHeader title='Find your perfect stay' />
        <div className='home__cardGrid home__cardGrid--4'>
          <Card
            src='https://a0.muscache.com/im/pictures/2f13349d-879d-43c6-83e3-8e5679291d53.jpg?im_w=320'
            title='Online Experiences'
            description='Unique activities we can do together, led by a world of hosts.'
          />
          <Card
            src='https://a0.muscache.com/im/pictures/36f53e61-db8d-403c-9122-5b761c0e4264.jpg?im_w=320'
            title='Unique stays'
            description='Spaces that are more than just a place to sleep.'
          />
          <Card
            src='https://a0.muscache.com/im/pictures/7d82ca14-56e5-4465-8218-dcfa7d69b6ac.jpg?im_w=320'
            title='Entire homes'
            description='Comfortable private places, with room for friends and family.'
          />
          <Card
            src='https://a0.muscache.com/im/pictures/10a638e1-6aff-4313-8033-1275cec83987.jpg?im_w=320'
            title='Pets Allowed'
            description='Welcoming stays that love your furry travel companions.'
          />
        </div>
      </section>

      {/* ── Kenya featured ─────────────────────────────────────── */}
      <section className='home__section'>
        <SectionHeader
          title='🇰🇪 Stays in Kenya'
          sub='Handpicked properties from Nairobi to the coast'
          onSeeAll={() => search('Kenya')}
          seeAllLabel='Explore Kenya'
        />
        <div className='home__cardGrid home__cardGrid--3'>
          <Card
            src='https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=600&q=80'
            title='Modern Apartment in Kilimani, Nairobi'
            description='Superhost · Stylish 2-bed flat in the heart of Nairobi&apos;s upmarket suburb'
            price='$55/night'
            badge='🏆 Superhost'
            saved={savedCards['ke1']}
            onSave={() => toggleSave('ke1')}
            onClick={() => search('Nairobi')}
          />
          <Card
            src='https://images.unsplash.com/photo-1596436793513-b8ad7d822062?w=600&q=80'
            title='Beachfront Villa in Diani'
            description='Wake up to the Indian Ocean · private pool · 4 bedrooms'
            price='$210/night'
            badge='🌊 Beachfront'
            saved={savedCards['ke2']}
            onSave={() => toggleSave('ke2')}
            onClick={() => search('Diani Beach')}
          />
          <Card
            src='https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80'
            title='Safari Tented Camp — Maasai Mara'
            description='Luxury glamping on the savanna · nightly game drives included'
            price='$350/night'
            badge='🦁 Safari'
            saved={savedCards['ke3']}
            onSave={() => toggleSave('ke3')}
            onClick={() => search('Maasai Mara')}
          />
          <Card
            src='https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=600&q=80'
            title='Cosy Studio in Westlands, Nairobi'
            description='Walking distance to restaurants, malls & nightlife · fast WiFi'
            price='$38/night'
            saved={savedCards['ke4']}
            onSave={() => toggleSave('ke4')}
            onClick={() => search('Nairobi')}
          />
          <Card
            src='https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?w=600&q=80'
            title='Old Town Riad, Mombasa'
            description='Historic Swahili architecture · rooftop terrace · city & ocean views'
            price='$95/night'
            badge='🏛️ Historic'
            saved={savedCards['ke5']}
            onSave={() => toggleSave('ke5')}
            onClick={() => search('Mombasa')}
          />
          <Card
            src='https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80'
            title='Mountain Retreat near Mt. Kenya'
            description='Superhost · log cabin, fireplace, forest views · perfect for couples'
            price='$120/night'
            badge='🏔️ Mountain'
            saved={savedCards['ke6']}
            onSave={() => toggleSave('ke6')}
            onClick={() => search('Nanyuki')}
          />
        </div>
      </section>

      {/* ── International picks ────────────────────────────────── */}
      <section className='home__section'>
        <SectionHeader
          title='International highlights'
          sub='Top-rated stays around the world'
          onSeeAll={() => search('London')}
          seeAllLabel='Explore more'
        />
        <div className='home__cardGrid home__cardGrid--3'>
          <Card
            src='https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg?im_w=320'
            title='3 Bedroom Flat in Bournemouth'
            description='Superhost · stunning beachside views in sunny Bournemouth'
            price='$130/night'
            saved={savedCards['int1']}
            onSave={() => toggleSave('int1')}
            onClick={() => search('Bournemouth')}
          />
          <Card
            src='https://thespaces.com/wp-content/uploads/2017/08/Courtesy-of-Airbnb.jpg?im_w=320'
            title='Penthouse in London'
            description='Enjoy the amazing sights of London from this stunning penthouse'
            price='$350/night'
            saved={savedCards['int2']}
            onSave={() => toggleSave('int2')}
            onClick={() => search('London')}
          />
          <Card
            src='https://media.nomadicmatt.com/2018/apartment.jpg?im_w=320'
            title='1 Bedroom Apartment'
            description='Superhost · great amenities and a fabulous shopping complex nearby'
            price='$70/night'
            saved={savedCards['int3']}
            onSave={() => toggleSave('int3')}
            onClick={() => search('London')}
          />
        </div>
      </section>

      {/* ── Inspiration banner ─────────────────────────────────── */}
      <section className='home__inspireBanner'>
        <div className='home__inspireContent'>
          <h2>Not sure where to go?</h2>
          <p>Search with flexible dates and let the perfect place find you.</p>
          <button onClick={() => search('Kenya')}>Explore Kenya stays</button>
        </div>
        <div className='home__inspireImg' style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=900&q=80')`
        }} />
      </section>
    </div>
  );
}

export default Home;