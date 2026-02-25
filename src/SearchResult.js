import React, { useState } from 'react';
import './SearchResult.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarIcon from '@material-ui/icons/Star';

const FALLBACK_IMG = 'https://via.placeholder.com/400x300?text=No+Image';

function SearchResult({
  img, images = [], location, title, description,
  star, reviews, price, total, superhost, url, delay = 0,
}) {
  const [saved,      setSaved]      = useState(false);
  const [imgIndex,   setImgIndex]   = useState(0);
  const [imgError,   setImgError]   = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);

  // ✅ Fixed: was skipping images[0] with .slice(1)
  const allImgs = [...new Set([img, ...images])].filter(Boolean);
  const currentImg = imgError ? FALLBACK_IMG : (allImgs[imgIndex] || FALLBACK_IMG);

  const openListing = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex((i) => Math.max(0, i - 1));
    setImgError(false);
    setImgLoaded(false);
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex((i) => Math.min(allImgs.length - 1, i + 1));
    setImgError(false);
    setImgLoaded(false);
  };

  return (
    <div
      className='searchResult'
      style={{ animationDelay: `${delay * 0.05}s` }}
      onClick={openListing}
      role='link'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openListing()}
    >
      {/* ── Image ─────────────────────────────── */}
      <div className='searchResult__imgWrap'>

        {/* Blur-up loader — shows skeleton until image is ready */}
        {!imgLoaded && <div className='searchResult__imgPlaceholder' />}

        <img
          className={`searchResult__img ${imgLoaded ? 'searchResult__img--loaded' : ''}`}
          src={currentImg}
          alt={title}
          loading='lazy'
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
        />

        {/* Prev / Next arrows */}
        {allImgs.length > 1 && (
          <>
            <button
              className='searchResult__imgBtn searchResult__imgBtn--prev'
              onClick={prevImg}
              style={{ opacity: imgIndex === 0 ? 0 : 1, pointerEvents: imgIndex === 0 ? 'none' : 'auto' }}
              aria-label='Previous image'
            >
              ‹
            </button>
            <button
              className='searchResult__imgBtn searchResult__imgBtn--next'
              onClick={nextImg}
              style={{ opacity: imgIndex === allImgs.length - 1 ? 0 : 1, pointerEvents: imgIndex === allImgs.length - 1 ? 'none' : 'auto' }}
              aria-label='Next image'
            >
              ›
            </button>

            {/* Dot indicators */}
            <div className='searchResult__imgDots'>
              {allImgs.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`searchResult__imgDot ${i === imgIndex ? 'searchResult__imgDot--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); setImgError(false); setImgLoaded(false); }}
                />
              ))}
            </div>
          </>
        )}

        {/* Heart / wishlist */}
        <button
          className={`searchResult__heart ${saved ? 'searchResult__heart--saved' : ''}`}
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          {saved
            ? <FavoriteIcon style={{ fontSize: 20 }} />
            : <FavoriteBorderIcon style={{ fontSize: 20 }} />}
        </button>

        {superhost && <span className='searchResult__badge'>⭐ Superhost</span>}
      </div>

      {/* ── Info ──────────────────────────────── */}
      <div className='searchResult__info'>
        <div className='searchResult__top'>
          <p className='searchResult__location'>{location || 'Unknown location'}</p>
          {star != null && (
            <div className='searchResult__stars'>
              <StarIcon style={{ fontSize: 13, color: '#ff385c' }} />
              <span>{typeof star === 'number' ? star.toFixed(2) : star}</span>
              {reviews > 0 && (
                <span className='searchResult__reviews'>({reviews.toLocaleString()})</span>
              )}
            </div>
          )}
        </div>

        <h3 className='searchResult__title'>{title}</h3>
        <div className='searchResult__divider' />
        <p className='searchResult__desc'>{description || 'No description available.'}</p>

        <div className='searchResult__bottom'>
          <span className='searchResult__viewLink'>View on Airbnb ↗</span>
          <div className='searchResult__priceWrap'>
            <p className='searchResult__price'>
              <strong>{price || 'Price on request'}</strong>
              {price && price !== 'Price on request' && <span> / night</span>}
            </p>
            {total && <p className='searchResult__total'>{total}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;