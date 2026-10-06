import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { SlashCommandBuilder, type ChatInputCommandInteraction, MessageFlags, Collection } from "discord.js";

import type { Subcommand } from '../../types.ts';


const subcommands: Collection<string, Subcommand> = new Collection();


//TODO: Allow admins to pass a user prop to all of these to specify a specific user
export const data = new SlashCommandBuilder().setName('choice').setDescription("Manage your choices for this channel's lotteries");

const subcommandPath = join(import.meta.dirname, "subcommands");
const subCommandFiles = readdirSync(subcommandPath).filter((f) => f.endsWith(".ts"));

for (const file of subCommandFiles) {

	const filePath = join(subcommandPath, file);

	const subcommand = await import(pathToFileURL(filePath).href);

	data.addSubcommand(subcommand.data);

	subcommands.set(subcommand.data.name, {
		data: subcommand.data,
		execute: subcommand.execute
	});
}


export async function execute(interaction: ChatInputCommandInteraction) {

	const subcommandName = interaction.options.getSubcommand();
	const subcommand = subcommands.get(subcommandName);

	if (!subcommand) {
		await interaction.reply({ content: 'Subcommand not found.', flags: MessageFlags.Ephemeral });
		return;
	}

	const filePath = join(import.meta.dirname, subcommandName);

	if (!("data" in subcommand && "execute" in subcommand)) {
		console.warn(`[WARNING] Subcommand at ${filePath} is missing "data" or "execute".`);
		await interaction.reply({ content: 'Subcommand is malformed.', flags: MessageFlags.Ephemeral });
		return;
	}

	await subcommand.execute(interaction);
}

/*
 export async function execute(interaction: ChatInputCommandInteraction) {
	//#2c1e3a
	const userChoices = await getChoiceList(interaction.channelId, interaction.user.id);

	//TODO: Remve log
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
}*/
