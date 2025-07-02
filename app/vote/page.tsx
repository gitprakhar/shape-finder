/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VotePage() {
  const [entries, setEntries] = useState<{ id: number; image_base64: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/entries/random-pair")
      .then(res => res.json())
      .then(data => setEntries(data.rows || []))
      .finally(() => setLoading(false));
  }, []);

  const handleVote = async (id: number) => {
    setVoting(true);
    await fetch("/api/entries/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.push("/leaderboard");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#E599FE',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Heading */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <span style={{
          fontFamily: 'Barlow_Condensed, Arial, Helvetica, sans-serif',
          fontWeight: 700,
          fontSize: 32,
          color: '#000',
          letterSpacing: 2,
          textDecoration: 'underline',
        }}>
          vote
        </span>
      </div>
      {/* Drawings */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 120,
        padding: 100,
      }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          entries.map((entry, idx) => (
            <button
              key={entry.id}
              onClick={() => handleVote(entry.id)}
              disabled={voting}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: voting ? 'not-allowed' : 'pointer',
                outline: 'none',
              }}
            >
              <img
                src={entry.image_base64}
                alt={`Drawing ${idx + 1}`}
                style={{ width: 220, height: 220, objectFit: 'contain', boxShadow: '0 0 0 2px #000' }}
              />
            </button>
          ))
        )}
      </div>
      {/* Buttons at the bottom */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        zIndex: 2,
      }}>
        <button
          onClick={() => window.location.href = '/'}
          className="pink-button"
          style={{ fontFamily: 'Barlow_Condensed, Arial, Helvetica, sans-serif' }}
        >
          play-again
        </button>
        <button
          onClick={() => router.push('/leaderboard')}
          className="secondary-button"
          style={{ fontFamily: 'Barlow_Condensed, Arial, Helvetica, sans-serif' }}
        >
          leaderboard
        </button>
      </div>
    </div>
  );
} 