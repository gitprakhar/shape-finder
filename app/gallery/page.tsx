/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";

export default function GalleryPage() {
  const [rows, setRows] = useState<{ image_base64: string }[]>([]);

  useEffect(() => {
    fetch("/api/entries")
      .then(res => res.json())
      .then(data => setRows(data.rows || []));
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
      {/* Leaderboard heading */}
      <div style={{
        position: 'absolute',
        top: 48,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
        <span style={{
          fontFamily: 'UglyDave, Helvetica, Arial, sans-serif',
          fontSize: 64,
          color: '#000',
          letterSpacing: 2,
        }}>
          leaderboard
        </span>
      </div>
      {/* Images grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        justifyItems: 'center',
        gap: 64,
        padding: 100,
      }}>
        {rows.slice(-4).map((entry, idx) => (
          entry.image_base64 && (
            <img
              key={idx}
              src={entry.image_base64}
              alt="Drawing"
              style={{ width: 480, height: 480, objectFit: 'contain' }}
            />
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
          onClick={() => window.location.reload()}
          style={{
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 20,
            color: '#000000',
            background: 'transparent',
            border: 'none',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 700,
            padding: '8px 24px',
          }}
        >
          play-again
        </button>
      </div>
    </div>
  );
} 