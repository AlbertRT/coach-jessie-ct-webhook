import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	return Response.json({ status: 200, body });
}
