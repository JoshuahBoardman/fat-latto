import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

import { render as renderModal } from '../../../components/choiceModal';

export const EDIT_CHOICE_MODAL = "choice:add";

export const data = new SlashCommandSubcommandBuilder()
	.setName("edit")
	.setDescription("Edit one of your choices");


//TODO: Setup autocomplete for user passing choice name
export async function execute(interaction: ChatInputCommandInteraction) {
	//interaction.options.getString()

	const responseModal = renderModal(EDIT_CHOICE_MODAL, 'Add Lottery Choice',);

	await interaction.showModal(responseModal)

}

