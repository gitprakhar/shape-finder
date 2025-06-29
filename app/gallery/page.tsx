import { sql } from '@vercel/postgres';
import React from 'react';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isOverlapping(a: {top: number, left: number}, b: {top: number, left: number}, size: number) {
  return (
    Math.abs(a.left - b.left) < size &&
    Math.abs(a.top - b.top) < size
  );
}

export default async function GalleryPage() {
  const { rows } = await sql`SELECT image_base64 FROM entries`;
  const containerWidth = 2200;
  const containerHeight = 1600;
  const imageSize = 480;
  const placed: {top: number, left: number}[] = [];
  const maxAttempts = 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#E599FE',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      justifyItems: 'center',
      alignItems: 'flex-start',
      padding: 32,
      gap: 32,
    }}>
      {rows.map((entry, idx) => (
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
  );
} 