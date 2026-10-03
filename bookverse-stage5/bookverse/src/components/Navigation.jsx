import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from './UI';
import { BrandLogo } from './BrandLogo';

const links = [
  ['Home', '/'],
  ['Discover', '/discover'],
  ['Library', '/library'],
  ['Wishlist', '/wishlist'],
  ['Reading Progress', '/progress'],
  ['Goals', '/goals'],
  ['Statistics', '/statistics'],
  ['Community', '/community'],
  ['Book Clubs', '/clubs'],
  ['Challenges', '/challenges'],
  ['Achievements', '/achievements'],
  ['Reviews', '/reviews'],
  ['AI Recommendations', '/ai']
];

export function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand-wrapper">
        <BrandLogo size="medium" showTagline={true} onClick={onClose} />
      </div>
      <nav>
        {links.map(([n, p], i) => (
          <NavLink end={p === '/'} key={p} to={p} onClick={onClose}>
            <span>{['⌂', '✦', '▣', '♡', '◔', '◎', '◫', '◉', '♣', '◆', '✧', '✎', '✺'][i]}</span>
            {n}
          </NavLink>
        ))}
      </nav>
      <NavLink className="settings-link" to="/settings" onClick={onClose}>
        <span>⚙</span>
        Settings
      </NavLink>
    </aside>
  );
}

export function Navbar({ onMenu }) {
  const { theme, setTheme } = useApp();
  const [q, setQ] = useState('');

  return (
    <header className="navbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open sidebar menu">☰</button>
      
      {/* Brand logo & visible text */}
      <BrandLogo size="small" showTagline={false} className="navbar-brand" />

      <div className="nav-search">
        <SearchBar value={q} onChange={setQ} />
        {q && (
          <Link className="search-go" to={`/search?q=${encodeURIComponent(q)}`}>
            Search
          </Link>
        )}
      </div>

      <div className="nav-actions">
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
          className="nav-icon"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <Link to="/notifications" className="nav-icon" title="Notifications">
          ♢<i>3</i>
        </Link>
        <Link to="/profile/alexreads" className="avatar" title="Alex Reads Profile">
          A
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-brand-section">
        <BrandLogo size="medium" showTagline={true} />
        <p className="footer-desc">Your reading universe. One place for every story, shelf, challenge and conversation.</p>
      </div>
      <div className="footer-links">
        <Link to="/discover">Discover</Link>
        <Link to="/library">My Library</Link>
        <Link to="/community">Community</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/ai">AI Oracle</Link>
      </div>
      <small>© 2026 BookVerse · Open Daily · Read More</small>
    </footer>
  );
}
