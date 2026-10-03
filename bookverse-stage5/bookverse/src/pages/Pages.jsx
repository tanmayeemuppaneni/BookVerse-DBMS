import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'; import { useMemo, useState, useEffect } from 'react';
import { categories, authors, reviews, clubs, challenges } from '../data/books'; import { useApp } from '../context/AppContext';
import { storage } from '../utils/storage'; import { BookGrid, Rating, ProgressBar, StatCard, SearchBar, Button, EmptyState, Modal, ReadingStatusSelect } from '../components/UI';
import { BrandLogo } from '../components/BrandLogo';
import { PinterestGenreBoards } from '../components/PinterestGenreBoards';
import { DbmsQueryInspector } from '../components/DbmsQueryInspector';

const Header = ({ eyebrow, title, text, action }) => <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</div>{action}</div>;
const FALLBACK_COVER = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80";

export function AddBookModal({ open, onClose }) {
  const { addBookApi, uploadImageApi } = useApp();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cover, setCover] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError('');
      const url = await uploadImageApi(file);
      setCover(url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError('Title and Author are required.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await addBookApi({
        title: title.trim(),
        author: author.trim(),
        published_year: publishedYear ? parseInt(publishedYear, 10) : null,
        description: description.trim() || null,
        price: price ? parseFloat(price) : null,
        cover: cover.trim() || null
      });
      setTitle('');
      setAuthor('');
      setPublishedYear('');
      setDescription('');
      setPrice('');
      setCover('');
      onClose();
    } catch (err) {
      setError(err.message || 'Error adding book to database');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Book to Catalog">
      <form className="stack-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label>
          Title *
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Clean Code" />
        </label>
        <label>
          Author *
          <input required value={author} onChange={e => setAuthor(e.target.value)} placeholder="e.g. Robert C. Martin" />
        </label>
        <div className="form-grid">
          <label>
            Published Year
            <input type="number" value={publishedYear} onChange={e => setPublishedYear(e.target.value)} placeholder="2024" />
          </label>
          <label>
            Price ($)
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="29.99" />
          </label>
        </div>
        <label>
          Description
          <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Synopsis or brief summary of the book..." />
        </label>
        <div className="form-grid">
          <label>
            Upload Cover Image File
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
            {uploading && <small className="muted">Uploading image to server...</small>}
          </label>
          <label>
            Or Cover Image URL
            <input value={cover} onChange={e => setCover(e.target.value)} placeholder="https://..." />
          </label>
        </div>
        {cover && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={cover} alt="Cover preview" style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '4px' }} />
            <small className="muted">Image preview</small>
          </div>
        )}
        <Button disabled={submitting || uploading}>
          {submitting ? 'Saving to Database...' : 'Add Book'}
        </Button>
      </form>
    </Modal>
  );
}

export function Home() {
  const { 
    books, library, setStatus, wishlist, favorites, toggleWishlist, toggleFavorite,
    progress, setProgress, reviews: liveReviews, submitReviewApi, goals, setGoals, 
    joinedClubs, setJoinedClubs 
  } = useApp();

  // Chapter 1: Discover state
  const [searchQ, setSearchQ] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Chapter 2: Shelf state
  const [shelfFilter, setShelfFilter] = useState('all');

  // Chapter 3: Reviews state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBookId, setReviewBookId] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('Alex Reads');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Chapter 4: Goals state
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: '', target: 20, current: 0, unit: 'books' });

  // Chapter 5: AI Oracle state
  const [aiQ, setAiQ] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);

  // Set default book for review modal if not set
  useEffect(() => {
    if (books.length > 0 && !reviewBookId) {
      setReviewBookId(books[0].id);
    }
  }, [books, reviewBookId]);

  // Filtered books for Chapter 1
  const filteredBooks = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    return books.filter(b => {
      const matchText = !q || `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(q);
      const matchCat = selectedCat === 'All' || b.categories?.includes(selectedCat) || b.category === selectedCat;
      return matchText && matchCat;
    });
  }, [books, searchQ, selectedCat]);

  // Shelf books for Chapter 2
  const shelfBooks = useMemo(() => {
    return books.filter(b => {
      const st = library[b.id];
      if (!st) return false;
      if (shelfFilter === 'all') return true;
      return st === shelfFilter;
    });
  }, [books, library, shelfFilter]);

  const shelfCounts = useMemo(() => ({
    all: Object.keys(library).length,
    want: Object.values(library).filter(s => s === 'want').length,
    reading: Object.values(library).filter(s => s === 'reading').length,
    finished: Object.values(library).filter(s => s === 'finished').length,
  }), [library]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await submitReviewApi({
        book_id: reviewBookId || books[0]?.id,
        user_name: reviewAuthor.trim() || 'Alex Reads',
        rating: reviewRating,
        review_text: reviewText.trim()
      });
      setReviewSuccess('Your review has been preserved in the chronicle!');
      setReviewText('');
      setTimeout(() => {
        setReviewModalOpen(false);
        setReviewSuccess('');
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalForm.name.trim()) return;
    setGoals(prev => [
      ...prev,
      {
        id: `g${Date.now()}`,
        name: goalForm.name.trim(),
        target: Number(goalForm.target) || 10,
        current: Number(goalForm.current) || 0,
        unit: goalForm.unit
      }
    ]);
    setGoalForm({ name: '', target: 20, current: 0, unit: 'books' });
    setNewGoalOpen(false);
  };

  const handleAiAsk = (promptText) => {
    const q = (promptText || aiQ).trim().toLowerCase();
    if (!q) return;
    if (promptText) setAiQ(promptText);
    const words = q.split(' ').filter(w => w.length > 2);
    const matches = books.filter(b => {
      const text = `${b.title} ${b.author} ${b.category} ${b.description}`.toLowerCase();
      return words.some(w => text.includes(w));
    });
    setAiAnswer(matches.length ? matches : books.slice(0, 4));
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const trending = books.filter(b => b.trending);
  const displayTrending = trending.length ? trending.slice(0, 5) : books.slice(0, 5);

  return (
    <>
      {/* ========================================================
          PROLOGUE / COVER
          ======================================================== */}
      <section id="chapter-prologue" className="chapter-section cover-hero-section">
        <div className="hero">
          <div>
            <div style={{ marginBottom: 20 }}>
              <BrandLogo size="medium" showTagline={true} />
            </div>
            <span className="eyebrow">PROLOGUE · THE OPENING FOLIO</span>
            <h1>Every story has a place.<br /><em>Turn the page to find yours.</em></h1>
            <p>A living universe of literature. Discover new worlds, track your reading life, and journey through every feature simply by scrolling downwards.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => scrollTo('chapter-library')}>
                Explore Library ↓
              </button>
              <button className="btn btn-ghost" onClick={() => scrollTo('chapter-shelf')}>
                Open My Shelf ↓
              </button>
            </div>
          </div>
          <div className="hero-stack">
            <div className="floating-book">
              <span style={{ fontSize: 13, letterSpacing: 2, display: 'block', opacity: 0.8 }}>EST. 2026</span>
              BOOK<br />VERSE
            </div>
            <div className="quote">
              “A room without books is like a body without a soul.”
              <small>— Cicero</small>
            </div>
          </div>
        </div>

        <section className="dashboard-strip">
          <StatCard icon="◈" value={books.length || 13} label="Books in Library" />
          <StatCard icon="◔" value={shelfCounts.all} label="On Your Shelf" />
          <StatCard icon="♨" value="12 days" label="Reading Streak" />
          <StatCard icon="★" value="4.8" label="Average Rating" />
        </section>

        <div className="chapter-turn-divider">
          <button 
            type="button" 
            className="chapter-turn-btn" 
            onClick={() => scrollTo('chapter-library')}
          >
            <span>Turn Page to Chapter I: The Grand Library</span>
            <span className="turn-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          CHAPTER I: THE GRAND LIBRARY (DISCOVER & SEARCH)
          ======================================================== */}
      <section id="chapter-library" className="chapter-section">
        <div className="chapter-header">
          <span className="chapter-ribbon-badge">📖 CHAPTER I · THE GRAND LIBRARY</span>
          <div className="section-title">
            <div>
              <h2>Explore The Living Tome</h2>
              <p>Search, filter, and discover titles across genres with high-resolution covers and live database syncing.</p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>+ Add New Book</Button>
          </div>
        </div>

        {/* Pinterest-Inspired Genre Moodboards & Aesthetic Badges */}
        <PinterestGenreBoards 
          onSelectGenre={cat => {
            setSelectedCat(cat);
            const gridEl = document.getElementById('chapter-library-grid');
            if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
          }} 
          activeGenre={selectedCat} 
        />

        <div id="chapter-library-grid" className="toolbar discover-toolbar">
          <div className="search" style={{ flex: 1 }}>
            <span>⌕</span>
            <input 
              value={searchQ} 
              onChange={e => setSearchQ(e.target.value)} 
              placeholder="Search across titles, authors, categories..." 
            />
          </div>
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} aria-label="Category filter">
            {['All', 'Fiction', 'Fantasy', 'Science Fiction', 'Classics', 'Technology', 'Mystery', 'Manga'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Active Vintage Wax-Sealed Filter Banner */}
        {selectedCat !== 'All' && (
          <div className="active-genre-banner">
            <div className="banner-left">
              <span className="banner-seal">✦</span>
              <span className="banner-text">Filtering Library by <strong>{selectedCat}</strong></span>
              <span className="banner-count">({filteredBooks.length} volumes found)</span>
            </div>
            <button 
              type="button" 
              className="banner-clear-btn" 
              onClick={() => setSelectedCat('All')}
              aria-label="Clear genre filter"
            >
              ✕ Clear Filter
            </button>
          </div>
        )}

        {filteredBooks.length ? (
          <BookGrid books={filteredBooks.slice(0, 24)} />
        ) : (
          <EmptyState title="No books matched your search" text="Try searching for a different title, author, or category." />
        )}

        <div className="chapter-turn-divider">
          <button 
            type="button" 
            className="chapter-turn-btn" 
            onClick={() => scrollTo('chapter-shelf')}
          >
            <span>Turn Page to Chapter II: Your Reading Shelf</span>
            <span className="turn-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          CHAPTER II: YOUR READING SHELF & PROGRESS
          ======================================================== */}
      <section id="chapter-shelf" className="chapter-section">
        <div className="chapter-header">
          <span className="chapter-ribbon-badge">🔖 CHAPTER II · YOUR READING SHELF</span>
          <div className="section-title">
            <div>
              <h2>Your Personal Shelf & Page Progress</h2>
              <p>Track what you want to read, active books, and completed volumes with live backend synchronization.</p>
            </div>
            <Link to="/library" className="btn btn-secondary">Open Dedicated Shelf →</Link>
          </div>
        </div>

        <div className="tabs">
          <button className={shelfFilter === 'all' ? 'active' : ''} onClick={() => setShelfFilter('all')}>
            All <span>({shelfCounts.all})</span>
          </button>
          <button className={shelfFilter === 'want' ? 'active' : ''} onClick={() => setShelfFilter('want')}>
            📖 Want to Read <span>({shelfCounts.want})</span>
          </button>
          <button className={shelfFilter === 'reading' ? 'active' : ''} onClick={() => setShelfFilter('reading')}>
            ⏳ Currently Reading <span>({shelfCounts.reading})</span>
          </button>
          <button className={shelfFilter === 'finished' ? 'active' : ''} onClick={() => setShelfFilter('finished')}>
            ✅ Finished <span>({shelfCounts.finished})</span>
          </button>
        </div>

        {shelfBooks.length ? (
          <div className="library-list">
            {shelfBooks.slice(0, 6).map(b => {
              const raw = progress[b.id];
              const pct = typeof raw === 'number' ? raw : (raw?.percent || 0);
              const totalPages = b.pages || 320;
              return (
                <article className="library-row" key={b.id}>
                  <img 
                    src={b.cover || FALLBACK_COVER} 
                    alt={b.title} 
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_COVER; }} 
                  />
                  <div className="library-row-main">
                    <Link to={`/books/${b.id}`}>
                      <h3>{b.title}</h3>
                    </Link>
                    <p>{b.author} · {totalPages} pages</p>
                    <ProgressBar value={pct} />
                    <small>
                      {pct}% complete{pct > 0 && pct < 100 ? ` · ${Math.max(totalPages - Math.round(totalPages * pct / 100), 0)} pages left` : ''}
                    </small>
                  </div>
                  
                  {/* High-visibility shelf status selector */}
                  <ReadingStatusSelect 
                    status={library[b.id]} 
                    onChange={newStatus => setStatus(b.id, newStatus)} 
                  />
                  
                  <Button variant="secondary" onClick={() => setStatus(b.id, null)}>Remove</Button>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No books in this shelf yet" text="Add books from Chapter I above to build your reading universe." />
        )}

        <div className="chapter-turn-divider">
          <button 
            type="button" 
            className="chapter-turn-btn" 
            onClick={() => scrollTo('chapter-reviews')}
          >
            <span>Turn Page to Chapter III: Voices & Critique</span>
            <span className="turn-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          CHAPTER III: VOICES & CRITIQUE (REVIEWS)
          ======================================================== */}
      <section id="chapter-reviews" className="chapter-section">
        <div className="chapter-header">
          <span className="chapter-ribbon-badge">✍ CHAPTER III · VOICES & CRITIQUE</span>
          <div className="section-title">
            <div>
              <h2>Reader Reflections & Community Reviews</h2>
              <p>Explore honest reviews from readers or share your insights on any book in the database.</p>
            </div>
            <Button onClick={() => setReviewModalOpen(true)}>✍ Leave a Review</Button>
          </div>
        </div>

        <div className="review-list">
          {(liveReviews && liveReviews.length ? liveReviews : reviews).slice(0, 4).map((r, i) => {
            const b = books.find(x => x.id === r.book_id || x.id === r.bookId);
            return (
              <article className="review-card" key={r.id || r.review_id || i}>
                <div className="review-top">
                  <div className="avatar">{r.user_name?.[0] || r.author?.[0] || 'R'}</div>
                  <div>
                    <strong>{r.user_name || r.author}</strong>
                    <small>{b ? `Reviewed "${b.title}"` : 'Book Enthusiast'} · {r.created_at ? new Date(r.created_at).toLocaleDateString() : (r.date || 'Recently')}</small>
                  </div>
                  <Rating value={r.rating} />
                </div>
                <p style={{ marginTop: 12 }}>“{r.review_text || r.text}”</p>
              </article>
            );
          })}
        </div>

        <div className="chapter-turn-divider">
          <button 
            type="button" 
            className="chapter-turn-btn" 
            onClick={() => scrollTo('chapter-goals')}
          >
            <span>Turn Page to Chapter IV: Rituals & Milestones</span>
            <span className="turn-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          CHAPTER IV: RITUALS & MILESTONES (GOALS & STREAKS)
          ======================================================== */}
      <section id="chapter-goals" className="chapter-section">
        <div className="chapter-header">
          <span className="chapter-ribbon-badge">🎯 CHAPTER IV · RITUALS & MILESTONES</span>
          <div className="section-title">
            <div>
              <h2>Cultivate Daily Reading Momentum</h2>
              <p>Set annual targets, track daily volume, and keep your reading accomplishments visible.</p>
            </div>
            <Button onClick={() => setNewGoalOpen(true)}>+ New Goal</Button>
          </div>
        </div>

        <div className="goal-grid">
          {goals.map(g => {
            const pct = Math.min(100, Math.round(g.current / g.target * 100));
            return (
              <div className="goal-card" key={g.id}>
                <div className="goal-card-top">
                  <span className="goal-ring">{pct}%</span>
                  <button className="icon" onClick={() => setGoals(v => v.filter(x => x.id !== g.id))} aria-label={`Delete ${g.name}`}>×</button>
                </div>
                <h3>{g.name}</h3>
                <p>{g.current.toLocaleString()} / {g.target.toLocaleString()} {g.unit}</p>
                <ProgressBar value={pct} />
                <small>{Math.max(g.target - g.current, 0).toLocaleString()} {g.unit} remaining</small>
                <div className="goal-stepper">
                  <button onClick={() => setGoals(v => v.map(x => x.id === g.id ? { ...x, current: Math.max(0, x.current - 1) } : x))}>-</button>
                  <span>Update progress</span>
                  <button onClick={() => setGoals(v => v.map(x => x.id === g.id ? { ...x, current: Math.min(x.target, x.current + 1) } : x))}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="chapter-turn-divider">
          <button 
            type="button" 
            className="chapter-turn-btn" 
            onClick={() => scrollTo('chapter-oracle')}
          >
            <span>Turn Page to Chapter V: The AI Oracle</span>
            <span className="turn-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          CHAPTER V: THE AI ORACLE (RECOMMENDATIONS)
          ======================================================== */}
      <section id="chapter-oracle" className="chapter-section">
        <div className="ai-hero" style={{ marginBottom: 30 }}>
          <span className="chapter-ribbon-badge" style={{ background: '#ffffff22', color: '#fff', borderColor: '#ffffff44' }}>
            ✦ CHAPTER V · THE AI ORACLE
          </span>
          <h1>Tell me what you yearn to read.</h1>
          <p>Describe any mood, theme, style, or trope to discover matching books across your collection.</p>
          <div className="ai-input">
            <input 
              aria-label="Recommendation prompt" 
              value={aiQ} 
              onChange={e => setAiQ(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAiAsk()} 
              placeholder="e.g. mind-bending fantasy with deep lore and philosophical themes..." 
            />
            <Button onClick={() => handleAiAsk()}>Ask Oracle →</Button>
          </div>
          <div className="suggestions">
            {['Epic high fantasy', 'Psychological thriller', 'Classic literature', 'Software architecture', 'Space opera'].map(s => (
              <button key={s} onClick={() => handleAiAsk(s)}>{s}</button>
            ))}
          </div>
        </div>

        {aiAnswer && (
          <div style={{ marginTop: 25 }}>
            <div className="section-title">
              <div>
                <span className="eyebrow">ORACLE REVELATION</span>
                <h2>Handpicked For Your Mood</h2>
              </div>
            </div>
            <BookGrid books={aiAnswer} />
          </div>
        )}

        <div className="chapter-turn-divider">
          <button 
            type="button" 
            className="chapter-turn-btn" 
            onClick={() => scrollTo('chapter-clubs')}
          >
            <span>Turn Page to Chapter VI: Literary Gatherings</span>
            <span className="turn-arrow">↓</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          CHAPTER VI: LITERARY GATHERINGS (BOOK CLUBS)
          ======================================================== */}
      <section id="chapter-clubs" className="chapter-section">
        <div className="chapter-header">
          <span className="chapter-ribbon-badge">♣ CHAPTER VI · LITERARY GATHERINGS</span>
          <div className="section-title">
            <div>
              <h2>Read In Good Company</h2>
              <p>Join reader circles, engage in weekly chapter discussions, and share thoughts with kindred spirits.</p>
            </div>
            <Link to="/clubs" className="btn btn-secondary">Explore All Circles →</Link>
          </div>
        </div>

        <div className="club-grid">
          {clubs.map(c => {
            const joined = joinedClubs.includes(c.id);
            return (
              <div className="club-card" key={c.id}>
                <span className="eyebrow">ACTIVE CIRCLE</span>
                <h2>{c.name}</h2>
                <p>{c.description}</p>
                <div style={{ margin: '14px 0', fontSize: 12, color: 'var(--muted)' }}>
                  <strong>Current Book:</strong> {c.currentBook} · <strong>Members:</strong> {c.members + (joined ? 1 : 0)}
                </div>
                <Button 
                  variant={joined ? 'secondary' : 'primary'}
                  onClick={() => setJoinedClubs(prev => joined ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                >
                  {joined ? 'Joined ✓' : 'Join Circle'}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="chapter-turn-divider">
          <button 
            type="button" 
            className="chapter-turn-btn" 
            onClick={() => scrollTo('chapter-prologue')}
          >
            <span>Return to the Book Cover ↑</span>
          </button>
        </div>
      </section>

      {/* MODALS */}
      <AddBookModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

      {/* Review Modal */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Preserve Your Thoughts">
        <form className="stack-form" onSubmit={handleReviewSubmit}>
          <label>
            Select Book
            <select value={reviewBookId} onChange={e => setReviewBookId(e.target.value)}>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title} — {b.author}</option>
              ))}
            </select>
          </label>

          <label>
            Your Name / Pen Name
            <input 
              required 
              value={reviewAuthor} 
              onChange={e => setReviewAuthor(e.target.value)} 
              placeholder="Alex Reads" 
            />
          </label>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700 }}>
              Your Rating
            </label>
            <Rating value={reviewRating} interactive onChange={setReviewRating} />
          </div>

          <label>
            Your Review / Thoughts
            <textarea 
              required 
              rows={4} 
              value={reviewText} 
              onChange={e => setReviewText(e.target.value)} 
              placeholder="What enchanted you about this story? What questions remain?" 
            />
          </label>

          {reviewSuccess && <p className="success-note">{reviewSuccess}</p>}

          <Button disabled={submittingReview}>
            {submittingReview ? 'Preserving...' : 'Submit Review'}
          </Button>
        </form>
      </Modal>

      {/* Create Goal Modal */}
      <Modal open={newGoalOpen} onClose={() => setNewGoalOpen(false)} title="Create Reading Goal">
        <form className="stack-form" onSubmit={handleCreateGoal}>
          <label>
            Goal Name
            <input 
              required 
              value={goalForm.name} 
              onChange={e => setGoalForm({ ...goalForm, name: e.target.value })} 
              placeholder="Read 30 books this year" 
            />
          </label>

          <div className="form-grid">
            <label>
              Target Volume
              <input 
                type="number" 
                min="1" 
                value={goalForm.target} 
                onChange={e => setGoalForm({ ...goalForm, target: e.target.value })} 
              />
            </label>
            <label>
              Current Progress
              <input 
                type="number" 
                min="0" 
                value={goalForm.current} 
                onChange={e => setGoalForm({ ...goalForm, current: e.target.value })} 
              />
            </label>
          </div>

          <label>
            Unit of Measurement
            <select 
              value={goalForm.unit} 
              onChange={e => setGoalForm({ ...goalForm, unit: e.target.value })}
            >
              <option value="books">books</option>
              <option value="pages">pages</option>
            </select>
          </label>

          <Button>Create Goal</Button>
        </form>
      </Modal>
    </>
  );
}


export function Discover() {
  const { books } = useApp();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [author, setAuthor] = useState('All authors');
  const [rating, setRating] = useState('Any rating');
  const [year, setYear] = useState('Any year');
  const [sort, setSort] = useState('Relevance');
  const normalized = q.trim().toLowerCase();
  let list = books.filter(b => {
    const matchesQuery = !normalized || `${b.title} ${b.author} ${b.category} ${b.categories?.join(' ')}`.toLowerCase().includes(normalized);
    const matchesCategory = cat === 'All' || b.categories?.includes(cat);
    const matchesAuthor = author === 'All authors' || b.author === author;
    const matchesRating = rating === 'Any rating' || b.rating >= Number(rating);
    const matchesYear = year === 'Any year' || (year === 'Before 2000' ? b.publishedYear < 2000 : year === '2000–2010' ? b.publishedYear >= 2000 && b.publishedYear <= 2010 : b.publishedYear > 2010);
    return matchesQuery && matchesCategory && matchesAuthor && matchesRating && matchesYear;
  });
  list = [...list].sort((a, b) => sort === 'Rating' ? b.rating - a.rating : sort === 'Newest' ? b.publishedYear - a.publishedYear : sort === 'Title' ? a.title.localeCompare(b.title) : sort === 'Popularity' ? b.popularity - a.popularity : 0);
  return (
    <>
      <Header 
        eyebrow="DISCOVER" 
        title="Find your next favorite" 
        text="Browse a handpicked universe of stories and ideas." 
        action={<Button onClick={() => setAddModalOpen(true)}>+ Add Book</Button>}
      />
      <div className="toolbar discover-toolbar">
        <SearchBar value={q} onChange={setQ} />
        <select aria-label="Filter by category" value={cat} onChange={e => setCat(e.target.value)}><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select>
        <select aria-label="Filter by author" value={author} onChange={e => setAuthor(e.target.value)}><option>All authors</option>{authors.map(a => <option key={a.id}>{a.name}</option>)}</select>
        <select aria-label="Filter by rating" value={rating} onChange={e => setRating(e.target.value)}><option>Any rating</option><option value="4.5">4.5+ stars</option><option value="4.7">4.7+ stars</option></select>
        <select aria-label="Filter by year" value={year} onChange={e => setYear(e.target.value)}><option>Any year</option><option>Before 2000</option><option>2000–2010</option><option>After 2010</option></select>
        <select aria-label="Sort books" value={sort} onChange={e => setSort(e.target.value)}>{['Relevance', 'Rating', 'Popularity', 'Newest', 'Title'].map(x => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="result-meta">
        <span>{list.length} {list.length === 1 ? 'book' : 'books'} found</span>
        {(q || cat !== 'All' || author !== 'All authors' || rating !== 'Any rating' || year !== 'Any year') && <button onClick={() => { setQ(''); setCat('All'); setAuthor('All authors'); setRating('Any rating'); setYear('Any year') }}>Clear filters</button>}
      </div>
      {list.length ? <BookGrid books={list} /> : <EmptyState title="No books found" text="Try a different title, author, category, rating, or publication period." />}
      <AddBookModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
}

export function Search() {
  const { books } = useApp();
  const [params] = useSearchParams();
  const initial = params.get('q') || '';
  const [q, setQ] = useState(initial);
  const [sort, setSort] = useState('Relevance');
  const [category, setCategory] = useState('All');
  const suggestions = q.trim() ? books.filter(b => `${b.title} ${b.author}`.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 5) : [];
  let list = books.filter(b => { const hay = `${b.title} ${b.author} ${b.category} ${b.categories?.join(' ')}`.toLowerCase(); return (!q.trim() || hay.includes(q.trim().toLowerCase())) && (category === 'All' || b.categories?.includes(category)); });
  list = [...list].sort((a, b) => sort === 'Rating' ? b.rating - a.rating : sort === 'Newest' ? b.publishedYear - a.publishedYear : sort === 'Title' ? a.title.localeCompare(b.title) : sort === 'Popularity' ? b.popularity - a.popularity : 0);
  return <><Header eyebrow="SEARCH" title={q ? `Results for “${q}”` : 'Search BookVerse'} text="Search across titles, authors and categories." /><div className="search-page-box"><SearchBar value={q} onChange={setQ} placeholder="Try a title, author, or genre..." />{suggestions.length > 0 && <div className="search-suggestions">{suggestions.map(b => <Link key={b.id} to={`/books/${b.id}`}><img src={b.cover} alt="" /><span><b>{b.title}</b><small>{b.author}</small></span></Link>)}</div>}</div><div className="toolbar compact-toolbar"><select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select><select value={sort} onChange={e => setSort(e.target.value)}>{['Relevance', 'Rating', 'Popularity', 'Newest', 'Title'].map(x => <option key={x}>{x}</option>)}</select></div>{list.length ? <BookGrid books={list} /> : <EmptyState title="Nothing matched your search" text="Try a broader title, author, or category." />}</>
}

export function BookDetails() {
  const { id } = useParams();
  const { books, library, setStatus, wishlist, favorites, toggleWishlist, toggleFavorite, progress, setProgress, ratings, setRating, reviews, submitReviewApi, deleteReviewApi } = useApp();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const b = books.find(x => x.id === id);
  if (!b) return <EmptyState title="Book not found" text="That book does not exist in this catalog." />;

  const bookReviews = reviews.filter(r => (r.book === id || r.book_id === id));
  const raw = progress[id];
  const p = typeof raw === 'number' ? raw : (raw?.percent || 0);
  const page = raw?.page ?? Math.round((b.pages || 300) * p / 100);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      setSubmittingReview(true);
      await submitReviewApi({
        book_id: b.id,
        rating: userRating,
        review_text: reviewText.trim()
      });
      setReviewText('');
      setReviewOpen(false);
      setReviewSuccess('Thank you! Your review has been saved to the database.');
      setTimeout(() => setReviewSuccess(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <div className="book-detail">
        <div className="detail-cover"><img src={b.cover} alt={b.title} /></div>
        <div className="detail-content">
          <span className="eyebrow">{b.category?.toUpperCase() || 'BOOK'}</span>
          <h1>{b.title}</h1>
          <p className="detail-author">by {b.author}</p>
          <div className="rating-line">
            <Rating value={b.rating || 4.5} />
            <strong>{b.rating || 4.5}</strong>
            <span>{b.ratingCount?.toLocaleString() || '120'} ratings</span>
          </div>
          <p className="lead">{b.description || 'No description available for this title.'}</p>
          <div className="chips">
            {b.tags?.map(t => <span key={t}>{t}</span>)}
          </div>
          <div className="meta-grid">
            <div><small>Pages</small><b>{b.pages || 'N/A'}</b></div>
            <div><small>Published</small><b>{b.publishedYear || b.published_year || 'N/A'}</b></div>
            <div><small>ISBN</small><b>{b.isbn || 'N/A'}</b></div>
            <div><small>Price</small><b>{b.price ? `$${Number(b.price).toFixed(2)}` : 'N/A'}</b></div>
          </div>
          <div className="detail-actions">
            <ReadingStatusSelect 
              status={library[id]} 
              onChange={newStatus => setStatus(id, newStatus)} 
            />
            <Button variant="secondary" onClick={() => toggleWishlist(id)}>{wishlist.includes(id) ? 'In wishlist' : '♡ Wishlist'}</Button>
            <Button variant="secondary" onClick={() => toggleFavorite(id)}>{favorites.includes(id) ? '♥ Favorite' : '♡ Favorite'}</Button>
            <Button onClick={() => setReviewOpen(true)}>✍ Leave Review</Button>
          </div>
          {reviewSuccess && <p className="success-note">{reviewSuccess}</p>}
        </div>
      </div>

      <section className="reading-panel">
        <div>
          <span className="eyebrow">YOUR PROGRESS</span>
          <h2>{p}% complete</h2>
          <ProgressBar value={p} />
          <small>{page} of {b.pages || 300} pages</small>
        </div>
        <div>
          <label className="page-inline">
            Current page
            <input type="number" min="0" max={b.pages || 300} value={page} onChange={e => setProgress(id, Number(e.target.value), b.pages || 300)} />
          </label>
          <small>Update reading progress</small>
        </div>
        <div>
          <span className="eyebrow">YOUR RATING</span>
          <Rating value={ratings[id] || 0} interactive onChange={r => setRating(id, r)} />
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <div><span className="eyebrow">COMMUNITY REVIEWS</span><h2>What readers are saying ({bookReviews.length})</h2></div>
          <Button variant="secondary" onClick={() => setReviewOpen(true)}>+ Write a Review</Button>
        </div>
        {bookReviews.length === 0 ? (
          <EmptyState title="No reviews yet" text="Be the first reader to leave a review for this book!" />
        ) : (
          <div className="review-list">
            {bookReviews.map(r => (
              <div className="review-card" key={r.id || r.review_id}>
                <div className="review-top">
                  <div className="avatar">{(r.user || 'R')[0]}</div>
                  <div>
                    <b>{r.user}</b>
                    <small>{r.date || 'Recent review'}</small>
                  </div>
                  <Rating value={r.rating} />
                </div>
                <p>“{r.text || r.review_text}”</p>
                {(r.own || r.user_id === 'u1') && (
                  <button className="text-button" onClick={() => deleteReviewApi(r.id || r.review_id)}>
                    Delete review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-title"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>More like this</h2></div></div>
        <BookGrid books={books.filter(x => x.id !== id && x.categories?.some(c => b.categories?.includes(c))).slice(0, 5)} />
      </section>

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title={`Review: ${b.title}`}>
        <form className="stack-form" onSubmit={handleReviewSubmit}>
          <label>
            Your Rating
            <Rating value={userRating} interactive onChange={setUserRating} />
          </label>
          <label>
            Your Review
            <textarea 
              required 
              rows="4" 
              value={reviewText} 
              onChange={e => setReviewText(e.target.value)} 
              placeholder="What did you think of the characters, pacing, and ideas?" 
            />
          </label>
          <Button disabled={submittingReview}>
            {submittingReview ? 'Submitting to Database...' : 'Submit Review'}
          </Button>
        </form>
      </Modal>
    </>
  );
}

export function Library() {
  const { books, library, setStatus, progress } = useApp();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const labels = { want: 'Want to Read', reading: 'Currently Reading', finished: 'Finished' };
  const counts = {
    all: Object.keys(library).length,
    want: Object.values(library).filter(x => x === 'want').length,
    reading: Object.values(library).filter(x => x === 'reading').length,
    finished: Object.values(library).filter(x => x === 'finished').length
  };
  const list = books.filter(b => library[b.id] && (filter === 'all' || library[b.id] === filter) && (!query || `${b.title} ${b.author}`.toLowerCase().includes(query.toLowerCase())));
  return (
    <>
      <Header eyebrow="MY LIBRARY" title="Your reading shelf" text="One place for books you want to read, are reading, and have finished." />
      <div className="library-toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search your library..." />
        <div className="tabs">
          {['all', 'want', 'reading', 'finished'].map(x => (
            <button className={filter === x ? 'active' : ''} key={x} onClick={() => setFilter(x)}>
              {x === 'all' ? 'All' : labels[x]} <span>{counts[x]}</span>
            </button>
          ))}
        </div>
      </div>
      {list.length ? (
        <div className="library-list">
          {list.map(b => {
            const raw = progress[b.id];
            const defaultPct = library[b.id] === 'finished' ? 100 : (library[b.id] === 'reading' ? 50 : 0);
            const pct = typeof raw === 'number' ? raw : (raw?.percent ?? defaultPct);
            const totalPages = b.pages || 320;
            return (
              <article className="library-row" key={b.id}>
                <img 
                  src={b.cover || FALLBACK_COVER} 
                  alt={b.title} 
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_COVER; }} 
                />
                <div className="library-row-main">
                  <Link to={`/books/${b.id}`}>
                    <h3>{b.title}</h3>
                  </Link>
                  <p>{b.author} · {totalPages} pages</p>
                  <ProgressBar value={pct} />
                  <small>
                    {pct}% complete{pct > 0 && pct < 100 ? ` · ${Math.max(totalPages - Math.round(totalPages * pct / 100), 0)} pages left` : ''}
                  </small>
                </div>
                <ReadingStatusSelect 
                  status={library[b.id]} 
                  onChange={newStatus => setStatus(b.id, newStatus)} 
                />
                <Button variant="secondary" onClick={() => setStatus(b.id, null)}>Remove</Button>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Your shelf is waiting" text="Discover a book and add it to your library." />
      )}
    </>
  );
}

export function Wishlist() { const { books, wishlist, toggleWishlist } = useApp(); const saved = books.filter(b => wishlist.includes(b.id)); return <><Header eyebrow="WISHLIST" title="Books for later" text="Keep your next reads close at hand." action={saved.length ? <span className="muted">{saved.length} saved</span> : null} />{saved.length ? <div className="book-grid">{saved.map(b => <article className="book-card" key={b.id}><Link to={`/books/${b.id}`} className="cover-wrap"><img src={b.cover} alt={b.title} /><span className="cover-badge">{b.category}</span></Link><div className="book-info"><div className="card-actions"><button className="icon active" onClick={() => toggleWishlist(b.id)} aria-label={`Remove ${b.title} from wishlist`}>♥</button></div><Link to={`/books/${b.id}`}><h3>{b.title}</h3></Link><p>{b.author}</p><Rating value={b.rating} /></div></article>)}</div> : <EmptyState title="Your wishlist is empty" text="Tap ♡ on any book to save it for later." />}</> }

export function Categories() { 
  const { books } = useApp(); 
  const navigate = useNavigate();
  return (
    <>
      <Header eyebrow="PINTEREST AESTHETICS" title="Explore by genre" text="Dive into curated vintage moodboards, atmospheres, and timeless stories." />
      <PinterestGenreBoards onSelectGenre={cat => navigate(`/categories/${encodeURIComponent(cat)}`)} />
      <div style={{ marginTop: 45 }}>
        <Header eyebrow="ALL CATEGORIES" title="Index of all genres" text="Browse the full directory of categories in BookVerse." />
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link key={c} to={`/categories/${encodeURIComponent(c)}`} className="category-card">
              <span>0{i + 1}</span>
              <h3>{c}</h3>
              <p>{books.filter(b => b.categories?.includes(c)).length + 8} books</p>
              →
            </Link>
          ))}
        </div>
      </div>
    </>
  ); 
}

export function Category() { const { books } = useApp(); const { category } = useParams(); const name = decodeURIComponent(category); return <><Header eyebrow="CATEGORY" title={name} text={`Explore books in ${name}.`} /><BookGrid books={books.filter(b => b.categories?.includes(name))} /></> }

export function Authors() { return <><Header eyebrow="AUTHORS" title="Meet the storytellers" text="Explore the minds behind your favorite pages." /><div className="author-grid">{authors.map(a => <Link to={`/authors/${a.id}`} className="author-card" key={a.id}><img src={a.photo} alt="" /><div><h3>{a.name}</h3><p>{a.genres.join(' · ')}</p><small>{a.followers.toLocaleString()} followers</small></div></Link>)}</div></> }

export function Author() { const { books } = useApp(); const { id } = useParams(); const a = authors.find(x => x.id === id); if (!a) return <EmptyState title="Author not found" />; return <><div className="profile-hero"><img src={a.photo} alt="" /><div><span className="eyebrow">AUTHOR</span><h1>{a.name}</h1><p>{a.biography}</p><div className="chips">{a.genres.map(g => <span key={g}>{g}</span>)}</div></div></div><Header eyebrow="BIBLIOGRAPHY" title="Books" /><BookGrid books={books.filter(b => b.authorId === id)} /></> }

export function Progress() { const { books, library, progress, setProgress, setStatus } = useApp(); const reading = books.filter(b => library[b.id] === 'reading' || (progress[b.id] && ((typeof progress[b.id] === 'number' ? progress[b.id] : progress[b.id].percent) > 0 && (typeof progress[b.id] === 'number' ? progress[b.id] : progress[b.id].percent) < 100))); return <><Header eyebrow="READING PROGRESS" title="Keep turning pages" text="Track every active read with page-level progress." />{reading.length ? <div className="progress-list">{reading.map(b => { const raw = progress[b.id]; const pct = typeof raw === 'number' ? raw : (raw?.percent || 0); const page = raw?.page ?? Math.round(b.pages * pct / 100); return <article className="progress-card" key={b.id}><div className="progress-cover"><img src={b.cover} alt={b.title} /></div><div className="progress-card-main"><div className="section-title"><div><Link to={`/books/${b.id}`}><h2>{b.title}</h2></Link><p>{b.author}</p></div><strong>{pct}%</strong></div><ProgressBar value={pct} /><div className="page-controls"><label>Current page<input type="number" min="0" max={b.pages} value={page} onChange={e => setProgress(b.id, Number(e.target.value), b.pages)} /></label><span>{Math.max(b.pages - page, 0)} pages remaining</span><Button variant="secondary" onClick={() => { setProgress(b.id, b.pages, b.pages); setStatus(b.id, 'finished') }}>Mark finished</Button></div></div></article> })}</div> : <EmptyState title="No active reads" text="Add a book to Currently Reading, then start tracking pages here." />}</> }

export function Goals() { const { goals, setGoals } = useApp(); const [open, setOpen] = useState(false); const [form, setForm] = useState({ name: '', target: 10, current: 0, unit: 'books' }); function create(e) { e.preventDefault(); if (!form.name.trim()) return; setGoals(v => [...v, { ...form, id: `g${Date.now()}`, target: Number(form.target), current: Number(form.current), name: form.name.trim() }]); setForm({ name: '', target: 10, current: 0, unit: 'books' }); setOpen(false) } return <><Header eyebrow="GOALS" title="Make reading a ritual" text="Set targets and keep your momentum visible." action={<Button onClick={() => setOpen(true)}>+ New goal</Button>} /><div className="goal-grid">{goals.map(g => { const pct = Math.min(100, Math.round(g.current / g.target * 100)); return <div className="goal-card" key={g.id}><div className="goal-card-top"><span className="goal-ring">{pct}%</span><button className="icon" onClick={() => setGoals(v => v.filter(x => x.id !== g.id))} aria-label={`Delete ${g.name}`}>×</button></div><h3>{g.name}</h3><p>{g.current.toLocaleString()} / {g.target.toLocaleString()} {g.unit}</p><ProgressBar value={pct} /><small>{Math.max(g.target - g.current, 0).toLocaleString()} {g.unit} remaining</small><div className="goal-stepper"><button onClick={() => setGoals(v => v.map(x => x.id === g.id ? { ...x, current: Math.max(0, x.current - 1) } : x))}>−</button><span>Update progress</span><button onClick={() => setGoals(v => v.map(x => x.id === g.id ? { ...x, current: Math.min(x.target, x.current + 1) } : x))}>+</button></div></div> })}</div><Modal open={open} onClose={() => setOpen(false)} title="Create a reading goal"><form className="stack-form" onSubmit={create}><label>Goal name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Read 30 books this year" /></label><div className="form-grid"><label>Target<input type="number" min="1" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} /></label><label>Starting progress<input type="number" min="0" value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} /></label></div><label>Unit<select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}><option value="books">books</option><option value="pages">pages</option></select></label><Button>Create goal</Button></form></Modal></> }

export function Statistics() { const { books, library, progress, ratings } = useApp(); const finished = books.filter(b => library[b.id] === 'finished'); const pages = finished.reduce((n, b) => n + b.pages, 0) + Object.values(progress).reduce((n, p) => n + (typeof p === 'object' ? p.page || 0 : 0), 0); const rated = Object.values(ratings).map(Number).filter(Boolean); const avg = rated.length ? (rated.reduce((a, b) => a + b, 0) / rated.length).toFixed(1) : '—'; const reading = books.filter(b => library[b.id] === 'reading').length; const counts = {}; finished.forEach(b => b.categories?.forEach(c => counts[c] = (counts[c] || 0) + 1)); const favorite = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'; return <><Header eyebrow="STATISTICS" title="Your reading in numbers" text="A living snapshot built from your local BookVerse activity." /><div className="stats-grid"><StatCard icon="▣" value={finished.length} label="Books finished" /><StatCard icon="◫" value={pages.toLocaleString()} label="Pages read" /><StatCard icon="★" value={avg} label="Your average rating" /><StatCard icon="◔" value={reading} label="Currently reading" /></div><div className="stats-two-col"><div className="chart-card"><div className="section-title"><div><span className="eyebrow">ACTIVITY</span><h2>Reading activity</h2></div><span className="muted">Last 8 months</span></div><div className="bars">{[18, 32, 27, 45, 39, 62, 54, 78].map((n, i) => <div key={i}><span style={{ height: `${n}%` }}></span><small>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i]}</small></div>)}</div></div><div className="chart-card"><span className="eyebrow">YOUR PROFILE</span><h2>Reading identity</h2><div className="stat-detail"><span>Favorite genre</span><strong>{favorite}</strong></div><div className="stat-detail"><span>Books finished</span><strong>{finished.length}</strong></div><div className="stat-detail"><span>Books in progress</span><strong>{reading}</strong></div><div className="stat-detail"><span>Rated books</span><strong>{rated.length}</strong></div></div></div></> }

export function Reviews() {
  const { books, ratings, reviews, submitReviewApi, deleteReviewApi } = useApp();
  const [bookId, setBookId] = useState('');
  const [text, setText] = useState('');
  const [rating, setRatingLocal] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (books.length && !bookId) {
      setBookId(books[0].id);
    }
  }, [books, bookId]);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() || !bookId) return;
    try {
      setSubmitting(true);
      setError('');
      await submitReviewApi({
        book_id: bookId,
        rating,
        review_text: text.trim()
      });
      setText('');
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header eyebrow="REVIEWS" title="Your reading voice" text="Rate books, share thoughts, and see what the community is saying." />
      <div className="review-compose">
        <h2>Write a review</h2>
        {error && <p className="form-error">{error}</p>}
        <form className="stack-form" onSubmit={submit}>
          <label>
            Book
            <select value={bookId} onChange={e => setBookId(e.target.value)}>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Your rating
            <Rating value={rating} interactive onChange={setRatingLocal} />
          </label>
          <label>
            Your review
            <textarea 
              value={text} 
              onChange={e => setText(e.target.value)} 
              placeholder="What stayed with you?" 
              rows="4" 
            />
          </label>
          <Button disabled={submitting}>
            {submitting ? 'Publishing to Database...' : 'Publish review'}
          </Button>
        </form>
      </div>
      <div className="review-list">
        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" text="Submit the first review using the form above!" />
        ) : (
          reviews.map(r => (
            <div className="review-card" key={r.id || r.review_id}>
              <div className="review-top">
                <div className="avatar">{(r.user || 'R')[0]}</div>
                <div>
                  <b>{r.user}</b>
                  <small>{r.book_title || books.find(b => b.id === (r.book || r.book_id))?.title || 'Book'}</small>
                </div>
                <Rating value={r.rating} />
              </div>
              <p>“{r.text || r.review_text}”</p>
              <small>{r.likes || 0} people found this helpful · {r.date || 'Recently'}</small>
              {(r.own || r.user_id === 'u1') && (
                <button className="text-button" onClick={() => deleteReviewApi(r.id || r.review_id)}>
                  Delete review
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export function Community() {
  const { books, communityLikes, toggleCommunityLike, comments, addComment } = useApp();
  const posts = [{ id: 'p1', user: 'Maya', text: 'Just finished The Midnight Library and I have so many thoughts. 📚', time: '2h', book: '1' }, { id: 'p2', user: 'Daniel', text: 'My weekend stack is ready. What should I start first?', time: '5h', book: '3' }, { id: 'p3', user: 'Riya', text: 'Reading challenge update: five genres down!', time: '1d', book: '6' }];
  const [drafts, setDrafts] = useState({});
  function comment(id) { const t = (drafts[id] || '').trim(); if (!t) return; addComment(id, t); setDrafts(v => ({ ...v, [id]: '' })); }
  return <><Header eyebrow="COMMUNITY" title="Readers, together" text="Share what you are reading and discover what others love." /><div className="feed">{posts.map(p => <article className="post" key={p.id}><div className="review-top"><div className="avatar">{p.user[0]}</div><div><b>{p.user}</b><small>{p.time} ago</small></div></div><p>{p.text}</p><div className="post-book"><img src={books.find(b => b.id === p.book)?.cover} alt="" /><Link to={`/books/${p.book}`}>{books.find(b => b.id === p.book)?.title}</Link></div><div className="post-actions"><button onClick={() => toggleCommunityLike(p.id)}>♥ {communityLikes.includes(p.id) ? 'Liked' : 'Like'}</button><span>{(comments[p.id] || []).length} comments</span><button>↗ Share</button></div><div className="comment-box"><input value={drafts[p.id] || ''} onChange={e => setDrafts(v => ({ ...v, [p.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && comment(p.id)} placeholder="Add a comment..." /><Button variant="secondary" onClick={() => comment(p.id)}>Post</Button></div>{(comments[p.id] || []).map(c => <div className="comment" key={c.id}><b>{c.user}</b><span>{c.text}</span></div>)}</article>)}</div></>
}

export function Profile() {
  const { books, profile, setProfile, following, toggleFollow } = useApp(); const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(profile); const publicProfile = useParams().username !== profile.username;
  function save(e) { e.preventDefault(); setProfile({ ...draft }); setEditing(false) }
  return <><div className="profile-card"><div className="big-avatar">{profile.avatar}</div><div className="profile-main"><span className="eyebrow">{publicProfile ? 'READER PROFILE' : 'MY PROFILE'}</span><h1>{profile.name}</h1><p>@{profile.username} · {profile.bio}</p><div className="profile-stats"><b>{profile.followers} <small>Followers</small></b><b>{profile.following} <small>Following</small></b><b>8 <small>Books read</small></b></div><div className="profile-actions">{publicProfile ? <Button variant={following.includes(profile.username) ? 'secondary' : 'primary'} onClick={() => toggleFollow(profile.username)}>{following.includes(profile.username) ? 'Following ✓' : 'Follow'}</Button> : <Button variant="secondary" onClick={() => { setDraft(profile); setEditing(true) }}>Edit profile</Button>}</div><div className="profile-genres">{profile.favoriteGenres.map(g => <span key={g}>{g}</span>)}</div></div></div><Header eyebrow="RECENTLY READ" title="Your books" /><BookGrid books={books.slice(0, 4)} /><Modal open={editing} onClose={() => setEditing(false)} title="Edit profile"><form className="stack-form" onSubmit={save}><label>Name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label><label>Username<input value={draft.username} onChange={e => setDraft({ ...draft, username: e.target.value })} /></label><label>Bio<textarea value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} rows="3" /></label><Button>Save profile</Button></form></Modal></>
}

export function Clubs() { const { books, joinedClubs } = useApp(); return <><Header eyebrow="BOOK CLUBS" title="Find your people" text="Join conversations around books you love." /><div className="club-grid">{clubs.map(c => <Link className="club-card" to={`/clubs/${c.id}`} key={c.id}><span className="eyebrow">BOOK CLUB</span><h2>{c.name}</h2><p>{c.description}</p><div><b>{c.members + (joinedClubs.includes(c.id) ? 1 : 0)}</b> members · <b>{books.find(b => b.id === c.currentBook)?.title}</b></div>{joinedClubs.includes(c.id) && <span className="joined-badge">Joined ✓</span>}</Link>)}</div></> }

export function Club() { const { id } = useParams(); const c = clubs.find(x => x.id === id); const { books, joinedClubs, toggleClub, clubDiscussions, addClubDiscussion } = useApp(); const [message, setMessage] = useState(''); if (!c) return <EmptyState title="Club not found" />; const joined = joinedClubs.includes(id); function post() { const t = message.trim(); if (!t) return; addClubDiscussion(id, t); setMessage('') } return <><div className="club-detail"><span className="eyebrow">BOOK CLUB</span><h1>{c.name}</h1><p>{c.description}</p><div className="club-stats"><b>{c.members + (joined ? 1 : 0)}</b> members</div><Button onClick={() => toggleClub(id)}>{joined ? 'Leave club' : 'Join club'}</Button></div><section className="discussion"><Header eyebrow="DISCUSSION" title={`Currently reading ${books.find(b => b.id === c.currentBook)?.title}`} /><div className="comment-box"><input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && post()} placeholder="Share a thought with the club..." /><Button onClick={post}>Post</Button></div>{(clubDiscussions[id] || []).map(d => <div className="review-card" key={d.id}><b>{d.user}</b><p>{d.text}</p></div>)}{reviews.slice(0, 3).map(r => <div className="review-card" key={r.id}><b>{r.user}</b><p>{r.text}</p></div>)}</section></> }

export function Challenges() { const { joinedChallenges } = useApp(); return <><Header eyebrow="CHALLENGES" title="Read beyond your routine" text="Small prompts, big reading adventures." /><div className="goal-grid">{challenges.map(c => <Link className="goal-card" to={`/challenges/${c.id}`} key={c.id}><span className="eyebrow">CHALLENGE</span><h3>{c.name}</h3><p>{c.description}</p><ProgressBar value={c.progress / c.target * 100} /><small>{c.progress} / {c.target}{joinedChallenges.includes(c.id) ? ' · Joined' : ''}</small></Link>)}</div></> }

export function Challenge() { const { id } = useParams(); const c = challenges.find(x => x.id === id); const { joinedChallenges, toggleChallenge, challengeProgress, setChallengeValue } = useApp(); const progress = challengeProgress[id] ?? c?.progress ?? 0; if (!c) return <EmptyState title="Challenge not found" />; const joined = joinedChallenges.includes(id); const change = v => setChallengeValue(id, Math.max(0, Math.min(c.target, v))); return <div className="club-detail"><span className="eyebrow">READING CHALLENGE</span><h1>{c.name}</h1><p>{c.description}</p><ProgressBar value={progress / c.target * 100} /><h2>{progress} / {c.target}</h2><div className="goal-stepper"><button onClick={() => change(progress - 1)}>−</button><span>{Math.round(progress / c.target * 100)}% complete</span><button onClick={() => change(progress + 1)}>+</button></div><Button onClick={() => toggleChallenge(id)}>{joined ? 'Joined ✓' : 'Join challenge'}</Button>{progress >= c.target && <p className="success-note">Challenge completed! 🎉</p>}</div> }

export function Achievements() { const items = [['First Book', 'Read your first book', true, 100], ['5 Books Read', 'Complete five books', true, 100], ['10 Books Read', 'Complete ten books', false, 80], ['1,000 Pages', 'Read one thousand pages', true, 100], ['7 Day Streak', 'Keep a seven day streak', true, 100], ['Genre Explorer', 'Read across five genres', false, 60]]; return <><Header eyebrow="ACHIEVEMENTS" title="Collect reading milestones" text="Track the moments that make your reading life yours." /><div className="achievement-grid">{items.map(x => <div className={`achievement ${x[2] ? 'unlocked' : ''}`} key={x[0]}><div className="achievement-icon">{x[2] ? '✦' : '◇'}</div><h3>{x[0]}</h3><p>{x[1]}</p><ProgressBar value={x[3]} /><small>{x[2] ? 'Unlocked' : `${x[3]}% progress`}</small></div>)}</div></> }

export function Notifications() { const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotifications } = useApp(); return <><Header eyebrow="NOTIFICATIONS" title="Your updates" text={unreadNotifications ? `${unreadNotifications} unread notification${unreadNotifications === 1 ? '' : 's'}` : 'All caught up'} action={<Button variant="secondary" onClick={markAllNotificationsRead}>Mark all read</Button>} /><div className="notification-list">{notifications.length ? notifications.map(n => <button className={`notification ${n.read ? 'read' : ''}`} key={n.id} onClick={() => markNotificationRead(n.id)}><span>{n.read ? '○' : '✦'}</span><div><b>{n.text}</b><small>{n.time} · {n.read ? 'Read' : 'Unread — click to mark read'}</small></div></button>) : <EmptyState title="All caught up" text="No new notifications." />}</div></> }

export function Settings() {
  const { theme, setTheme, profile, setProfile } = useApp();
  const [prefs, setPrefs] = useState(() => storage.get('preferences', { recommendations: true, community: true, publicProfile: true }));
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState(profile);
  function updatePref(key) { setPrefs(v => { const next = { ...v, [key]: !v[key] }; storage.set('preferences', next); return next }) }
  function saveProfile(e) { e.preventDefault(); setProfile({ ...draft }); setSaved(true); setTimeout(() => setSaved(false), 1800) }
  return <><Header eyebrow="SETTINGS" title="Make BookVerse yours" text="Control your appearance, reading experience, profile and notification preferences." />
    <div className="settings-grid">
      <section className="settings-card"><span className="eyebrow">APPEARANCE</span><h2>Theme</h2><p>Choose how BookVerse looks across the app.</p><div className="setting-control"><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}>☀ Light</button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>☾ Dark</button></div></section>
      <section className="settings-card"><span className="eyebrow">READING PREFERENCES</span><h2>Your reading experience</h2><label className="switch-row">Show reading recommendations <input type="checkbox" checked={prefs.recommendations} onChange={() => updatePref('recommendations')} /></label><label className="switch-row">Community notifications <input type="checkbox" checked={prefs.community} onChange={() => updatePref('community')} /></label><label className="switch-row">Public profile <input type="checkbox" checked={prefs.publicProfile} onChange={() => updatePref('publicProfile')} /></label></section>
      <section className="settings-card"><span className="eyebrow">PROFILE</span><h2>Edit profile</h2><form className="stack-form" onSubmit={saveProfile}><label>Display name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label><label>Username<input value={draft.username} onChange={e => setDraft({ ...draft, username: e.target.value.replace(/\s/g, '') })} /></label><label>Bio<textarea rows="3" value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} /></label><Button>{saved ? 'Saved ✓' : 'Save profile'}</Button></form></section>
      <section className="settings-card"><span className="eyebrow">PRIVACY & ACCOUNT</span><h2>Account controls</h2><p>Your account in this demo is local to this browser. No real authentication or server account is created.</p><div className="account-actions"><button className="btn btn-secondary" onClick={() => { storage.remove('preferences'); setPrefs({ recommendations: true, community: true, publicProfile: true }) }}>Reset preferences</button><Link className="btn btn-ghost" to="/login">Open mock sign in</Link></div></section>
    </div></>
}

export function AI() {
  const { books } = useApp();
  const [q, setQ] = useState(''); const [answer, setAnswer] = useState(null); const [history, setHistory] = useState([]);
  const examples = ['Recommend me a mystery novel.', 'Give me a fantasy adventure.', 'Suggest something for a weekend read.', 'I want a thoughtful book about psychology.'];
  function ask(prompt = q) {
    const text = prompt.trim(); if (!text) return; const lower = text.toLowerCase();
    const stop = ['recommend', 'me', 'a', 'an', 'the', 'give', 'books', 'book', 'suggest', 'something', 'for', 'weekend', 'read', 'novel', 'i', 'want', 'to', 'read', 'about'];
    const terms = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stop.includes(w));
    let found = books.filter(b => { const hay = `${b.title} ${b.author} ${b.category} ${b.categories?.join(' ')} ${b.tags?.join(' ')} ${b.description}`.toLowerCase(); return terms.some(t => hay.includes(t)) });
    if (!found.length) found = [...books].sort((a, b) => b.rating - a.rating || b.popularity - a.popularity).slice(0, 4);
    setAnswer(found.slice(0, 4)); setHistory(h => [{ prompt: text, count: Math.min(found.length, 4) }, ...h].slice(0, 5)); setQ(text);
  }
  return <><div className="ai-hero"><span className="eyebrow">BOOKVERSE AI · DEMO</span><h1>Tell me what you want to read.</h1><p>Describe a genre, mood, theme or favorite. This recommendation assistant uses simple matching against the local BookVerse dataset; no external AI service is connected.</p><div className="ai-input"><input aria-label="Recommendation prompt" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Recommend me a mystery novel..." /><Button onClick={() => ask()}>Ask →</Button></div><div className="suggestions">{examples.map(s => <button key={s} onClick={() => ask(s)}>{s}</button>)}</div></div>{history.length > 0 && <section className="ai-history"><span className="eyebrow">RECENT PROMPTS</span>{history.map((h, i) => <button key={i} onClick={() => ask(h.prompt)}>{h.prompt}<small>{h.count} matches</small></button>)}</section>}{answer && <section className="section"><div className="section-title"><div><span className="eyebrow">MATCHES</span><h2>Here are a few ideas</h2></div></div><BookGrid books={answer} /></section>}</>
}

export function Lists() { const { books, lists, setLists } = useApp(); const { id } = useParams(); const current = id ? lists.find(x => x.id === id) : null; const [open, setOpen] = useState(false); const [name, setName] = useState(''); const [editing, setEditing] = useState(false); const [editName, setEditName] = useState(current?.name || ''); function create(e) { e.preventDefault(); if (!name.trim()) return; setLists(v => [...v, { id: `l${Date.now()}`, name: name.trim(), books: [] }]); setName(''); setOpen(false) } function rename() { if (!current || !editName.trim()) return; setLists(v => v.map(x => x.id === current.id ? { ...x, name: editName.trim() } : x)); setEditing(false) } function addBook(bookId) { if (!current) return; setLists(v => v.map(x => x.id === current.id && !x.books.includes(bookId) ? { ...x, books: [...x.books, bookId] } : x)) } function removeBook(bookId) { setLists(v => v.map(x => x.id === current?.id ? { ...x, books: x.books.filter(b => b !== bookId) } : x)) } if (current) return <><Header eyebrow="READING LIST" title={current.name} text={`${current.books.length} ${current.books.length === 1 ? 'book' : 'books'} in this collection.`} action={<div className="detail-actions"><Button variant="secondary" onClick={() => setEditing(true)}>Rename</Button><Link className="btn btn-ghost" to="/lists">Back to lists</Link></div>} /><div className="list-detail-books">{current.books.length ? current.books.map(bookId => { const b = books.find(x => x.id === bookId); return b ? <article className="library-row" key={b.id}><img src={b.cover} alt={b.title} /><div className="library-row-main"><Link to={`/books/${b.id}`}><h3>{b.title}</h3></Link><p>{b.author}</p></div><Button variant="secondary" onClick={() => removeBook(b.id)}>Remove</Button></article> : null }) : <EmptyState title="This list is empty" text="Add a book from the picker below." />}</div><section className="section"><div className="section-title"><div><span className="eyebrow">ADD BOOKS</span><h2>Choose from BookVerse</h2></div></div><div className="book-grid">{books.filter(b => !current.books.includes(b.id)).slice(0, 8).map(b => <article className="list-picker" key={b.id}><img src={b.cover} alt={b.title} /><div><h3>{b.title}</h3><p>{b.author}</p><Button onClick={() => addBook(b.id)}>+ Add</Button></div></article>)}</div></section><Modal open={editing} onClose={() => setEditing(false)} title="Rename list"><form className="stack-form" onSubmit={e => { e.preventDefault(); rename() }}><label>List name<input value={editName} onChange={e => setEditName(e.target.value)} /></label><Button>Save name</Button></form></Modal></>; return <><Header eyebrow="READING LISTS" title="Your curated shelves" text="Build collections around moods, genres, or moments." action={<Button onClick={() => setOpen(true)}>+ Create list</Button>} /><div className="list-grid">{lists.map(l => <div className="list-card" key={l.id}><span className="eyebrow">READING LIST</span><div className="list-title-row"><h2>{l.name}</h2><button className="icon" onClick={() => setLists(v => v.filter(x => x.id !== l.id))} aria-label={`Delete ${l.name}`}>×</button></div><div className="mini-covers">{l.books.length ? l.books.slice(0, 4).map(bookId => <img key={bookId} src={books.find(b => b.id === bookId)?.cover} alt="" />) : <div className="mini-empty">+</div>}</div><p>{l.books.length} {l.books.length === 1 ? 'book' : 'books'}</p><Link className="btn btn-secondary" to={`/lists/${l.id}`}>Open list →</Link></div>)}</div><Modal open={open} onClose={() => setOpen(false)} title="Create a reading list"><form className="stack-form" onSubmit={create}><label>List name<input required value={name} onChange={e => setName(e.target.value)} placeholder="Weekend Reads" /></label><Button>Create list</Button></form></Modal></> }

export function Login({ register = false }) {
  const navigate = useNavigate(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  function submit(e) { e.preventDefault(); if (!email.trim() || !password.trim() || (register && !name.trim())) { setError('Please complete all required fields.'); return } storage.set('mockAuth', { signedIn: true, name: register ? name : 'Alex Morgan', email }); navigate('/') }
  return <div className="auth"><div className="auth-copy"><span className="brand-mark">B</span><h1>{register ? 'Create your reading identity.' : 'Welcome back to your reading universe.'}</h1><p>One home for every story, shelf, challenge and conversation.</p></div><form className="auth-form" onSubmit={submit}><span className="eyebrow">BOOKVERSE · DEMO ACCOUNT</span><h2>{register ? 'Create account' : 'Sign in'}</h2>{register && <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />}<input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" /><input required minLength="4" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />{error && <p className="form-error">{error}</p>}<Button>{register ? 'Create account' : 'Sign in'}</Button><p>{register ? 'Already have an account?' : 'New to BookVerse?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create one'}</Link></p><small className="muted">UI-only demo authentication. Credentials are stored only in this browser.</small></form></div>
}

export function Admin() {
  const { books, addBookApi, deleteBookApi, reviews, deleteReviewApi } = useApp();
  const [tab, setTab] = useState('overview');
  const [quickTitle, setQuickTitle] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [usersState] = useState(() => storage.get('adminUsers', [
    { id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', status: 'Active' },
    { id: 'u2', name: 'Maya Chen', email: 'maya@example.com', status: 'Active' },
    { id: 'u3', name: 'Daniel Reed', email: 'daniel@example.com', status: 'Pending' }
  ]));

  async function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    try {
      await addBookApi({
        title: quickTitle.trim(),
        author: 'Unknown Author',
        description: 'Added via Admin quick add'
      });
      setQuickTitle('');
    } catch (err) {
      alert(err.message || 'Failed to add book');
    }
  }

  return (
    <>
      <Header 
        eyebrow="ADMIN" 
        title="BookVerse control room" 
        text="Connected to live MySQL backend via FastAPI. Manage your books, reviews, and catalog in real time." 
        action={<Button onClick={() => setAddModalOpen(true)}>+ Add New Book</Button>}
      />
      <div className="stats-grid">
        <StatCard icon="▣" value={books.length.toLocaleString()} label="Total books" />
        <StatCard icon="♙" value={usersState.length.toLocaleString()} label="Users in demo" />
        <StatCard icon="✎" value={reviews.length.toLocaleString()} label="Reviews in DB" />
        <StatCard icon="◔" value="3,104" label="Active readers" />
      </div>
      <div className="admin-tabs tabs">
        {[['overview', 'Overview'], ['dbms', '⚡ DBMS Query Inspector'], ['books', 'Books'], ['users', 'Users'], ['reviews', 'Reviews']].map(([id, label]) => (
          <button className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === 'dbms' && <DbmsQueryInspector />}
      {tab === 'overview' && (
        <div className="admin-grid">
          <div className="chart-card">
            <h2>Recent Books Added</h2>
            {books.slice(0, 6).map((b, i) => (
              <div className="admin-row" key={b.id}>
                <span>{i + 1}</span>
                <b>{b.title}</b>
                <small>{b.author}</small>
              </div>
            ))}
          </div>
          <div className="chart-card">
            <h2>Recent activity</h2>
            {['MySQL database connected', 'POST /books/ route ready', 'POST /reviews/ route ready', 'Image uploads enabled via /upload/'].map(x => (
              <div className="admin-row" key={x}>
                <span>•</span>
                <b>{x}</b>
                <small>live</small>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'books' && (
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ margin: 0 }}>Book management ({books.length})</h2>
            <Button onClick={() => setAddModalOpen(true)}>+ Add Book Modal</Button>
          </div>
          <form className="inline-form" onSubmit={handleQuickAdd}>
            <input value={quickTitle} onChange={e => setQuickTitle(e.target.value)} placeholder="Quick-add book title..." />
            <Button>Quick Add</Button>
          </form>
          {books.map(b => (
            <div className="admin-row" key={b.id}>
              <b>{b.title}</b>
              <small>{b.author}</small>
              <button className="text-button" onClick={() => deleteBookApi(b.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      {tab === 'users' && (
        <div className="chart-card">
          <h2>User management</h2>
          {usersState.map(u => (
            <div className="admin-row" key={u.id}>
              <b>{u.name}</b>
              <small>{u.email} · {u.status}</small>
              <span className="joined-badge">User</span>
            </div>
          ))}
        </div>
      )}
      {tab === 'reviews' && (
        <div className="chart-card">
          <h2>Review moderation ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="muted">No reviews in the database yet.</p>
          ) : (
            reviews.map(r => (
              <div className="admin-row" key={r.id || r.review_id}>
                <b>{r.user}</b>
                <small>{r.book_title || books.find(b => b.id === (r.book || r.book_id))?.title || 'Book'} · {r.rating}★</small>
                <button className="text-button" onClick={() => deleteReviewApi(r.id || r.review_id)}>Remove</button>
              </div>
            ))
          )}
        </div>
      )}
      <AddBookModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
}

export function NotFound() { return <EmptyState title="Page not found" text="The page you are looking for does not exist in BookVerse." /> }