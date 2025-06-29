import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  try {
    const { username, image_base64, name_for_image, number_of_moves, todays_date } = await req.json();
    if (!username || !image_base64 || !name_for_image || !number_of_moves || !todays_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const score = Math.floor(Math.random() * 100) + 1;
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