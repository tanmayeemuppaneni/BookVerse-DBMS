import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rating, ReadingStatusSelect } from './UI';
import { useApp } from '../context/AppContext';

// Classical and iconic opening excerpts for Reader's Sampler
const FAMOUS_OPENINGS = {
  'The Iliad': 'Rage — Goddess, sing the rage of Peleus’ son Achilles, murderous, doomed, that cost the Achaeans countless losses, hurling down to the House of Death so many sturdy souls.',
  'The Odyssey': 'Sing to me of the man, Muse, the man of twists and turns driven time and again off course, once he had plundered the hallowed heights of Troy.',
  'Meditations': 'From my grandfather Verus I learned good morals and the government of my temper. From the reputation and remembrance of my father, modesty and a manly character. From my mother, piety and beneficence.',
  'The Republic': 'I went down yesterday to the Piraeus with Glaucon the son of Ariston, that I might offer up my prayers to the goddess, and also because I wanted to see in what manner they would celebrate the festival.',
  'The Aeneid': 'Arms and the man I sing, who first made way, predestined exile, from the Trojan shore to Italy, the Lavinian coast; much was he buffeted on land and sea by violent celestial powers.',
  'Don Quixote': 'In a village of La Mancha, the name of which I have no desire to recall, there lived not long ago one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a coursing greyhound.',
  'The Divine Comedy': 'Midway upon the journey of our life I found myself within a forest dark, for the straightforward pathway had been lost. Ah me! how hard a thing it is to say what was this forest savage, rough, and stern.',
  'Hamlet': 'Who’s there? Nay, answer me. Stand and unfold yourself. Long live the King! Bernardo? He. You come most carefully upon your hour.',
  'Pride and Prejudice': 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
  'Crime and Punishment': 'On an exceptionally hot evening early in July a young man came out of the garret in which he lodged in S. Place and walked slowly, as though in hesitation, towards K. bridge.',
  'War and Peace': 'Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don’t tell me that this means war, I will have nothing more to do with you.',
  'The Great Gatsby': 'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since. “Whenever you feel like criticizing anyone,” he told me, “just remember that all the people in this world haven’t had the advantages that you’ve had.”',
  'The Metamorphosis': 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.',
  'Moby Dick': 'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
  'Frankenstein': 'I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation.',
  'The Picture of Dorian Gray': 'The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac.',
  'The Midnight Library': 'Nineteen years before she decided to die, Nora Seed sat in the warmth of the small library at Hazeldene School in the town of Bedford. She stared at a chessboard across from the librarian, Mrs. Elm.',
  'Dune': 'A beginning is the time for taking the most delicate care that the balances are correct. This every sister of the Bene Gesserit knows. To begin your study of the life of Muad’Dib, then, take care that you first place him in his time.',
  'The Name of the Wind': 'It was night again. The Waystone Inn lay in silence, and it was a silence of three parts. The most obvious part was a hollow, echoing quiet, made by things that were lacking.',
  'The Alchemist': 'The boy’s name was Santiago. Dusk was falling as the boy arrived with his herd at an abandoned church. The roof had fallen in long ago, and an enormous sycamore had grown on the spot where the sacristy had once stood.'
};

export function BookSamplerModal({ book, onClose }) {
  const { library, updateReadingShelf } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const currentShelfStatus = library[book.id] || null;

  // Retrieve famous opening or generate classical prose excerpt
  const openingText = FAMOUS_OPENINGS[book.title] || 
    book.description || 
    `“In the quiet hours before dawn, when the ink is still fresh upon the parchment and the world holds its breath, a journey begins in the pages of ${book.title}. Here begins the account of ${book.author}’s inquiry into truth, fate, and human longing.”`;

  const dropCap = openingText.trim().charAt(1) === '“' ? openingText.charAt(1) : openingText.charAt(0);
  const remainingProse = openingText.startsWith('“') ? openingText.slice(2) : openingText.slice(1);

  return (
    <div className="modal-backdrop sampler-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="sampler-parchment-sheet" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Antique Washi Tape on top */}
        <div className="washi-tape-strip washi-gold top-center" aria-hidden="true">
          <span className="washi-label-text">READER’S SAMPLER</span>
        </div>

        {/* Modal Close Button */}
        <button 
          type="button" 
          className="sampler-close-btn" 
          onClick={onClose}
          aria-label="Close reader sampler"
        >
          ✕
        </button>

        <div className="sampler-inner-grid">
          {/* Left Column: Book Cover & Quick Shelf Action */}
          <div className="sampler-cover-col">
            <div className="sampler-cover-wrap">
              <img 
                src={book.cover} 
                alt={book.title} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80";
                }}
              />
              <span className="sampler-category-badge">{book.category}</span>
            </div>

            <div className="sampler-shelf-widget">
              <span className="shelf-widget-label">Mark in your reading shelf:</span>
              <ReadingStatusSelect 
                status={currentShelfStatus}
                onChange={(newStatus) => updateReadingShelf(book.id, newStatus)}
                className="sampler-dropdown"
              />
            </div>

            <Link 
              to={`/books/${book.id}`} 
              className="btn btn-primary sampler-full-btn"
              onClick={onClose}
            >
              Open Full Book Folio →
            </Link>
          </div>

          {/* Right Column: Typeset Classical First Page */}
          <div className="sampler-manuscript-col">
            <div className="sampler-header">
              <div className="sampler-meta-tag">
                <span>LIBER PRIMUS · FOLIO I</span>
                <span>PAGES: {book.pages || 320}</span>
              </div>
              <h2 className="sampler-book-title">{book.title}</h2>
              <div className="sampler-author-line">
                <span>By {book.author}</span>
                <span className="sampler-bullet">•</span>
                <Rating value={book.rating || 4.5} />
                <span className="sampler-rating-val">{book.rating || 4.5}★</span>
              </div>
            </div>

            {/* Classical Typeset First Page Excerpt */}
            <div className="sampler-manuscript-body">
              <div className="sampler-chapter-heading">
                <span className="chapter-rubric">CHAPTER I</span>
                <span className="chapter-flourish">❦ ❦ ❦</span>
              </div>

              <div className="sampler-first-page-text">
                <span className="sampler-drop-cap">{dropCap}</span>
                <p className="sampler-prose-lead">
                  {remainingProse}
                </p>
              </div>

              {/* Annotation & Classical Notes */}
              <div className="sampler-scholar-annotation">
                <span className="annotation-icon">✎</span>
                <p className="annotation-text">
                  <em>Reader’s Marginal Note:</em> First edition text preserved in the BookVerse Classica collection. Available for reading shelf tracking and community review discussions.
                </p>
              </div>
            </div>

            <div className="sampler-footer-folio">
              <span>— FOLIO 1 OF {book.pages || 320} —</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSamplerModal;
