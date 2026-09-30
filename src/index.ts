
import { Client, GatewayIntentBits } from "discord.js";

import registerEvents from './registerEvents.ts';
import loadCommands from './loadCommands.ts';

const DISC_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = await loadCommands()
await registerEvents(client);

client.login(DISC_TOKEN);
