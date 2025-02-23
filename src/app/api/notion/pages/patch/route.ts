import getPageId from "@/app/helper/getPageId";
import { notionClient } from "@/app/lib/notion";
import { NextRequest } from "next/server";

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

		return Response.json({ status: 200 });
	} catch (error) {
		return Response.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
