'use client';

import { useEffect, useState } from 'react';

// Which quadrant of the sprite to show based on cage1 + cage2 status
// Image layout: top-left=both open, top-right=both closed,
//               bottom-left=left open/right closed, bottom-right=left closed/right open
function getSpritePosition(cage1: string, cage2: string): string {
  if (cage1 === 'open'   && cage2 === 'open')   return '0% 0%';
  if (cage1 === 'closed' && cage2 === 'closed')  return '100% 0%';
  if (cage1 === 'open'   && cage2 === 'closed')  return '0% 100%';
  if (cage1 === 'closed' && cage2 === 'open')    return '100% 100%';
  return '50% 50%'; // unknown
}

export default function Home() {
  const [cage1, setCage1] = useState('unknown');
  const [cage2, setCage2] = useState('unknown');

  async function loadStatus() {
    try {
      const res = await fetch('/api/door', { cache: 'no-store' });
      const data = await res.json();
      setCage1(data.cage1 ?? 'unknown');
      setCage2(data.cage2 ?? 'unknown');
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadStatus();
    const timer = setInterval(loadStatus, 2000);
    return () => clearInterval(timer);
  }, []);

  const bgPosition = getSpritePosition(cage1, cage2);
  const isUnknown = cage1 === 'unknown' && cage2 === 'unknown';

  return (
    <main style={{
      width: '100%',
      minHeight: '100vh',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111',
      gap: '24px',
    }}>

      {/* Cage photo */}
      <div style={{
        width: '600px',
        height: '420px',
        backgroundImage: isUnknown ? 'none' : "url('/cage-states.png')",
        backgroundSize: '200% 200%',
        backgroundPosition: bgPosition,
        backgroundColor: isUnknown ? '#222' : undefined,
        borderRadius: '16px',
        border: '3px solid #444',
        transition: 'background-position 0.4s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {isUnknown && (
          <span style={{ color: '#888', fontSize: '22px' }}>Waiting for sensor data…</span>
        )}
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: '32px' }}>
        <StatusBadge label="Cage 1" status={cage1} />
        <StatusBadge label="Cage 2" status={cage2} />
      </div>
    </main>
  );
}

function StatusBadge({ label, status }: { label: string; status: string }) {
  const isClosed = status === 'closed';
  const isUnknown = status === 'unknown';
  const color = isUnknown ? '#888' : isClosed ? '#00cc44' : '#ff4444';
  const icon = isUnknown ? '?' : isClosed ? '🔒' : '🔓';

  return (
    <div style={{
      padding: '14px 32px',
      borderRadius: '12px',
      border: `2px solid ${color}`,
      textAlign: 'center',
      minWidth: '140px',
    }}>
      <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '6px', letterSpacing: '1px' }}>
        {label}
      </div>
      <div style={{ color, fontSize: '22px', fontWeight: 'bold' }}>
        {icon} {isUnknown ? 'UNKNOWN' : isClosed ? 'CLOSED' : 'OPEN'}
      </div>
    </div>
  );
}
