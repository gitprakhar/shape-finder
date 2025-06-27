import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  try {
    const { guess, image_base64 } = await req.json();
    if (!guess || typeof guess !== 'string') {
      return NextResponse.json({ error: 'Invalid guess' }, { status: 400 });
    }
    console.log("guess",guess);
    await sql`INSERT INTO guesses (guess) VALUES (${guess})`;
    if (image_base64 && typeof image_base64 === 'string') {
      await sql`INSERT INTO drawings (guess, image_base64) VALUES (${guess}, ${image_base64})`;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 