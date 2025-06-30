/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<{ image_base64: string; username: string; score: number }[]>([]);

  useEffect(() => {
    fetch("/api/entries/last3")
      .then(res => res.json())
      .then(data => setEntries(data.entries || []));
  }, []);

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
      {/* Leaderboard heading above images grid */}
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
          leaderboard
        </span>
      </div>
      {/* Images grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        justifyItems: 'center',
        gap: 64,
        padding: 100,
      }}>
        {entries.map((entry, idx) => (
          entry.image_base64 && (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={entry.image_base64}
                alt="Drawing"
                style={{ width: 220, height: 220, objectFit: 'contain' }}
              />
              <div style={{
                fontFamily: "'UglyDave', Helvetica, Arial, sans-serif",
                fontSize: 20,
                color: '#000',
                marginTop: 12,
                textAlign: 'center',
              }}>
                {entry.username} | {entry.score}
              </div>
            </div>
          )
        ))}
      </div>
      {/* Play Again button at the bottom center */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
        <button
          onClick={() => window.location.href = '/'}
          className="pink-button"
          style={{ fontFamily: 'Barlow_Condensed, Arial, Helvetica, sans-serif' }}
        >
          play-again
        </button>
      </div>
    </div>
  );
} 