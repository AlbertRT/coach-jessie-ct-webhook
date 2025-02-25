import getPageId from "@/app/helper/getPageId";
import { notionClient } from "@/app/lib/notion";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const {
		nama,
		no_hp,
		status_cg,
		cg,
		alamat,
		universitas,
		tgl_lahir,
		rereg,
	} = await req.json();
	const database_id = process.env.NOTION_DATABASE_ID as string;

	const page_id = await getPageId(nama, no_hp);

	if (page_id) {
		await notionClient.pages.update({
			page_id,
			in_trash: true,
		});

		return Response.json({ status: 200 });
	}

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
			"Status CG": {
				select: {
					name: status_cg,
				},
			},
			CG: {
				select: {
					name: cg,
				},
			},
			Alamat: {
				rich_text: [
					{
						text: {
							content: alamat,
						},
					},
				],
			},
			Universitas: {
				select: {
					name: universitas,
				},
			},
			"Tanggal Lahir": {
				date: {
					start: tgl_lahir,
				},
			},
			Register: {
				checkbox: true,
			},
		},
	});

	return Response.json({ status: 201 });
}
