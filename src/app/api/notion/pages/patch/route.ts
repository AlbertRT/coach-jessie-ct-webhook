import getPageId from "@/app/helper/getPageId";
import { notionClient } from "@/app/lib/notion";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { nama, no_hp } = await req.json();

	const page_id = await getPageId(nama, no_hp);
	const database_id: string = process.env.NOTION_DATABASE_ID as string;

	if (!page_id) {
		await notionClient.pages.create({
			parent: {
				database_id,
			},
			properties: {
				Nama: {
					title: [
						{
							text: {
								content: nama,
							},
						},
					],
				},
				"No HP": {
					phone_number: no_hp,
				},
				Register: {
					checkbox: false,
				},
				ReRegister: {
					checkbox: true,
				},
			},
		});

		return NextResponse.json({
			status: 201,
			msg: "Created",
		});
	}

	

	await notionClient.pages.update({
		page_id,
		properties: {
			ReRegister: {
				checkbox: true,
			},
		},
	});

	return NextResponse.json({
		success: true,
		msg: "Data updated",
	});
}
