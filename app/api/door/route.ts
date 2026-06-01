import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();

  await sql`
    CREATE TABLE IF NOT EXISTS cage_events (
      id SERIAL PRIMARY KEY,
      cage1 TEXT NOT NULL,
      cage2 TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO cage_events (cage1, cage2)
    VALUES (${body.cage1}, ${body.cage2})
  `;

  return Response.json({ success: true });
}

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cage_events (
        id SERIAL PRIMARY KEY,
        cage1 TEXT NOT NULL,
        cage2 TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const rows = await sql`
      SELECT cage1, cage2, created_at
      FROM cage_events
      ORDER BY id DESC
      LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json({ cage1: "unknown", cage2: "unknown" });
    }

    return Response.json(rows[0]);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
