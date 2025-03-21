import getPageId from "@/app/helper/getPageId";
import { notionClient } from "@/app/lib/notion";
import { NextRequest } from "next/server";
import { NotionPageProperties } from "@/types/types";

export async function POST(req: NextRequest) {
	const { nama, no_hp, status_cg, cg, alamat, universitas, tgl_lahir, rereg } =
		await req.json();
	const database_id = process.env.NOTION_DATABASE_ID as string;
	const page_id = await getPageId(nama, no_hp);

	// **1. Validasi CG dan Universitas tidak boleh terisi bersamaan**
	if (cg && universitas) {
		return Response.json(
			{ error: "CG dan Universitas tidak boleh diisi bersamaan." },
			{ status: 400 }
		);
	}

	// **2. Jika page_id ditemukan, hapus data lama dari Notion**
	let univOption;

	// **3. Jika universitas ada, cari opsi di database Notion**
	if (universitas) {
		const database = await notionClient.databases.retrieve({
			database_id,
		});

		if ("select" in database.properties.Universitas) {
			const univOptions = database.properties.Universitas.select.options;
			univOption = univOptions.find((opt) => opt.name === universitas);
		}
	}

	// **4. Menyiapkan properti halaman yang akan dikirim ke Notion**
	const properties: NotionPageProperties = {
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
			status: {
				name: status_cg,
			},
		},
		Alamat: {
			rich_text: [
				{
					text: {
						content: alamat || "",
					},
				},
			],
		},
		"Tanggal Lahir": {
			date: tgl_lahir
				? {
					start: tgl_lahir,
				}
				: null, // Jika kosong, kirim null agar Notion tidak error
		},
		Register: {
			checkbox: true,
		},
	};

	// **5. Hanya tambahkan CG jika ada**
	if (cg) {
		properties["CG"] = { select: { name: cg } };
	}

	// **6. Hanya tambahkan Universitas jika ada opsi yang valid**
	if (univOption) {
		properties["Universitas"] = { select: { id: univOption.id } };
	}

	if (rereg === "true") {
		properties["ReRegister"] = { checkbox: true }
	}

    if (page_id) {
		await notionClient.pages.update({
			page_id,
			in_trash: true,
		});

        await notionClient.pages.create({
			parent: {
				database_id,
			},
			properties,
		});

		return Response.json({ status: 200 });
	}


	// **7. Buat halaman baru di Notion**
	await notionClient.pages.create({
		parent: {
			database_id,
		},
		properties,
	});

	return Response.json({ status: 201 });
}
