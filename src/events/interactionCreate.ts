import { Events, MessageFlags, type Interaction } from 'discord.js';

export default {
	name: Events.InteractionCreate,
	once: false,
	execute: async (interaction: Interaction) => {

		if (interaction.isModalSubmit() || interaction.isButton() || interaction.isStringSelectMenu()) {
			const [commandName] = interaction.customId.split(":");
			await interaction.client.commands.get(commandName)?.handleResponse?.(interaction);
		}

		//TODO: Add checking for modal submit 
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
	}
}

