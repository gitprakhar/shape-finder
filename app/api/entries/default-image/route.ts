import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`SELECT image_base64 FROM entries WHERE username = 'pm17' AND name_for_image = 'default' LIMIT 1`;
    if (rows.length > 0) {
      return NextResponse.json({ image_base64: rows[0].image_base64 });
    } else {
      return NextResponse.json({ image_base64: null });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 