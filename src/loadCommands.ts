import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { Collection } from 'discord.js';

import type { Command } from "./types.ts";

export default async function loadCommands(): Promise<Collection<string, Command>> {
	const commands: Collection<string, Command> = new Collection();

	const foldersPath = join(import.meta.dirname, 'commands');
	const commandFolders = readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = join(foldersPath, folder);
		const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
		for (const file of commandFiles) {
			const filePath = join(commandsPath, file);
			const command = await import(pathToFileURL(filePath).href);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	return commands;
}


//MAYBE: Add a function for loading subcommands into a parnet command 
