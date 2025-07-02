import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ScoreSubmitPageProps {
  image_base64: string;
  number_of_moves: number;
  name_for_image: string;
  todays_date: string;
  score: number;
}

export default function ScoreSubmitPage({ image_base64, number_of_moves, name_for_image, todays_date, score }: ScoreSubmitPageProps) {
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim() === '' ? 'no_username' : username,
          image_base64,
          name_for_image,
          number_of_moves,
          todays_date,
          score,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Submission failed');
      } else {
        router.push('/vote');
      }
    } catch {
      setError('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#E599FE',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'UglyDave', Helvetica, Arial, sans-serif",
    }}>
      <div style={{ fontFamily: "'UglyDave', Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 32, marginBottom: 8 }}>your score is {score}</div>
      <form id="score-submit-form" onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            fontSize: 32,
            fontWeight: 700,
            fontFamily: "'UglyDave', Helvetica, Arial, sans-serif",
            padding: 8,
            marginBottom: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            textAlign: 'center',
            width: `${Math.max(username.length, 8) + 1}ch`,
            transition: 'width 0.2s',
          }}
          required
        />
        <div
          style={{
            width: `${Math.max(username.length, 8) + 1}ch`,
            height: 2,
            background: '#000',
            marginBottom: 16,
            marginTop: 0,
            transition: 'width 0.2s',
          }}
        />
      </form>
      <button
        type="submit"
        form="score-submit-form"
        disabled={submitting}
        className="pink-button"
        style={{
          fontFamily: 'Barlow_Condensed, Arial, Helvetica, sans-serif',
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 48,
          zIndex: 2,
        }}
      >
        {submitting ? 'submitting...' : (username.trim() === '' ? 'skip' : 'submit')}
      </button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
} 