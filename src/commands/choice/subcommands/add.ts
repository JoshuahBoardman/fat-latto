import { SlashCommandSubcommandBuilder, ModalBuilder, MessageFlags, ChatInputCommandInteraction, LabelBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle, CheckboxBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, type ModalSubmitInteraction } from 'discord.js';

import { createModalHandler } from '../../../types.ts';

import { render as renderModal, CHOICE_FIELDS } from '../../../components/choiceModal.ts';

export const data = new SlashCommandSubcommandBuilder()
	.setName("add")
	.setDescription("Add a new choice to your pool in this channel")


export const ADD_CHOICE_MODAL = "choice:add";

//TODO: Set NSFW by flag
export async function execute(interaction: ChatInputCommandInteraction) {

	const responseModal = renderModal(ADD_CHOICE_MODAL, 'Add Lottery Choice');

	await interaction.showModal(responseModal)
}

export const responseId = ADD_CHOICE_MODAL;

export const responses = {
	[ADD_CHOICE_MODAL]: createModalHandler(async (interaction) => {

		//TODO: Add choice to db	
		const title = interaction.fields.getTextInputValue(CHOICE_FIELDS.title);
		const description = interaction.fields.getTextInputValue(CHOICE_FIELDS.description);
		const link = interaction.fields.getTextInputValue(CHOICE_FIELDS.link)
		const [minRaw] = interaction.fields.getStringSelectValues(CHOICE_FIELDS.minUsers);
		const [maxRaw] = interaction.fields.getStringSelectValues(CHOICE_FIELDS.maxUsers);
		const minUsers = minRaw ? Number(minRaw) : null;
		const maxUsers = maxRaw ? Number(maxRaw) : null;

		if (minUsers !== null && maxUsers !== null && minUsers > maxUsers) {
			await interaction.reply({
				content: "Minimum players can't be more than maximum players.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		console.log({ title, description, link, minUsers, maxUsers });

		await interaction.reply({ content: `Added **${title}** to your choices.`, flags: MessageFlags.Ephemeral });
	})
}

