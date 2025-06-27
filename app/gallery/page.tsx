import { sql } from '@vercel/postgres';
import Image from 'next/image';
import React from 'react';

export default async function GalleryPage() {
  const { rows } = await sql`SELECT guess, image_base64 FROM drawings`;

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {rows.map((drawing, idx) => (
          <div key={idx} className="flex flex-col items-center border rounded p-4 bg-white shadow">
            {drawing.image_base64 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={drawing.image_base64}
                alt={drawing.guess || 'Drawing'}
                style={{ width: 300, height: 150, objectFit: 'contain', background: '#f9f9f9', border: '1px solid #eee' }}
              />
            )}
            <div className="mt-2 text-center text-gray-700">{drawing.guess}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 