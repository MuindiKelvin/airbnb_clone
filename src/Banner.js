import React, { useState, useEffect, useCallback } from 'react';
import './Banner.css';
import { useHistory } from 'react-router-dom';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1600&q=80',
    headline: 'Not sure where to go?',
    accent: 'Perfect.',
    sub: 'Discover stays that match your sense of adventure — from city escapes to remote hideaways.',
  },
  {
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80',
    headline: 'Live like a local,',
    accent: 'anywhere.',
    sub: 'Find unique homes hosted by people who know their city inside and out.',
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80',
    headline: 'Your perfect escape',
    accent: 'awaits.',
    sub: 'Mountain hideaways, beachside bungalows, or city penthouses — all in one place.',
  },
  {
    url: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=1600&q=80',
    headline: 'Adventure starts',
    accent: 'here.',
    sub: 'Book unique stays and experiences with hosts around the world.',
  },
];

function Banner() {
  const history = useHistory();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const goTo = useCallback((idx, dir = 'next') => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 600);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length, 'next'), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length, 'prev'), [current, goTo]);

  // Auto-advance every 6 s
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className='banner'>
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`banner__slide ${i === current ? 'banner__slide--active' : ''}`}
          style={{ backgroundImage: `url(${s.url})` }}
        />
      ))}

      {/* Overlay */}
      <div className='banner__overlay' />

      {/* Content */}
      <div className={`banner__content banner__content--${direction} ${animating ? 'banner__content--exit' : 'banner__content--enter'}`}>
        <div className='banner__badge'>✦ {current + 1} / {SLIDES.length}</div>
        <h1 className='banner__title'>
          {slide.headline}<br />
          <span className='banner__accent'>{slide.accent}</span>
        </h1>
        <p className='banner__sub'>{slide.sub}</p>
        <button className='banner__btn' onClick={() => history.push('/search')}>
          I'm flexible
        </button>
      </div>

      {/* Arrow controls */}
      <button className='banner__arrow banner__arrow--prev' onClick={prev} aria-label='Previous'>
        ‹
      </button>
      <button className='banner__arrow banner__arrow--next' onClick={next} aria-label='Next'>
        ›
      </button>

      {/* Dot indicators */}
      <div className='banner__dots'>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`banner__dot ${i === current ? 'banner__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;