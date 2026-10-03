export function RealisticPencils({ className = '' }) {
  return (
    <div className={`book-pencils-container ${className}`} aria-hidden="true">
      {/* ========================================================
          PENCIL 1: Classic Scholar's Yellow/Gold No. 2 HB Pencil
          Resting on the right page margin with 3D elevation
          ======================================================== */}
      <div className="desk-pencil scholar-pencil">
        <svg 
          viewBox="0 0 380 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="pencil-svg"
        >
          <defs>
            {/* Wood barrel facet gradients */}
            <linearGradient id="pencilBarrel" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffd166" />
              <stop offset="25%" stopColor="#f39c12" />
              <stop offset="50%" stopColor="#d68910" />
              <stop offset="75%" stopColor="#e67e22" />
              <stop offset="100%" stopColor="#b9770e" />
            </linearGradient>

            {/* Brass Ferrule gradient */}
            <linearGradient id="ferruleGrad" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f7dc6f" />
              <stop offset="30%" stopColor="#f1c40f" />
              <stop offset="60%" stopColor="#b7950b" />
              <stop offset="85%" stopColor="#d4ac0d" />
              <stop offset="100%" stopColor="#7d6608" />
            </linearGradient>

            {/* Pink Eraser gradient */}
            <linearGradient id="eraserGrad" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f1948a" />
              <stop offset="40%" stopColor="#ec7063" />
              <stop offset="70%" stopColor="#c0392b" />
              <stop offset="100%" stopColor="#922b21" />
            </linearGradient>

            {/* Cedar Wood Sharpened Tip gradient */}
            <linearGradient id="cedarGrad" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fae5d3" />
              <stop offset="50%" stopColor="#edbb99" />
              <stop offset="100%" stopColor="#d35400" />
            </linearGradient>

            {/* Graphite tip */}
            <linearGradient id="graphiteGrad" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#566573" />
              <stop offset="50%" stopColor="#2c3e50" />
              <stop offset="100%" stopColor="#17202a" />
            </linearGradient>
          </defs>

          {/* 1. Pink Rubber Eraser */}
          <rect x="2" y="7" width="22" height="18" rx="4" fill="url(#eraserGrad)" />
          <path d="M2 11 Q1 16 2 21" stroke="#fadbd8" strokeWidth="1" opacity="0.6" />

          {/* 2. Brass Ferrule with crimp rings */}
          <rect x="22" y="6" width="30" height="20" rx="1" fill="url(#ferruleGrad)" />
          {/* Crimp grooves */}
          <line x1="28" y1="6" x2="28" y2="26" stroke="#7d6608" strokeWidth="1.5" />
          <line x1="32" y1="6" x2="32" y2="26" stroke="#fef9e7" strokeWidth="1" opacity="0.8" />
          <line x1="42" y1="6" x2="42" y2="26" stroke="#7d6608" strokeWidth="1.5" />
          <line x1="46" y1="6" x2="46" y2="26" stroke="#fef9e7" strokeWidth="1" opacity="0.8" />

          {/* 3. Hexagonal Yellow Barrel */}
          <rect x="52" y="7" width="260" height="18" fill="url(#pencilBarrel)" />
          {/* Hexagon facet ridges */}
          <line x1="52" y1="12" x2="312" y2="12" stroke="#fef5e7" strokeWidth="1" opacity="0.5" />
          <line x1="52" y1="19" x2="312" y2="19" stroke="#935116" strokeWidth="1" opacity="0.4" />

          {/* Gold foil imprint */}
          <text 
            x="145" 
            y="18.5" 
            fill="#5b2c05" 
            fontSize="7" 
            fontWeight="bold" 
            fontFamily="DM Sans, sans-serif" 
            letterSpacing="2.5"
            opacity="0.85"
          >
            BOOKVERSE ✦ NO. 2 ✦ HB
          </text>

          {/* 4. Sharpened Cedar Wood Cone */}
          <polygon points="312,7 360,16 312,25" fill="url(#cedarGrad)" />
          {/* Scalloped whittled edges */}
          <path d="M312,7 Q318,11 312,15 Q318,20 312,25" fill="#e59866" opacity="0.7" />

          {/* 5. Honed Graphite Tip */}
          <polygon points="352,14.5 376,16 352,17.5" fill="url(#graphiteGrad)" />
          <circle cx="376" cy="16" r="0.8" fill="#111" />
        </svg>
      </div>

      {/* ========================================================
          PENCIL 2: Matte Charcoal Drafting Pencil
          Resting angled at bottom-left corner with graphite point
          ======================================================== */}
      <div className="desk-pencil drafting-pencil">
        <svg 
          viewBox="0 0 320 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="pencil-svg"
        >
          <defs>
            <linearGradient id="draftingBarrel" x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4a5568" />
              <stop offset="35%" stopColor="#2d3748" />
              <stop offset="70%" stopColor="#1a202c" />
              <stop offset="100%" stopColor="#171923" />
            </linearGradient>
            <linearGradient id="draftingWood" x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#edd8b7" />
              <stop offset="60%" stopColor="#cb9d67" />
              <stop offset="100%" stopColor="#8d5b2d" />
            </linearGradient>
          </defs>

          {/* Dip cap / end crown in brass */}
          <rect x="4" y="6" width="10" height="16" rx="2" fill="#d4af37" />

          {/* Matte Black Barrel */}
          <rect x="14" y="6" width="230" height="16" rx="1" fill="url(#draftingBarrel)" />
          <line x1="14" y1="11" x2="244" y2="11" stroke="#718096" strokeWidth="0.8" opacity="0.4" />
          <line x1="14" y1="17" x2="244" y2="17" stroke="#000000" strokeWidth="0.8" opacity="0.6" />

          {/* Silver foil imprint */}
          <text 
            x="85" 
            y="16.5" 
            fill="#e2e8f0" 
            fontSize="6" 
            fontWeight="bold" 
            fontFamily="DM Sans, sans-serif" 
            letterSpacing="2"
            opacity="0.8"
          >
            AESTHETICA ✦ 2B SOFT GRAPHITE
          </text>

          {/* Sharpened natural cedar cone */}
          <polygon points="244,6 295,14 244,22" fill="url(#draftingWood)" />
          <path d="M244,6 Q250,10 244,14 Q250,18 244,22" fill="#a06634" opacity="0.6" />

          {/* Fine 2B Graphite Lead */}
          <polygon points="285,12.5 312,14 285,15.5" fill="#1a202c" />
        </svg>
      </div>

      {/* ========================================================
          PENCIL SHAVINGS & MARGIN SKETCH ORNAMENT
          ======================================================== */}
      <div className="pencil-curled-shaving" />
      <div className="pencil-graphite-point" />
    </div>
  );
}

export default RealisticPencils;
