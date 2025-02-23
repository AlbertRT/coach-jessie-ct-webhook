import { notionClient } from "../lib/notion";

export default async function getPageId(nama: string, hp: string) {
	const res = await notionClient.databases.query({
		database_id: process.env.NOTION_DATABASE_ID as string,
		filter: {
			and: [
				{
					property: "Nama",
					title: {
						equals: nama,
					},
				},
				{
					property: "No HP",
					phone_number: {
						equals: hp,
					},
				},
			],
		},
	});

	return res.results[0].id;
}
