import { SlashCommandSubcommandBuilder, ModalBuilder, MessageFlags, ChatInputCommandInteraction, LabelBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle, CheckboxBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

import { render as renderModal } from '../../../components/addModal.ts';

export const data = new SlashCommandSubcommandBuilder()
	.setName("add")
	.setDescription("Add a new choice to your pool in this channel")


//TODO: Set NSFW by flag
//TODO: Handle modal submission
export async function execute(interaction: ChatInputCommandInteraction) {

	const responseModal = renderModal();

	await interaction.showModal(responseModal)
}
