import { useMemo } from 'react';

// Classical literary excerpts on the gliding library pages
const SCATTERED_PAGES_DATA = [
  {
    id: 'wp-1',
    author: 'Homer',
    work: 'The Iliad',
    text: '“Like the generations of leaves, the lives of mortal men... The wind scatters some to the ground, but the lush forest sprouts others.”',
    verseNo: 'VI.146',
    shape: 'torn-folio',
    size: 'lg',
    speed: 32,
    delay: 0,
    depth: 'bg',
    startPos: { x: 6, y: 14 },
    glidePreset: 'glide-1',
    accent: '#d4a34b'
  },
  {
    id: 'wp-2',
    author: 'Dante Alighieri',
    work: 'Inferno',
    text: '“E quindi uscimmo a riveder le stelle.” (And thence we came forth to re-behold the stars.)',
    verseNo: 'XXXIV.139',
    shape: 'torn-fragment',
    size: 'md',
    speed: 26,
    delay: -7,
    depth: 'mid',
    startPos: { x: 80, y: 10 },
    glidePreset: 'glide-2',
    accent: '#e06c75'
  },
  {
    id: 'wp-3',
    author: 'William Shakespeare',
    work: 'Hamlet',
    text: '“There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy.”',
    verseNo: 'I.v.166',
    shape: 'torn-scrap',
    size: 'sm',
    speed: 36,
    delay: -14,
    depth: 'bg',
    startPos: { x: 16, y: 64 },
    glidePreset: 'glide-3',
    accent: '#7e3042'
  },
  {
    id: 'wp-4',
    author: 'Marcus Aurelius',
    work: 'Meditations',
    text: '“Time is like a river made up of the events which happen, and a violent stream; for as soon as a thing has been seen, it is carried away.”',
    verseNo: 'IV.43',
    shape: 'deckle-rect',
    size: 'lg',
    speed: 30,
    delay: -4,
    depth: 'mid',
    startPos: { x: 74, y: 52 },
    glidePreset: 'glide-4',
    accent: '#b88a43'
  },
  {
    id: 'wp-5',
    author: 'Franz Kafka',
    work: 'The Metamorphosis',
    text: '“I cannot make you understand. I cannot make anyone understand what is happening inside me.”',
    verseNo: 'Folio 12',
    shape: 'torn-corner',
    size: 'md',
    speed: 34,
    delay: -19,
    depth: 'bg',
    startPos: { x: 4, y: 42 },
    glidePreset: 'glide-1',
    accent: '#5bc0be'
  },
  {
    id: 'wp-6',
    author: 'Jane Austen',
    work: 'Pride & Prejudice',
    text: '“I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book!”',
    verseNo: 'Ch. XI',
    shape: 'torn-folio',
    size: 'md',
    speed: 25,
    delay: -11,
    depth: 'mid',
    startPos: { x: 86, y: 76 },
    glidePreset: 'glide-2',
    accent: '#d8b4e2'
  },
  {
    id: 'wp-7',
    author: 'Jorge Luis Borges',
    work: 'The Library of Babel',
    text: '“The Library will endure: illuminated, solitary, infinite, perfectly motionless, equipped with precious volumes, secret.”',
    verseNo: '1941',
    shape: 'torn-fragment',
    size: 'lg',
    speed: 38,
    delay: -16,
    depth: 'bg',
    startPos: { x: 40, y: 6 },
    glidePreset: 'glide-3',
    accent: '#c69a55'
  },
  {
    id: 'wp-8',
    author: 'Fyodor Dostoevsky',
    work: 'Crime & Punishment',
    text: '“Taking a new step, uttering a new word, is what people fear most.”',
    verseNo: 'Part I',
    shape: 'torn-scrap',
    size: 'sm',
    speed: 28,
    delay: -22,
    depth: 'mid',
    startPos: { x: 90, y: 34 },
    glidePreset: 'glide-4',
    accent: '#a5aec0'
  },
  {
    id: 'wp-9',
    author: 'Plato',
    work: 'The Republic',
    text: '“Books give a soul to the universe, wings to the mind, flight to the imagination, and life to everything.”',
    verseNo: 'Bk. VII',
    shape: 'deckle-rect',
    size: 'md',
    speed: 31,
    delay: -5,
    depth: 'bg',
    startPos: { x: 10, y: 86 },
    glidePreset: 'glide-1',
    accent: '#f39c12'
  },
  {
    id: 'wp-10',
    author: 'Umberto Eco',
    work: 'The Name of the Rose',
    text: '“Stat rosa pristina nomine, nomina nuda tenemus.” (The primal rose remains in its name, nothing but names hold we.)',
    verseNo: 'Cap. Ult.',
    shape: 'torn-corner',
    size: 'sm',
    speed: 35,
    delay: -15,
    depth: 'mid',
    startPos: { x: 62, y: 84 },
    glidePreset: 'glide-2',
    accent: '#e5b358'
  },
  {
    id: 'wp-11',
    author: 'Virgil',
    work: 'The Aeneid',
    text: '“Forsan et haec olim meminisse iuvabit.” (Perhaps even these things will be pleasing to remember one day.)',
    verseNo: 'I.203',
    shape: 'torn-fragment',
    size: 'md',
    speed: 33,
    delay: -27,
    depth: 'bg',
    startPos: { x: 26, y: 4 },
    glidePreset: 'glide-3',
    accent: '#7e3042'
  },
  {
    id: 'wp-12',
    author: 'Mary Shelley',
    work: 'Frankenstein',
    text: '“Beware; for I am fearless, and therefore powerful.”',
    verseNo: 'Ch. XX',
    shape: 'torn-scrap',
    size: 'sm',
    speed: 27,
    delay: -9,
    depth: 'mid',
    startPos: { x: 68, y: 20 },
    glidePreset: 'glide-4',
    accent: '#61afef'
  }
];

export function WindScatteredPages() {
  return (
    <div className="wind-scattered-stage" aria-hidden="true">
      {/* Gentle ambient breeze air currents */}
      <div className="wind-swirl-streams">
        <span className="wind-stream stream-1" />
        <span className="wind-stream stream-2" />
        <span className="wind-stream stream-3" />
        <span className="wind-stream stream-4" />
      </div>

      {/* Floating scattered torn manuscript pages — smoothly gliding */}
      <div className="wind-pages-container">
        {SCATTERED_PAGES_DATA.map((page) => (
          <div
            key={page.id}
            className={`wind-flying-page shape-${page.shape} size-${page.size} depth-${page.depth} ${page.glidePreset}`}
            style={{
              '--start-x': `${page.startPos.x}%`,
              '--start-y': `${page.startPos.y}%`,
              '--glide-duration': `${page.speed}s`,
              '--glide-delay': `${page.delay}s`,
              '--page-accent': page.accent
            }}
          >
            {/* Torn Paper Deckle Edges & Warm Texture */}
            <div className="flying-page-body">
              <div className="flying-page-top">
                <span className="flying-folio-num">{page.verseNo}</span>
                <span className="flying-author-mark">{page.author}</span>
              </div>

              {/* Manuscript Literary Excerpt in Clean Readable Script */}
              <div className="flying-page-content">
                <p className="flying-quote-text">{page.text}</p>
                <div className="flying-faded-lines">
                  <span className="f-line" />
                  <span className="f-line short" />
                </div>
              </div>

              {/* Work Citation & Star */}
              <div className="flying-page-footer">
                <span className="flying-work-title">{page.work}</span>
                <span className="flying-star-doodle">✦</span>
              </div>

              {/* Subtle edge crease */}
              <div className="flying-edge-crease" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WindScatteredPages;
