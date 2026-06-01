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
    <main
      style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        backgroundColor: '#111',
        minHeight: '100vh',
      }}
    >
      <CageStatus label="Cage 1" status={cage1} />
      <CageStatus label="Cage 2" status={cage2} />
    </main>
  );
}

function CageStatus({ label, status }: { label: string; status: string }) {
  const isClosed = status === 'closed';
  const isUnknown = status === 'unknown';

  return (
    <div
      style={{
        width: '400px',
        padding: '40px',
        borderRadius: '16px',
        backgroundColor: isUnknown ? '#444' : isClosed ? '#00aa00' : '#cc0000',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
        {label}
      </div>
      <div style={{ fontSize: '64px', fontWeight: 'bold' }}>
        {isUnknown ? 'UNKNOWN' : isClosed ? 'CLOSED' : 'OPEN'}
      </div>
    </div>
  );
}
