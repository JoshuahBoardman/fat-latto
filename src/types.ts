import type { ChatInputCommandInteraction, Collection, SlashCommandBuilder, Client, ClientEvents } from "discord.js";

import type { Choice } from "./dummy-data";

export interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

declare module 'discord.js' {

	interface Client {
		commands: Collection<string, Command>
	}

}

export interface EventHandler<K extends keyof ClientEvents> {
	name: K,
	once: boolean,
	execute: (...args: ClientEvents[K]) => void
}

export type ClientChoice1 = Pick<Choice, 'title' | 'description' | 'link' | 'minUsers' | 'maxUsers' | 'nsfw'>;

export interface ClientChoice {
	title: string;
	description: string;
	link?: string | null;
	imagePath?: string | null;
	minUsers?: number | null;
	maxUsers?: number | null;
	nsfw: boolean;
}
