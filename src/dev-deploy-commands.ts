// This is where you update/register the definitions of slash commands
// TODO: Make a seperate command for global deployment

import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';


import { REST, Routes, type RESTPutAPIApplicationGuildCommandsResult } from 'discord.js';

const DISC_TOKEN = process.env.DISCORD_TOKEN ?? "";
const CLIENT_ID = process.env.CLIENT_ID ?? "";
const GUILD_ID = process.env.GUILD_ID ?? "";

// TODO: Convert this into a function that can also be used in the deployment script maybe?
const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = join(import.meta.dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = join(foldersPath, folder);
	const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {

		const filePath = join(commandsPath, file);

		const command = await import(pathToFileURL(filePath).href);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(DISC_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands }) as RESTPutAPIApplicationGuildCommandsResult;

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
