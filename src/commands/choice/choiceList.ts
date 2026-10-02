import { SlashCommandBuilder, type ChatInputCommandInteraction, MessageFlags } from "discord.js";

import { getChoiceList } from "../../repositories/choice.ts";
import { render } from "../../components/choiceList.ts";
import { type ChoiceContent } from "../../components/choice.ts";

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

	const choiceContnet: ChoiceContent[] = [];

	for (const choice of userChoices) {
		choiceContnet.push({
			title: choice.title,
			description: choice.description ?? "",
			link: choice.link,
			nsfw: choice.nsfw,
			createdAt: choice.createdAt,
			minUsers: choice.minUsers,
			maxUsers: choice.maxUsers
		});
	}

	const containerComponent = render({ userName: interaction.user.displayName, channelName: null, choices: choiceContnet });

	await interaction.reply({
		components: [containerComponent],
		flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
	});
}
