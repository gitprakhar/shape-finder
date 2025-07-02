import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  try {
    const { username, image_base64, name_for_image, number_of_moves, todays_date, score: providedScore } = await req.json();
    if (!username || !image_base64 || !name_for_image || number_of_moves === undefined || !todays_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const score = providedScore !== undefined ? providedScore : Math.floor(Math.random() * 100) + 1;
    await sql`
      INSERT INTO entries (username, image_base64, name_for_image, number_of_moves, todays_date, score)
      VALUES (${username}, ${image_base64}, ${name_for_image}, ${number_of_moves}, ${todays_date}, ${score})
    `;
    return NextResponse.json({ success: true, score });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT image_base64 FROM entries WHERE number_of_moves IS NOT NULL ORDER BY number_of_moves ASC LIMIT 4`;
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET_random_pair() {
  try {
    const { rows } = await sql`SELECT id, image_base64 FROM entries ORDER BY RANDOM() LIMIT 2`;
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST_vote(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing entry id' }, { status: 400 });
    }
    await sql`UPDATE entries SET score = score + 1 WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}