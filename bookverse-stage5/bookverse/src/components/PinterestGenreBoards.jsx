import { useState } from 'react';

export const GENRE_MOODBOARDS = [
  {
    id: 'Fantasy',
    name: 'Fantasy',
    tagline: 'MYTHIC WORLDS · UNBOUND',
    quote: '“Not all those who wander are lost.”',
    accent: '#d4a34b',
    paperType: 'parchment-scrap',
    tornClass: 'torn-pattern-1',
    washiStyle: 'washi-gold',
    washiAngle: '-12deg',
    washiPosition: 'top-left',
    hasPaperclip: false,
    hasWaxSeal: true,
    cardTilt: '-2.2deg',
    icon: '⚔️',
    motif: '✦ DRAGONS & SORCERY ✦',
    tags: ['#HighFantasy', '#MagicSystems', '#Worldbuilding', '#EpicQuests'],
    count: '14+ Books',
    featuredBook: 'The Name of the Wind',
    colorTheme: 'emerald',
    handwrittenNote: '✎ “beware the maps that whisper...”',
    doodleIcon: '✨'
  },
  {
    id: 'Science Fiction',
    name: 'Science Fiction',
    tagline: 'COSMIC REACH · BEYOND TIME',
    quote: '“The mystery of life isn\'t a problem to solve, but a reality to experience.”',
    accent: '#5bc0be',
    paperType: 'graph-blueprint',
    tornClass: 'torn-pattern-2',
    washiStyle: 'washi-holographic',
    washiAngle: '16deg',
    washiPosition: 'top-right',
    hasPaperclip: false,
    hasWaxSeal: false,
    cardTilt: '2.5deg',
    icon: '🪐',
    motif: '✦ STARSHIPS & DYSTOPIA ✦',
    tags: ['#SpaceOpera', '#Cyberpunk', '#HardSciFi', '#FutureHistories'],
    count: '12+ Books',
    featuredBook: 'Dune',
    colorTheme: 'sapphire',
    handwrittenNote: '✎ “coord 42.89 // warp vector locked”',
    doodleIcon: '🛸'
  },
  {
    id: 'Classics',
    name: 'Classics',
    tagline: 'TIMELESS PROSE · IMMORTAL VOICES',
    quote: '“There is no friend as loyal as a book.”',
    accent: '#e5b358',
    paperType: 'aged-book-leaf',
    tornClass: 'torn-pattern-3',
    washiStyle: 'washi-vintage-flora',
    washiAngle: '-6deg',
    washiPosition: 'top-center',
    hasPaperclip: true,
    hasWaxSeal: false,
    cardTilt: '-1.5deg',
    icon: '📜',
    motif: '✦ PHILOSOPHY & HERITAGE ✦',
    tags: ['#DarkAcademia', '#RussianClassics', '#MoralDilemmas', '#LiteraryArt'],
    count: '18+ Books',
    featuredBook: 'The Great Gatsby',
    colorTheme: 'amber',
    handwrittenNote: '✎ “faded ink from an 1884 printing”',
    doodleIcon: '✒️'
  },
  {
    id: 'Mystery',
    name: 'Mystery & Thriller',
    tagline: 'SHADOWS · WHODUNIT · NOIR',
    quote: '“The truth is rarely pure and never simple.”',
    accent: '#e06c75',
    paperType: 'noir-memo-sheet',
    tornClass: 'torn-pattern-4',
    washiStyle: 'washi-caution',
    washiAngle: '-18deg',
    washiPosition: 'top-left',
    hasPaperclip: true,
    hasWaxSeal: false,
    cardTilt: '1.9deg',
    icon: '🔍',
    motif: '✦ PLOT TWISTS & SECRETS ✦',
    tags: ['#Psychological', '#LockedRoom', '#NoirDetective', '#MindGames'],
    count: '10+ Books',
    featuredBook: 'The Silent Patient',
    colorTheme: 'ruby',
    handwrittenNote: '✎ “CASE #402: suspect seen at 2 AM”',
    doodleIcon: '🩸'
  },
  {
    id: 'Technology',
    name: 'Technology & Code',
    tagline: 'CRAFT · ARCHITECTURE · SYSTEMS',
    quote: '“Simplicity is prerequisite for reliability.”',
    accent: '#61afef',
    paperType: 'engineering-ledger',
    tornClass: 'torn-pattern-5',
    washiStyle: 'washi-drafting',
    washiAngle: '14deg',
    washiPosition: 'top-right',
    hasPaperclip: false,
    hasWaxSeal: false,
    cardTilt: '-2.4deg',
    icon: '⚡',
    motif: '✦ ALGORITHMS & CLEAN CODE ✦',
    tags: ['#CleanArchitecture', '#Algorithms', '#SystemDesign', '#Makers'],
    count: '8+ Books',
    featuredBook: 'Grokking Algorithms',
    colorTheme: 'cobalt',
    handwrittenNote: '✎ “while(alive) { read(); code(); }”',
    doodleIcon: '⚙️'
  },
  {
    id: 'Manga',
    name: 'Manga & Graphic Art',
    tagline: 'VISUAL SAGAS · DYNAMIC FORM',
    quote: '“If you don\'t take risks, you can\'t create a future.”',
    accent: '#f38ba8',
    paperType: 'manga-sketch',
    tornClass: 'torn-pattern-6',
    washiStyle: 'washi-halftone',
    washiAngle: '-10deg',
    washiPosition: 'top-left',
    hasPaperclip: true,
    hasWaxSeal: false,
    cardTilt: '2.1deg',
    icon: '🌸',
    motif: '✦ ILLUSTRATED ODYSSEY ✦',
    tags: ['#Seinen', '#Shonen', '#GraphicNarrative', '#MasterworkPanels'],
    count: '9+ Books',
    featuredBook: 'Slam Dunk',
    colorTheme: 'rose',
    handwrittenNote: '✎ “rough storyboard draft · panel 4”',
    doodleIcon: '✦'
  },
  {
    id: 'Fiction',
    name: 'Literary Fiction',
    tagline: 'HUMAN CONDITION · INTIMATE SOULS',
    quote: '“We read to know that we are not alone.”',
    accent: '#d8b4e2',
    paperType: 'deckled-cotton',
    tornClass: 'torn-pattern-7',
    washiStyle: 'washi-lavender',
    washiAngle: '8deg',
    washiPosition: 'top-center',
    hasPaperclip: false,
    hasWaxSeal: true,
    cardTilt: '-1.8deg',
    icon: '✨',
    motif: '✦ REFLECTIVE CHRONICLES ✦',
    tags: ['#Contemporary', '#CharacterDriven', '#PoeticRealism', '#DeepLore'],
    count: '16+ Books',
    featuredBook: 'The Alchemist',
    colorTheme: 'violet',
    handwrittenNote: '✎ “dog-eared on p. 142 — read again”',
    doodleIcon: '🌿'
  }
];

export function PinterestGenreBoards({ onSelectGenre, activeGenre = 'All' }) {
  const [hoveredGenre, setHoveredGenre] = useState(null);

  return (
    <div className="pinterest-genre-section">
      {/* Header */}
      <div className="pinterest-genre-head">
        <div>
          <span className="chapter-ribbon-badge">📌 PINTEREST SCRAPBOOK · MOODBOARD FOLIOS</span>
          <h2>Torn Paper Genre Moodboards</h2>
          <p className="handwritten-intro">
            Ripped scraps, coffee-stained marginalia, washi tape pins & hand-inked journal notes divided by genre.
          </p>
        </div>
        <div className="pinterest-head-actions">
          <button 
            type="button" 
            className={`pinterest-all-pill ${activeGenre === 'All' ? 'active' : ''}`}
            onClick={() => onSelectGenre('All')}
          >
            ✦ Show All Scraps
          </button>
        </div>
      </div>

      {/* Grid of Torn Paper Scrap Cards */}
      <div className="pinterest-board-grid">
        {GENRE_MOODBOARDS.map((g) => {
          const isSelected = activeGenre === g.id;
          const isHovered = hoveredGenre === g.id;

          return (
            <article 
              key={g.id} 
              className={`torn-paper-card paper-${g.paperType} ${g.tornClass} theme-${g.colorTheme} ${isSelected ? 'selected' : ''}`}
              style={{
                '--card-tilt': g.cardTilt,
                '--genre-accent': g.accent
              }}
              onMouseEnter={() => setHoveredGenre(g.id)}
              onMouseLeave={() => setHoveredGenre(null)}
              onClick={() => onSelectGenre(g.id)}
              tabIndex={0}
              role="button"
              aria-label={`Open ${g.name} handwritten scrap`}
              onKeyDown={(e) => e.key === 'Enter' && onSelectGenre(g.id)}
            >
              {/* Paper Clip fastener if applicable */}
              {g.hasPaperclip && (
                <div className="paper-clip-fastener" aria-hidden="true">
                  <div className="clip-loop-outer" />
                  <div className="clip-loop-inner" />
                </div>
              )}

              {/* Washi Tape Strip with torn tape edges */}
              <div 
                className={`washi-tape-strip ${g.washiStyle} ${g.washiPosition}`}
                style={{ transform: `rotate(${g.washiAngle})` }}
                aria-hidden="true"
              >
                <span className="washi-texture-lines" />
                <span className="washi-label-text">{g.name.toUpperCase()}</span>
              </div>

              {/* Wax Seal Stamp if applicable */}
              {g.hasWaxSeal && (
                <div className="wax-seal-stamp" aria-hidden="true">
                  <span className="seal-emblem">✦</span>
                  <span className="seal-rim" />
                </div>
              )}

              {/* Paper Scrap Header / Stamp */}
              <div className="torn-card-header">
                <div className="handwritten-stamp">
                  <span className="stamp-icon">{g.icon}</span>
                  <span className="stamp-text">FOLIO · {g.id.toUpperCase().slice(0, 4)}</span>
                </div>
                {isSelected && (
                  <span className="handwritten-active-pin">★ ACTIVE</span>
                )}
              </div>

              {/* Genre Identity in Simple Handwriting */}
              <div className="torn-card-body">
                <div className="handwritten-motif" style={{ color: g.accent }}>
                  {g.motif}
                </div>
                
                <h3 className="handwritten-genre-title">
                  {g.name}
                  <span className="title-doodle">{g.doodleIcon}</span>
                </h3>

                <span className="handwritten-tagline">
                  ~ {g.tagline.toLowerCase()} ~
                </span>

                <div className="handwritten-quote-box">
                  <span className="quote-mark-open">“</span>
                  <p className="handwritten-quote-text">
                    {g.quote.replace(/[“”"]/g, '')}
                  </p>
                  <span className="quote-mark-close">”</span>
                </div>

                {/* Casual margin scribble / pencil annotation */}
                <div className="handwritten-marginalia">
                  <span className="marginalia-pencil">{g.handwrittenNote}</span>
                </div>
              </div>

              {/* Tags & Action Row */}
              <div className="torn-card-footer">
                <div className="handwritten-tags">
                  {g.tags.map((t) => (
                    <span key={t} className="h-tag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="torn-action-row">
                  <span className="handwritten-count">
                    📓 {g.count}
                  </span>
                  <button 
                    type="button" 
                    className="handwritten-dive-btn"
                    style={{ borderColor: g.accent, color: isSelected ? '#101a2d' : g.accent }}
                  >
                    {isSelected ? 'Reading Scrap ✓' : 'Flip to Genre ➔'}
                  </button>
                </div>
              </div>

              {/* Paper texture overlay & torn drop shadow */}
              <div className="torn-paper-fibers" aria-hidden="true" />
              <div className="torn-corner-fold" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default PinterestGenreBoards;
