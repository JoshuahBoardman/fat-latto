import { SlashCommandBuilder, type ChatInputCommandInteraction, MessageFlags, ContainerBuilder } from "discord.js";

import { getChoiceList } from "../../repositories/choice.ts";

export const data = new SlashCommandBuilder().setName('choice-list').setDescription('Get all submitted user choices.');

//TODO: Should be a hard limit to the number of choices that a user can have registered at any given time
//	- This will prevent more complecated pagination set up for now. 
export async function execute(interaction: ChatInputCommandInteraction) {
	//#2c1e3a
	const userChoices = await getChoiceList(interaction.channelId, interaction.user.id);

	console.log(interaction.channelId, interaction.user.id);

	if (!userChoices.length) {
		await interaction.reply({ content: 'No choices found.', flags: MessageFlags.Ephemeral });
		return;
	}

	const containerComponent = new ContainerBuilder()
		.setAccentColor(0x2C1E3A)
		.addTextDisplayComponents((textDisplay) => {
			//TODO: Add intent to the top header like "users choices in #intent"
			return textDisplay.setContent(`## ${interaction.user.displayName} choices\n-# ${userChoices.length} choices`); //TODO: add pages out of pages once pagination is added
		});

	for (const choice of userChoices) {
		//TODO: Swap to section and support images

		//TODO: Create componet builder file 

		containerComponent.addSeparatorComponents((separator) => separator);
		//TODO: Build content differtently

		if (choice.link) {
			containerComponent.addSectionComponents((section) => {
				return section.addTextDisplayComponents((textDisplay) => {
					return textDisplay.setContent(`
						\n\n### ${choice.title}\n-# ${choice.nsfw ? "🔞 NSFW ·" : ""} Added <t:${Math.floor(choice.createdAt / 1000)}:d>\n${choice.description}\n${(choice.minUsers && choice.maxUsers) ? `👥${choice.minUsers}-${choice.maxUsers}` : ""}
						`)
				})
					.setButtonAccessory((button) => {
						return button.setLabel("Peep").setURL(choice.link as string)
					})
			})
		}

		containerComponent.addTextDisplayComponents((textDisplay) => {
			return textDisplay.setContent(`
				\n\n### ${choice.title}\n-# ${choice.nsfw ? "🔞 NSFW ·" : ""} Added <t:${Math.floor(choice.createdAt / 1000)}:d>\n${choice.description}\n${(choice.minUsers && choice.maxUsers) ? `👥 ${choice.minUsers}-${choice.maxUsers}` : ""}
			`);
		})
	}

	await interaction.reply({
		components: [containerComponent],
		flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
	});
}
