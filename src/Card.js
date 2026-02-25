import React, { useState } from 'react';
import './Card.css';

function Card({ src, title, description, price, badge, saved, onSave, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const [hearted, setHearted] = useState(saved || false);

  const handleSave = (e) => {
    e.stopPropagation();
    setHearted(!hearted);
    if (onSave) onSave();
  };

  return (
    <div
      className={`card ${onClick ? 'card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
    >
      {/* Image */}
      <div className='card__imgWrap'>
        <img
          className='card__img'
          src={imgErr ? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80' : src}
          alt={title}
          onError={() => setImgErr(true)}
        />

        {/* Badge */}
        {badge && <span className='card__badge'>{badge}</span>}

        {/* Heart */}
        <button
          className={`card__heart ${hearted ? 'card__heart--saved' : ''}`}
          onClick={handleSave}
          aria-label={hearted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <svg viewBox='0 0 32 32' aria-hidden='true'>
            <path d={hearted
              ? 'M16 28c7-4.73 14-10 14-17a6 6 0 0 0-12 0 6 6 0 0 0-12 0c0 7 7 12.27 10 17z'
              : 'M16 28c7-4.73 14-10 14-17a6 6 0 0 0-12 0 6 6 0 0 0-12 0c0 7 7 12.27 10 17z'
            } />
          </svg>
        </button>

        {/* Price chip */}
        {price && (
          <div className='card__pricePill'>
            <strong>{price}</strong>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='card__info'>
        <h3 className='card__title'>{title}</h3>
        {description && <p className='card__desc'>{description}</p>}
        {onClick && (
          <span className='card__cta'>View listing →</span>
        )}
      </div>
    </div>
  );
}

export default Card;