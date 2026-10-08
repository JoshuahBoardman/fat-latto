import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { SlashCommandBuilder, type ChatInputCommandInteraction, MessageFlags, Collection, type ModalSubmitInteraction, type Interaction } from "discord.js";

import type { Subcommand, ResponseHandler, ResponseInteraction } from '../../types.ts';
import { createModalHandler } from '../../types.ts'

const subcommands: Collection<string, Subcommand> = new Collection();
const responseHandlers: Collection<string, ResponseHandler> = new Collection();

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

	for (const [id, handler] of Object.entries(subcommand.responses ?? {})) {
		responseHandlers.set(id, handler as ResponseHandler);
	}
}

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {

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


export async function handleResponse(interaction: ResponseInteraction): Promise<void> {

	const handler = responseHandlers.get(interaction.customId);

	if (handler?.kind === "modal" && interaction.isModalSubmit()) return handler.handle(interaction);
	if (handler?.kind === "button" && interaction.isButton()) return handler.handle(interaction);
	if (handler?.kind === "select" && interaction.isStringSelectMenu()) return handler.handle(interaction);

	await interaction.reply({ content: "This action is no longer available.", flags: MessageFlags.Ephemeral });
}
