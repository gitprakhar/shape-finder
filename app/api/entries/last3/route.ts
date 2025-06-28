import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`SELECT username, image_base64, score FROM entries ORDER BY id DESC LIMIT 3`;
    const entries = rows.map(row => ({
      username: row.username,
      image_base64: row.image_base64,
      score: row.score,
    }));
    return NextResponse.json({ entries });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 