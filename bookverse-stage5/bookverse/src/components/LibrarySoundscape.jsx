import { useState, useEffect, useRef } from 'react';

export function LibrarySoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const audioCtxRef = useRef(null);
  const rainGainRef = useRef(null);
  const fireGainRef = useRef(null);
  const masterGainRef = useRef(null);
  const isSetupRef = useRef(false);

  // Setup Web Audio nodes for procedural rain and hearth crackle
  const initAudio = () => {
    if (isSetupRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // 1. Soft Library Rain (Pink/Brown noise passed through lowpass filter)
      const bufferSize = ctx.sampleRate * 2;
      const rainBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = rainBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }

      const rainNoise = ctx.createBufferSource();
      rainNoise.buffer = rainBuffer;
      rainNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 650; // Deep gentle rain

      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.6;
      rainGainRef.current = rainGain;

      rainNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(master);
      rainNoise.start(0);

      // 2. Soft Crackling Hearth (sparse high-pass filtered pulses)
      const fireBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const fireData = fireBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Sparse pops
        if (Math.random() < 0.0018) {
          fireData[i] = (Math.random() * 2 - 1) * 0.8;
        } else {
          fireData[i] = 0;
        }
      }

      const fireNoise = ctx.createBufferSource();
      fireNoise.buffer = fireBuffer;
      fireNoise.loop = true;

      const fireFilter = ctx.createBiquadFilter();
      fireFilter.type = 'highpass';
      fireFilter.frequency.value = 1200;

      const fireGain = ctx.createGain();
      fireGain.gain.value = 0.35;
      fireGainRef.current = fireGain;

      fireNoise.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(master);
      fireNoise.start(0);

      isSetupRef.current = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  };

  const toggleSoundscape = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (isPlaying) {
        if (masterGainRef.current) {
          masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
        }
        setIsPlaying(false);
      } else {
        if (masterGainRef.current) {
          masterGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.2);
        }
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (masterGainRef.current && audioCtxRef.current && isPlaying) {
      masterGainRef.current.gain.setTargetAtTime(val, audioCtxRef.current.currentTime, 0.05);
    }
  };

  return (
    <div className={`soundscape-widget ${isPlaying ? 'playing' : ''}`}>
      <button 
        type="button" 
        className="soundscape-toggle-btn"
        onClick={toggleSoundscape}
        title={isPlaying ? "Mute Library Soundscape" : "Listen to Cozy Library Rain & Hearth"}
        aria-label="Toggle ambient library soundscape"
      >
        <span className="sound-icon">{isPlaying ? '🔊' : '🎧'}</span>
        <span className="sound-label">
          {isPlaying ? 'Ambience Active' : 'Library Ambience'}
        </span>
        {isPlaying && <span className="sound-waves" />}
      </button>

      {isPlaying && (
        <div className="soundscape-vol-slider">
          <span className="vol-icon">🔉</span>
          <input 
            type="range" 
            min="0.05" 
            max="0.6" 
            step="0.01" 
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Soundscape volume"
          />
        </div>
      )}
    </div>
  );
}

export default LibrarySoundscape;
