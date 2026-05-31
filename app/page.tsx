'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('unknown');

  async function loadStatus() {
    try {
      const res = await fetch("/api/door", {cache: "no-store",});
      const data = await res.json();

      setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadStatus();

    const timer = setInterval(loadStatus, 2000);

    return () => clearInterval(timer);
  }, []);

  const isClosed = status === 'closed';

  return (
    <main
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isClosed ? '#00aa00' : '#cc0000',
        color: 'white',
        fontSize: '80px',
        fontWeight: 'bold',
      }}
    >
      {isClosed ? 'CLOSED' : 'OPEN'}
    </main>
  );
}
