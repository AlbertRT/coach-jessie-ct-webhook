import { Client } from "@notionhq/client";

class NotionSingleton {
	private static instance: Client;

	private constructor() {} // Mencegah instansiasi langsung

	public static getInstance(): Client {
		if (!NotionSingleton.instance) {
			NotionSingleton.instance = new Client({
				auth: process.env.NOTION_SECRET,
			});
		}
		return NotionSingleton.instance;
	}
}

export const notionClient = NotionSingleton.getInstance();
