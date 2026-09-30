import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { type Client } from 'discord.js';

export default async function registerEvents(client: Client) {
	const eventsPath = join(import.meta.dirname, 'events');
	const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

	for (const file of eventFiles) {

		const filePath = join(eventsPath, file);
		const { default: event } = await import(pathToFileURL(filePath).href);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {

			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}
