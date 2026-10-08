import type {
	ChatInputCommandInteraction, Collection, SlashCommandBuilder, Client, ClientEvents,
	SlashCommandSubcommandBuilder, ButtonInteraction, ModalSubmitInteraction, StringSelectMenuInteraction
} from "discord.js";


import type { Choice } from "./dummy-data";

export interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	handleResponse?: (interaction: ResponseInteraction) => Promise<void>;
}

export interface Subcommand {
	data: SlashCommandSubcommandBuilder;
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

export type ResponseHandler =
	| { kind: "modal"; handle: (i: ModalSubmitInteraction) => Promise<void> }
	| { kind: "button"; handle: (i: ButtonInteraction) => Promise<void> }
	| { kind: "select"; handle: (i: StringSelectMenuInteraction) => Promise<void> };

export type ResponseInteraction =
	| ModalSubmitInteraction | ButtonInteraction | StringSelectMenuInteraction;

export const createModalHandler = (handle: (i: ModalSubmitInteraction) => Promise<void>): ResponseHandler => ({ kind: "modal", handle });
export const createButtonHandler = (handle: (i: ButtonInteraction) => Promise<void>): ResponseHandler => ({ kind: "button", handle });
export const createSelectHandler = (handle: (i: StringSelectMenuInteraction) => Promise<void>): ResponseHandler => ({ kind: "select", handle });
