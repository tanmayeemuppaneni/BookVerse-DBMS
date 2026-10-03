import {Link} from 'react-router-dom';import {useState, useEffect, useRef} from 'react';import {useApp} from '../context/AppContext';
import {BookSamplerModal} from './BookSamplerModal';
export function Button({children,variant='primary',...p}){return <button className={`btn btn-${variant}`} {...p}>{children}</button>}
export function Rating({value=0,interactive=false,onChange}){return <span className="stars">{[1,2,3,4,5].map(n=><button key={n} disabled={!interactive} className={n<=Math.round(value)?'active':''} onClick={()=>onChange?.(n)}>★</button>)}</span>}
export function ProgressBar({value=0}){return <div className="progress"><span style={{width:`${Math.min(100,value)}%`}}/></div>}
const FALLBACK_COVER = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80";

export function BookCard({book, onPreview}){
  const {wishlist,favorites,toggleWishlist,toggleFavorite}=useApp();
  const coverUrl = book.cover || FALLBACK_COVER;
  const ratingVal = book.rating || 4.5;
  const cat = book.category || 'Featured';
  return (
    <article className="book-card">
      <div className="cover-wrap-container">
        <Link to={`/books/${book.id}`} className="cover-wrap">
          <img 
            src={coverUrl} 
            alt={book.title} 
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_COVER;
            }}
          />
          <span className="cover-badge">{cat}</span>
        </Link>
        <button 
          type="button"
          className="sampler-preview-trigger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPreview?.(book);
          }}
          title={`Read opening sample of ${book.title}`}
          aria-label={`Read sample of ${book.title}`}
        >
          <span>👁 Read Sample</span>
        </button>
      </div>
      <div className="book-info">
        <div className="card-actions">
          <button onClick={()=>toggleFavorite(book.id)} className={favorites.includes(book.id)?'icon active':'icon'} aria-label="Favorite">♥</button>
          <button onClick={()=>toggleWishlist(book.id)} className={wishlist.includes(book.id)?'icon active':'icon'} aria-label="Wishlist">♡</button>
        </div>
        <Link to={`/books/${book.id}`}><h3>{book.title}</h3></Link>
        <p>{book.author}</p>
        <div><Rating value={ratingVal}/><span className="muted"> {ratingVal}</span></div>
      </div>
    </article>
  );
}
export function BookGrid({books}){
  const [selectedBook, setSelectedBook] = useState(null);
  return (
    <>
      <div className="book-grid">
        {books.map(b => (
          <BookCard key={b.id} book={b} onPreview={setSelectedBook} />
        ))}
      </div>
      {selectedBook && (
        <BookSamplerModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
}
export function EmptyState({title='Nothing here yet',text='Your collection will appear here as you explore BookVerse.'}){return <div className="empty"><div className="empty-icon">◌</div><h3>{title}</h3><p>{text}</p></div>}
export function StatCard({label,value,icon}){return <div className="stat-card"><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>}
export function SearchBar({value,onChange,placeholder='Search books, authors, genres...'}){return <div className="search"><span>⌕</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>}
export function Modal({open,onClose,title,children}){if(!open)return null;return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><h3>{title}</h3><button onClick={onClose}>×</button></div>{children}</div></div>}
export function Toast({message}){return message?<div className="toast">✓ {message}</div>:null}

export function ReadingStatusSelect({ status, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const options = [
    { value: 'want', label: 'Want to Read', icon: '📖' },
    { value: 'reading', label: 'Currently Reading', icon: '⏳' },
    { value: 'finished', label: 'Finished', icon: '✅' },
  ];

  const currentOption = options.find(o => o.value === status);
  const currentLabel = currentOption ? `${currentOption.icon} ${currentOption.label}` : '📖 Want to Read';

  return (
    <div className={`shelf-dropdown ${className}`} ref={ref}>
      <button 
        type="button" 
        className={`shelf-dropdown-btn ${open ? 'open' : ''}`} 
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{currentLabel}</span>
        <span className="shelf-dropdown-chevron">▼</span>
      </button>

      {open && (
        <div className="shelf-dropdown-menu" role="listbox">
          {options.map(opt => {
            const isActive = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`shelf-dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span className="item-content">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </span>
                {isActive && <span className="item-check">✓</span>}
              </button>
            );
          })}
          {status && (
            <>
              <div className="shelf-dropdown-divider" />
              <button
                type="button"
                className="shelf-dropdown-item remove"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <span className="item-content">
                  <span>✕</span>
                  <span>Remove from shelf</span>
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

