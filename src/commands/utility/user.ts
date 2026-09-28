import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";


export const data = new SlashCommandBuilder().setName('user').setDescription('Provides information about the user.');

export async function execute(interaction: ChatInputCommandInteraction) {
	// interaction.user is the object representing the User who ran the command
	// interaction.member is the GuildMember object, which represents the user in the specific guild

	if (!interaction.inCachedGuild()) return;

	await interaction.reply(
		`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
	);
}
