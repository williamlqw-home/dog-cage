import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();

  await sql`
    INSERT INTO door_events(status)
    VALUES (${body.status})
  `;

  return Response.json({
    success: true,
  });
}

export async function GET() {

  const rows = await sql`
    SELECT status, created_at
    FROM door_events
    ORDER BY id DESC
    LIMIT 1
  `;

  if (rows.length === 0) {
    return Response.json({
      status: "unknown",
    });
  }

  return Response.json(rows[0]);
}
