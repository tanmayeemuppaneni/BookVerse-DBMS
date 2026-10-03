import { Link } from 'react-router-dom';
import logoUrl from '../assets/bookverse_logo.jpg';

export function BrandLogo({ size = 'medium', showTagline = true, className = '', onClick }) {
  return (
    <Link 
      to="/" 
      onClick={onClick}
      className={`brand-container brand-${size} ${className}`} 
      aria-label="BookVerse - Home"
    >
      <div className="brand-logo-frame">
        <img 
          src={logoUrl} 
          alt="BookVerse Retro Emblem" 
          className="brand-logo-img" 
        />
        <div className="brand-logo-glow" />
      </div>
      <div className="brand-text-group">
        <div className="brand-title">
          <span className="brand-title-book">BOOK</span>
          <span className="brand-title-verse">VERSE</span>
        </div>
        {showTagline && (
          <span className="brand-tagline">
            <span>OPEN DAILY</span>
            <span className="brand-tagline-dot">•</span>
            <span>READ MORE</span>
          </span>
        )}
      </div>
    </Link>
  );
}
export default BrandLogo;
