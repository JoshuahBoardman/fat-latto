import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";

const DISC_TOKEN = process.env.DISCORD_TOKEN;

console.log(`DISC TOKEN: ${DISC_TOKEN}`);


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

});

client.login(DISC_TOKEN);

client.commands = new Collection();

/*TODO: Desired Command List:
	- User Commands:
		- Register the calling users choice to their choice pool 
		- Update one of calling users registered choices
		- Delete one of the calling users registered choices
		- List the calling users registered choices
		- List a specified users choices	
		- Server Commands:
		- List all guild user choices
		- List all guild users with registered choices
	- Lottery Commands:
		- Start a lottery for all users in the guild.
			- Otional Arguments:
				- Minimum numbers of participants and all choices must uphold that number of users.
				- Filter out users who do not have choices that can uphold the number of participants.
				- Filter out choices that are nsfw
				- Specify lottery type (should it be weighted or not.)
		- Start a lottery for all users in a specific channel.
		- Start a lottery for only specified users
		- Create a post for a lottery, where reactions and comments act as opt ins to a lottery. 
	- Admin Commands:
		- Delete a specified users choice
		- Update a specified users choice
		- Add a choice to a specified users choice pool
		- Ban a user from taking part in future lotteries
	- Config Commands:
		- Specifiy the purpose of this bot in this channel
		- Specify default optional params for specific comands
	- Utility Commands:

*/

//TODO: Should break gathering the commands out into a function:
//	- This would allow reuse for deployment scripts
const foldersPath = path.join(import.meta.dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import(pathToFileURL(filePath).href);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`Name: ${command.data.name}`);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//TODO: Break out listeners to their own files and then register them all here 
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});
