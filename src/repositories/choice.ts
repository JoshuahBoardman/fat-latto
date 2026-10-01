//TODO: Upate this to use actual DB connection

import { type Snowflake, type User } from 'discord.js';

import type { ClientChoice } from '../types.ts';

import { choices, channels, type Choice } from "../dummy-data.ts";

export function addChoice(user: User, channelId: Snowflake, choice: ClientChoice) {

}

export function getChoice() {

}

//TODO: This should take a param for specific user, and if not provided, it gets everything within the channel.
export async function getChoiceList(channelId: Snowflake, userId?: Snowflake): Promise<Choice[]> {

	return await choices.filter(choice => (choice.channelId === channelId && (!userId || choice.userId === userId)));

}

export function updateChoice() {

}

export function removeChoice() {

}
