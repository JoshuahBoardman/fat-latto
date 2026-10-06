import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

import { getChoiceList } from "../../../repositories/choice.ts";
import { render } from "../../../components/choiceList.ts";
import { type ChoiceContent } from "../../../components/choice.ts";

export const data = new SlashCommandSubcommandBuilder()
	.setName("list")
	.setDescription("List your choices, or another user's");


export async function execute(interaction: ChatInputCommandInteraction) {
	//#2c1e3a
	const userChoices = await getChoiceList(interaction.channelId, interaction.user.id);

	//TODO: Remove log
	console.log(interaction.channelId, interaction.user.id);

	//MAYBE: we should have some type of default handleing accross all commands if things dont run correctly.
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
