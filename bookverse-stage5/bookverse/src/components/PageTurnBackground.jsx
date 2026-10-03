import { useEffect, useState, useRef } from 'react';
import { RealisticPencils } from './RealisticPencils';
import { WindScatteredPages } from './WindScatteredPages';
import { LibrarySoundscape } from './LibrarySoundscape';

export const CHAPTERS = [
  { id: 'chapter-prologue', num: '0', roman: 'Prologue', title: 'The Open Cover', page: 1 },
  { id: 'chapter-library', num: '1', roman: 'Ch. I', title: 'The Grand Library', page: 14 },
  { id: 'chapter-shelf', num: '2', roman: 'Ch. II', title: 'Your Reading Shelf', page: 48 },
  { id: 'chapter-reviews', num: '3', roman: 'Ch. III', title: 'Voices & Critique', page: 92 },
  { id: 'chapter-goals', num: '4', roman: 'Ch. IV', title: 'Rituals & Streaks', page: 136 },
  { id: 'chapter-oracle', num: '5', roman: 'Ch. V', title: 'The AI Oracle', page: 180 },
  { id: 'chapter-clubs', num: '6', roman: 'Ch. VI', title: 'Literary Gatherings', page: 224 },
];

export const CHAPTER_PAGE_TEXTS = [
  // 0. Prologue: The Open Cover
  {
    left: {
      title: 'Jorge Luis Borges · La Biblioteca de Babel',
      dropCap: 'T',
      lead: 'The universe (which others call the Library) is composed of an indefinite and perhaps infinite number of hexagonal galleries.',
      verses: [
        'In the center of each gallery is a vast shaft, surrounded by a balustrade low enough to permit looking down into the abysses.',
        'From any hexagon one can see the interminable floors above and below: one after another in unvarying, divine symmetry.',
        'There are five shelves for each of the hexagon’s walls; each shelf contains thirty-two books of uniform and timeless format.',
        'Every volume contains four hundred and ten pages; each page, forty lines; each line, eighty black characters of eternal wisdom.',
      ],
      annotation: 'cf. Alexandria papyri: "The healing place of the soul"',
      cite: '— Ficciones (1944)',
    },
    right: {
      title: 'Homer · The Odyssey (Trans. Fagles)',
      dropCap: 'S',
      lead: 'Sing to me of the man, Muse, the man of twists and turns driven time and again off course, once he had plundered Troy.',
      verses: [
        'Many cities of men he saw and learned their minds, many pains he suffered, heartsick on the open wine-dark sea,',
        'fighting to save his life and bring his comrades home. But could he save them from disaster, close as they were?',
        'Launch out on his story, Muse, daughter of Zeus, start from where you will — sing for our time, sing for every age.',
        'When young Dawn with her rose-red fingers shone once more, the wanderer set forth into the boundless deep.',
      ],
      annotation: '★ Homeric hexameter, Book I, lines 1–12',
      cite: '— The Odyssey, Book I',
    },
  },
  // 1. The Grand Library
  {
    left: {
      title: 'Italo Calvino · Why Read the Classics',
      dropCap: 'A',
      lead: 'A classic is a book that has never finished saying what it has to say.',
      verses: [
        'The classics are those books which arrive bearing the aura of previous interpretations and annotations.',
        'A classic does not necessarily teach us something we did not know; rather, we discover in it something we always knew.',
        'Your classic author is the one you cannot feel indifferent to, who helps you define yourself in relation to him.',
        'To read the classics is better than not to read them; to re-read them is to become aware of oneself afresh.',
      ],
      annotation: 'nota bene: timeless dialogue between centuries',
      cite: '— Why Read the Classics (1991)',
    },
    right: {
      title: 'Marcus Aurelius · Meditations',
      dropCap: 'D',
      lead: 'Dwell on the beauty of life. Watch the stars, and see yourself running with them in harmony.',
      verses: [
        'Constantly regard the universe as one living being, having one substance and one all-embracing soul.',
        'Time is a river, a violent current of events, glimpsed once and then swept along by the unstoppable torrent.',
        'The soul becomes dyed with the color of its thoughts; steep it in thoughts of nobility, courage, and tranquil calm.',
        'Nowhere can man find a quieter or more untroubled retreat than in his own mind and well-read pages.',
      ],
      annotation: 'q.v. Stoic Codex · Book IV, fragment 3',
      cite: '— Meditations, IV.3',
    },
  },
  // 2. Your Reading Shelf
  {
    left: {
      title: 'Dante Alighieri · La Divina Commedia',
      dropCap: 'N',
      lead: 'Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura, ché la diritta via era smarrita.',
      verses: [
        'Midway upon the journey of our life I found myself within a forest dark, for the straightforward pathway had been lost.',
        'Ah me! how hard a thing it is to say what was this forest savage, rough, and stern, which in the very thought renews fear.',
        'So bitter is it, death is little more; but of the good to treat, which there I found, speak will I of the other things I saw.',
        'I cannot well repeat how there I entered, so full was I of slumber at the moment in which I had abandoned the true way.',
      ],
      annotation: 'Trecento Florentine folios · Canto I',
      cite: '— Inferno, Canto I, 1–12',
    },
    right: {
      title: 'Miguel de Cervantes · Don Quixote',
      dropCap: 'I',
      lead: 'In a village of La Mancha, the name of which I have no desire to recall, there lived an hidalgo.',
      verses: [
        'His spear already in the lance-rack, an old buckler, a lean hack, and a coursing greyhound ready at hand.',
        'He gave himself up to the reading of books of chivalry with such ardour that he almost entirely neglected the chase.',
        'His imagination became filled with all that he read in the books, with enchantments, quarrels, battles, and challenges.',
        'Finally, having lost his wits completely, he stumbled upon the strangest fancy that ever entered a madman’s brain.',
      ],
      annotation: '★ Knight-errant of the printed word · Part I',
      cite: '— El ingenioso hidalgo Don Quijote',
    },
  },
  // 3. Voices & Critique
  {
    left: {
      title: 'Fyodor Dostoevsky · Crime and Punishment',
      dropCap: 'I',
      lead: 'It takes something more than intelligence to act intelligently.',
      verses: [
        'Pain and suffering are always inevitable for a large intelligence and a deep heart in this world.',
        'The really great men must, I think, experience great sadness and contemplation upon this earth.',
        'To go wrong in one’s own way is better than to go right in someone else’s borrowed footsteps.',
        'Man grows used to everything, the scoundrel! Yet through agony he reaches upward for redemption.',
      ],
      annotation: 'Marginal note: St. Petersburg heatwave, Haymarket',
      cite: '— Part III, Chapter V (1866)',
    },
    right: {
      title: 'Leo Tolstoy · War and Peace',
      dropCap: 'W',
      lead: 'We can know only that we know nothing. And that is the highest degree of human wisdom.',
      verses: [
        'If we admit that human life can be ruled by reason alone, then all possibility of life is annihilated.',
        'Everything I know, I know because I love; everything exists, only because I love and contemplate.',
        'There is no greatness where there is no simplicity, goodness, and steadfast truth.',
        'The two most powerful warriors in this world are patience and time; they conquer every campaign.',
      ],
      annotation: '★ Borodino field & Pierre’s awakening',
      cite: '— War and Peace, Vol. IV',
    },
  },
  // 4. Rituals & Streaks
  {
    left: {
      title: 'Seneca · Epistulae Morales ad Lucilium',
      dropCap: 'A',
      lead: 'As is a tale, so is life: not how long it is, but how good it is, is what matters.',
      verses: [
        'Every single day should be lived as though it were all of life, a completed span of reflection and deed.',
        'If you really want to escape the things that harass you, what you need is not a different place, but to be a different person.',
        'Leisure without books is death, and the burial of a living man.',
        'Associate with people who are likely to improve you; welcome those whom you are capable of elevating.',
      ],
      annotation: 'Epistulae ad Lucilium · Ep. LXXXII',
      cite: '— Seneca the Younger',
    },
    right: {
      title: 'Franz Kafka · Die Verwandlung',
      dropCap: 'O',
      lead: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed.',
      verses: [
        'He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed.',
        'His numerous legs, pitifully thin compared to the rest of his bulk, flickered helplessly before his eyes.',
        '“What’s happened to me?” he thought. It was not a dream. His room, a proper human room, lay quietly.',
        'A collection of textile samples lay spread out on the table; above it hung a picture framed in gilt.',
      ],
      annotation: 'Prague 1915 · Metaphor of alienation',
      cite: '— The Metamorphosis',
    },
  },
  // 5. The AI Oracle
  {
    left: {
      title: 'Umberto Eco · Il nome della rosa',
      dropCap: 'T',
      lead: 'The order that our mind imagines is like a net, or like a ladder, built to attain something.',
      verses: [
        'Books are not made to be believed blindly, but to be subjected to passionate inquiry and deep critique.',
        'When we consider a book, we must not ask what it says but what it means, as ancient masters understood.',
        'The secret of the abbey library was guarded by labyrinthine mirrors, rare parchment, and silent scholars.',
        'Stat rosa pristina nomine, nomina nuda tenemus: yesterday’s rose endures only in its eternal name.',
      ],
      annotation: 'Finis Africae scriptorium folio 42',
      cite: '— The Name of the Rose (1980)',
    },
    right: {
      title: 'James Joyce · Ulysses',
      dropCap: 'E',
      lead: 'Every life is in many days, day after day. We walk through ourselves, meeting robbers, ghosts, and giants.',
      verses: [
        'History is a nightmare from which I am trying to awake, Stephen Dedalus murmured softly.',
        'Think you’re escaping and run into yourself. Longest way round is the shortest way home.',
        'A man of genius makes no mistakes. His errors are volitional and are the portals of discovery.',
        'Yes and his heart was going like mad and yes I said yes I will Yes.',
      ],
      annotation: '★ Martello Tower to Dublin Bay · June 16, 1904',
      cite: '— Ulysses (Scylla & Charybdis)',
    },
  },
  // 6. Literary Gatherings
  {
    left: {
      title: 'Aristotle · Poetics & Nicomachean Ethics',
      dropCap: 'P',
      lead: 'Poetry is something more philosophic and of graver import than history, for it addresses the universal.',
      verses: [
        'Friendship is a single soul dwelling in two bodies; between reader and writer, a perpetual communion.',
        'To learn gives the liveliest pleasure, not only to the philosopher but to humanity in general.',
        'Through katharsis the human soul is cleansed by pity, fear, and wonder at tragic grandeur.',
        'We are what we repeatedly do. Excellence, then, is not an act, but a reading habit.',
      ],
      annotation: 'Lyceum codex · Book VIII, Friendship',
      cite: '— Aristotle, Nicomachean Ethics',
    },
    right: {
      title: 'Plato · Res Publica',
      dropCap: 'B',
      lead: 'Books give a soul to the universe, wings to the mind, flight to the imagination, and life to everything.',
      verses: [
        'The soul of man is immortal and its desire to learn can never be extinguished by temporal darkness.',
        'Let us imagine a subterranean cavern with an entrance open to the light; here men sit enchained.',
        'He who is freed from shadows turns toward the blazing sun of truth and radiant understanding.',
        'The philosopher king is one who has learned to read the eternal ideas written across the cosmos.',
      ],
      annotation: '★ Allegory of the Cave · Book VII',
      cite: '— Plato, The Republic',
    },
  },
];

export function PageTurnBackground() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('forward');
  const prevIndexRef = useRef(0);
  const isUserClickRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find which chapter is currently in viewport
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let currentIndex = 0;

      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          currentIndex = i;
          break;
        }
      }

      if (currentIndex !== prevIndexRef.current) {
        setFlipDirection(currentIndex > prevIndexRef.current ? 'forward' : 'backward');
        setIsFlipping(true);
        prevIndexRef.current = currentIndex;
        setActiveChapterIndex(currentIndex);

        setTimeout(() => {
          setIsFlipping(false);
        }, 650);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (id, index) => {
    const el = document.getElementById(id);
    if (el) {
      isUserClickRef.current = true;
      setFlipDirection(index > activeChapterIndex ? 'forward' : 'backward');
      setIsFlipping(true);
      setActiveChapterIndex(index);
      prevIndexRef.current = index;

      el.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        setIsFlipping(false);
        isUserClickRef.current = false;
      }, 700);
    }
  };

  const currentCh = CHAPTERS[activeChapterIndex] || CHAPTERS[0];
  const currentTexts = CHAPTER_PAGE_TEXTS[activeChapterIndex] || CHAPTER_PAGE_TEXTS[0];

  return (
    <>
      {/* Ambient Library Soundscape (Soothing rain & hearth ambience) */}
      <LibrarySoundscape />

      {/* Wind-blown scattering manuscript pages flying across the library */}
      <WindScatteredPages />

      {/* 3D Realistic Background Book Spread */}
      <div className="book-page-turn-stage" aria-hidden="true">
        {/* Ambient atmospheric lighting */}
        <div className="book-ambient-glow" />
        
        {/* Floating literary particles / golden book dust */}
        <div className="book-particles">
          {[...Array(12)].map((_, i) => (
            <span key={i} className={`particle p-${i + 1}`} />
          ))}
        </div>

        {/* 3D Open Tome Structure */}
        <div className="book-tome">
          {/* Outer leather binding & gilded edge border */}
          <div className="book-binding-edge" />

          {/* Left Page (Verso) */}
          <div className="book-page book-page-left">
            <div className="page-paper-texture" />
            <div className="page-header-mark">
              <span>BOOKVERSE CLASSICA</span>
              <span>LIBRIS NO. {currentCh.page}</span>
            </div>

            {/* Classical Manuscript Literature Text */}
            <div className="page-manuscript-body">
              <div className="manuscript-head-title">{currentTexts.left.title}</div>
              <div className="manuscript-first-p">
                <span className="manuscript-drop-cap">{currentTexts.left.dropCap}</span>
                <span className="manuscript-lead-prose">{currentTexts.left.lead}</span>
              </div>
              <div className="manuscript-body-lines">
                {currentTexts.left.verses.map((verse, i) => (
                  <div key={i} className="manuscript-line-row">
                    <span className="manuscript-line-num">{(i + 1) * 4}</span>
                    <span className="manuscript-line-text">{verse}</span>
                  </div>
                ))}
              </div>
              {currentTexts.left.annotation && (
                <div className="manuscript-reader-marginalia">
                  <span className="marginalia-pencil-handwriting">✎ {currentTexts.left.annotation}</span>
                </div>
              )}
              <div className="manuscript-citation">{currentTexts.left.cite}</div>
            </div>

            <div className="page-watermark">
              <span className="watermark-roman">{currentCh.roman}</span>
            </div>
            <div className="page-spine-shadow left" />
            <div className="page-footer-folio">
              <span>— {currentCh.page} —</span>
            </div>
          </div>

          {/* Center Spine Seam / Crease */}
          <div className="book-spine">
            <div className="spine-deep-crease" />
            <div className="spine-stitches" />
          </div>

          {/* Right Page (Recto) */}
          <div className="book-page book-page-right">
            <div className="page-paper-texture" />
            <div className="page-header-mark">
              <span>{currentCh.title.toUpperCase()}</span>
              <span>FOLIO {currentCh.page + 1}</span>
            </div>

            {/* Classical Manuscript Literature Text */}
            <div className="page-manuscript-body">
              <div className="manuscript-head-title">{currentTexts.right.title}</div>
              <div className="manuscript-first-p">
                <span className="manuscript-drop-cap">{currentTexts.right.dropCap}</span>
                <span className="manuscript-lead-prose">{currentTexts.right.lead}</span>
              </div>
              <div className="manuscript-body-lines">
                {currentTexts.right.verses.map((verse, i) => (
                  <div key={i} className="manuscript-line-row">
                    <span className="manuscript-line-num">{(i + 1) * 4}</span>
                    <span className="manuscript-line-text">{verse}</span>
                  </div>
                ))}
              </div>
              {currentTexts.right.annotation && (
                <div className="manuscript-reader-marginalia right-margin">
                  <span className="marginalia-pencil-handwriting">✎ {currentTexts.right.annotation}</span>
                </div>
              )}
              <div className="manuscript-citation">{currentTexts.right.cite}</div>
            </div>

            <div className="page-watermark">
              <span className="watermark-symbol">✦</span>
            </div>
            <div className="page-spine-shadow right" />
            <div className="page-footer-folio">
              <span>— {currentCh.page + 1} —</span>
            </div>
          </div>

          {/* Dynamic 3D Flipping Leaf (turns on scroll) */}
          <div 
            className={`book-page-flipper ${isFlipping ? `flipping-${flipDirection}` : ''}`}
            key={activeChapterIndex}
          >
            {/* Front of the turning leaf */}
            <div className="flipper-face flipper-front">
              <div className="page-paper-texture" />
              <div className="flipper-curl-shadow" />
              <div className="flipper-content">
                <span className="flipper-chapter">{currentCh.roman}</span>
                <span className="flipper-title">{currentCh.title}</span>
                <div className="flipper-manuscript-preview">
                  <span className="flipper-line" />
                  <span className="flipper-line short" />
                  <span className="flipper-line" />
                </div>
              </div>
            </div>

            {/* Back of the turning leaf (settles on left) */}
            <div className="flipper-face flipper-back">
              <div className="page-paper-texture" />
              <div className="flipper-curl-shadow back" />
              <div className="flipper-content">
                <span className="flipper-folio">p. {currentCh.page}</span>
                <div className="flipper-manuscript-preview">
                  <span className="flipper-line short" />
                  <span className="flipper-line" />
                </div>
              </div>
            </div>
          </div>

          {/* Realistic Scholar & Drafting Pencils resting over the pages */}
          <RealisticPencils />

          {/* Page stack depth effect on both edges */}
          <div className="book-page-stack left" />
          <div className="book-page-stack right" />
        </div>
      </div>

      {/* Floating Bookmark Ribbon Navigator */}
      <aside className="chapter-bookmark-nav" aria-label="Book Chapters Navigator">
        <div className="bookmark-head">
          <span className="bookmark-icon">📖</span>
          <span className="bookmark-page-label">
            {currentCh.roman} · p.{currentCh.page}
          </span>
        </div>
        <div className="bookmark-ribbons">
          {CHAPTERS.map((ch, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <button
                key={ch.id}
                type="button"
                className={`bookmark-ribbon ${isActive ? 'active' : ''}`}
                onClick={() => scrollToChapter(ch.id, idx)}
                title={`${ch.roman}: ${ch.title}`}
                aria-label={`Jump to ${ch.roman}: ${ch.title}`}
              >
                <span className="ribbon-tab">{ch.roman}</span>
                <span className="ribbon-tooltip">{ch.title}</span>
                {isActive && <span className="ribbon-glow" />}
              </button>
            );
          })}
        </div>
        <div className="bookmark-hint">
          <span>SCROLL TO TURN PAGES</span>
          <span className="bookmark-arrow">↓</span>
        </div>
      </aside>
    </>
  );
}

export default PageTurnBackground;
