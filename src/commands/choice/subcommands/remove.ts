import { SlashCommandSubcommandBuilder } from 'discord.js';

export const data = new SlashCommandSubcommandBuilder()
	.setName("remove")
	.setDescription("Remove one of your choices");

export async function execute() {

}
