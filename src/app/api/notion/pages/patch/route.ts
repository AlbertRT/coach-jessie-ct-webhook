import getPageId from "@/app/helper/getPageId";
import { notionClient } from "@/app/lib/notion";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { nama, no_hp } = await req.json();

	try {
		const page_id = await getPageId(nama, no_hp);

		if (!page_id) {
			return NextResponse.redirect(
				"https://coachjessiectreregist.fillout.com/t/kUwggQES63us?reregis=true"
			);
		}

		await notionClient.pages.update({
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

		NextResponse.redirect("/");

		return NextResponse.json({
			success: true,
			msg: "Data updated",
		});
	} catch (error) {
		return Response.json({ error: `${error}` }, { status: 500 });
	}
}
