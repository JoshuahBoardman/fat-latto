import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

import { getChoiceList } from "../../../repositories/choice.ts";
import { render } from "../../../components/choiceList.ts";
import { type ChoiceContent } from "../../../components/choice.ts";

export const data = new SlashCommandSubcommandBuilder()
	.setName("list")
	.setDescription("List your choices, or another user's");


//TODO: should likely have a limit on the number of choices or paging
export async function execute(interaction: ChatInputCommandInteraction) {
	//#2c1e3a
	const userChoices = await getChoiceList(interaction.channelId, interaction.user.id);

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

	//TODO: Likely want to defer reply while doing a lookup in the db and then use edit reply to follow up with the info
	await interaction.reply({
		components: [containerComponent],
		flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
	});
}
