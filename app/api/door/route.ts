export const dynamic = "force-dynamic";

let latestDoorStatus = {
  status: "unknown",
  updatedAt: null as string | null,
};

export async function POST(req: Request) {
  const body = await req.json();

  latestDoorStatus = {
    status: body.status,
    updatedAt: new Date().toISOString(),
  };

  return Response.json({
    success: true,
    data: latestDoorStatus,
  });
}

export async function GET() {
  return Response.json(latestDoorStatus, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
