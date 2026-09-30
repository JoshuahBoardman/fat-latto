import type { ChatInputCommandInteraction, Collection, SlashCommandBuilder, Client, ClientEvents } from "discord.js";

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

