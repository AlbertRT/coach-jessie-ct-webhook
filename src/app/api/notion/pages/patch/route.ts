import getPageId from "@/app/helper/getPageId";
import { notionClient } from "@/app/lib/notion";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { nama, no_hp } = await req.json();

	try {
		const page_id = await getPageId(nama, no_hp);
		const response = await notionClient.pages.update({
			page_id,
			properties: {
				ReRegister: {
					rich_text: [
						{
							type: "text",
							text: {
								content: "true",
							},
						},
					],
				},
			},
		});

		return NextResponse.json({
			success: true,
			msg: "Data updated",
		});
	} catch (error) {
		console.log(error);

		return Response.json({ error: `${error}` }, { status: 500 });
	}
}
