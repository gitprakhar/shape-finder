import { sql } from '@vercel/postgres';
import React from 'react';

export default async function GalleryPage() {
  const { rows } = await sql`SELECT username, image_base64, name_for_image, number_of_moves, todays_date FROM entries`;

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {rows.map((entry, idx) => (
          <div key={idx} className="flex flex-col items-center border rounded p-4 bg-white shadow">
            {entry.image_base64 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.image_base64}
                alt={entry.name_for_image || 'Drawing'}
                style={{ width: 300, height: 150, objectFit: 'contain', background: '#f9f9f9', border: '1px solid #eee' }}
              />
            )}
            <div className="mt-2 text-center text-gray-700 font-semibold">{entry.username}</div>
            <div className="mt-1 text-center text-gray-700">{entry.name_for_image}</div>
            <div className="mt-1 text-center text-gray-500 text-xs">Moves: {entry.number_of_moves} | Date: {typeof entry.todays_date === 'string' ? entry.todays_date : (entry.todays_date instanceof Date ? entry.todays_date.toISOString().split('T')[0] : String(entry.todays_date))}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 