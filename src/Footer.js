import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <div className='footer'>
      <div className='footer__top'>
        <div className='footer__section'>
          <h3>Support</h3>
          <ul>
            <li>Help Centre</li>
            <li>AirCover</li>
            <li>Safety information</li>
            <li>Supporting people with disabilities</li>
            <li>Cancellation options</li>
          </ul>
        </div>
        <div className='footer__section'>
          <h3>Community</h3>
          <ul>
            <li>Airbnb.org: disaster relief housing</li>
            <li>Support Afghan refugees</li>
            <li>Combating discrimination</li>
          </ul>
        </div>
        <div className='footer__section'>
          <h3>Hosting</h3>
          <ul>
            <li>Try hosting</li>
            <li>AirCover for Hosts</li>
            <li>Explore hosting resources</li>
            <li>Visit our community forum</li>
            <li>How to host responsibly</li>
          </ul>
        </div>
        <div className='footer__section'>
          <h3>Airbnb</h3>
          <ul>
            <li>Newsroom</li>
            <li>Learn about new features</li>
            <li>Letter from our founders</li>
            <li>Careers</li>
            <li>Investors</li>
          </ul>
        </div>
      </div>

      <div className='footer__bottom'>
        <div className='footer__bottom--left'>
          <span>{new Date().getFullYear()} Airbnb Clone · No Rights Reserved — Demo Project</span>
          <span className='footer__dot'>·</span>
          <span>Privacy</span>
          <span className='footer__dot'>·</span>
          <span>Terms</span>
          <span className='footer__dot'>·</span>
          <span>Sitemap</span>
        </div>
        <div className='footer__bottom--right'>
          <span>Developed by </span>
          <a href='https://muindikelvin.github.io' target='_blank' rel='noreferrer'>
            MuindiKelvin
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;