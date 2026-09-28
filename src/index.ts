import { Client, Events, GatewayIntentBits } from "discord.js";

const DISC_TOKEN = process.env.DISCORD_TOKEN;

console.log(`DISC TOKEN: ${DISC_TOKEN}`);


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(DISC_TOKEN);



