let latestDoorStatus = {
  status: "unknown",
};

export async function POST(req: Request) {
  const body = await req.json();

  latestDoorStatus.status = body.status;

  return Response.json({
    success: true,
  });
}

export async function GET() {
  return Response.json(latestDoorStatus);
}