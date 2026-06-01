'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [cage1, setCage1] = useState('unknown');
  const [cage2, setCage2] = useState('unknown');

  async function loadStatus() {
    try {
      const res = await fetch('/api/door', { cache: 'no-store' });
      const data = await res.json();
      setCage1(data.cage1);
      setCage2(data.cage2);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadStatus();
    const timer = setInterval(loadStatus, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '60px',
      backgroundColor: '#111',
      minHeight: '100vh',
    }}>
      <CageStatus label="Cage 1" status={cage1} />
      <CageStatus label="Cage 2" status={cage2} />
    </main>
  );
}

function CageStatus({ label, status }: { label: string; status: string }) {
  const isClosed = status === 'closed';
  const isUnknown = status === 'unknown';
  const color = isUnknown ? '#888' : isClosed ? '#00cc44' : '#ff4444';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#ccc', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '2px' }}>
        {label}
      </div>
      <CageIcon isClosed={isClosed} isUnknown={isUnknown} />
      <div style={{ color, fontSize: '26px', fontWeight: 'bold', marginTop: '16px', letterSpacing: '3px' }}>
        {isUnknown ? 'UNKNOWN' : isClosed ? '🔒 CLOSED' : '🔓 OPEN'}
      </div>
    </div>
  );
}

function CageIcon({ isClosed, isUnknown }: { isClosed: boolean; isUnknown: boolean }) {
  const frame = '#7a4a1a';
  const bar = '#2a1200';
  const bg = isUnknown ? '#222' : isClosed ? '#082008' : '#200808';

  // Fixed cage body bars (always visible)
  const bodyBars = [38, 60, 82, 104, 126, 148];

  return (
    <svg viewBox="0 0 290 180" width="290" height="180" style={{ display: 'block' }}>

      {/* ── CAGE BODY ── */}
      <rect x="10" y="10" width="160" height="160" fill={bg} rx="3" />

      {/* Body vertical bars */}
      {bodyBars.map(x => (
        <line key={x} x1={x} y1="10" x2={x} y2="170" stroke={bar} strokeWidth="7" strokeLinecap="round" />
      ))}

      {/* Body mid-rail */}
      <line x1="10" y1="90" x2="170" y2="90" stroke={frame} strokeWidth="8" />

      {/* Body frame */}
      <rect x="10" y="10" width="160" height="160" fill="none" stroke={frame} strokeWidth="11" rx="3" />

      {/* ── DOOR ── */}
      {isClosed ? (
        /* Door CLOSED – bars continue flush to the right */
        <g>
          <rect x="170" y="10" width="70" height="160" fill={bg} />
          {[186, 207, 228].map(x => (
            <line key={x} x1={x} y1="10" x2={x} y2="170" stroke={bar} strokeWidth="7" strokeLinecap="round" />
          ))}
          <line x1="170" y1="90" x2="240" y2="90" stroke={frame} strokeWidth="8" />
          {/* Door frame */}
          <rect x="170" y="10" width="70" height="160" fill="none" stroke={frame} strokeWidth="11" rx="0" />
          {/* Latch */}
          <rect x="233" y="83" width="12" height="14" fill="#555" rx="3" />
          <circle cx="239" cy="90" r="5" fill="#333" />
        </g>
      ) : (
        /* Door OPEN – door swings out downward-right from hinge at (170, 10) */
        <g>
          {/* Opening gap (dashed outline) */}
          <rect x="170" y="10" width="70" height="160" fill={bg} opacity="0.25" />
          <rect x="170" y="10" width="70" height="160" fill="none"
            stroke={frame} strokeWidth="4" strokeDasharray="8 5" opacity="0.5" />

          {/* Door panel rotated ~80° from hinge at top-left of door (170,10) */}
          {/* SVG rotate(angle, cx, cy) — positive = clockwise */}
          <g transform="rotate(80, 170, 10)">
            <rect x="170" y="10" width="70" height="160" fill="#1c0e00" stroke={frame} strokeWidth="9" />
            {[186, 207, 228].map(x => (
              <line key={x} x1={x} y1="10" x2={x} y2="170" stroke={bar} strokeWidth="7" strokeLinecap="round" />
            ))}
            <line x1="170" y1="90" x2="240" y2="90" stroke={frame} strokeWidth="8" />
          </g>
        </g>
      )}
    </svg>
  );
}
