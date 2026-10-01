// Dummy data for fat-latto, shaped like the SQLite schema.
// Booleans are real booleans and JSON columns are objects here;
// the real data layer will convert t gehem to/from 0/1 and JSON text.

// ---------- Types ----------

export interface Guild {
	id: string;
	joinedAt: number;
}

export interface LotteryOptions {
	minPlayers?: number;
	filterUnfit?: boolean;
	allowNsfw?: boolean;
	weighted?: boolean;
}

export interface Channel {
	id: string;
	guildId: string;
	purpose: string | null;
	allowPublicSharing: boolean;
	lotteryDefaults: LotteryOptions | null;
}

export type ChoiceStatus = "active" | "won" | "removed";



export interface Choice {
	id: number;
	channelId: string;
	userId: string;
	title: string;
	description: string | null;
	link: string | null;
	imagePath: string | null;
	minUsers: number | null;
	maxUsers: number | null;
	nsfw: boolean;
	status: ChoiceStatus;
	createdAt: number;
	updatedAt: number;
}

export interface Participant {
	channelId: string;
	userId: string;
	losses: number;
	paused: boolean;
}

export interface Ban {
	guildId: string;
	userId: string;
	reason: string | null;
	bannedBy: string;
	createdAt: number;
}

export type LotteryKind = "instant" | "post";
export type LotteryStatus = "open" | "drawn" | "cancelled";

export interface Lottery {
	id: number;
	channelId: string;
	createdBy: string;
	kind: LotteryKind;
	weighted: boolean;
	options: LotteryOptions | null;
	status: LotteryStatus;
	messageId: string | null;
	endsAt: number | null;
	createdAt: number;
}

export interface LotteryEntrant {
	lotteryId: number;
	userId: string;
	lossesBefore: number;
	weight: number;
}

export interface Draw {
	id: number;
	lotteryId: number;
	winnerUserId: string;
	choiceId: number | null;
	choiceTitle: string;
	superseded: boolean;
	drawnAt: number;
}

export interface SchemaMigration {
	version: number;
	appliedAt: number;
}

// ---------- IDs ----------

const GUILD_FRIENDS = "1180000000000000001";
const GUILD_MOVIE_CLUB = "1180000000000000002";
const GUILD_STUDY = "1180000000000000003";

const CH_ANIME = "1554884107849175092";
const CH_GAME_NIGHT = "1182000000000000002";
const CH_MOVIES = "1182000000000000003";

const USER_ALEX = "201034213816795145";
const USER_SAM = "2001000000000000002";
const USER_RIO = "2001000000000000003";
const USER_ADMIN = "2001000000000000009";

const day = (d: number) => Date.UTC(2026, 8, d); // September 2026

// ---------- Rows ----------

export const guilds: Guild[] = [
	{ id: GUILD_FRIENDS, joinedAt: day(1) },
	{ id: GUILD_MOVIE_CLUB, joinedAt: day(5) },
	{ id: GUILD_STUDY, joinedAt: day(12) },
];

export const channels: Channel[] = [
	{
		id: CH_ANIME,
		guildId: GUILD_FRIENDS,
		purpose: "Pick our next anime",
		allowPublicSharing: true,
		lotteryDefaults: { weighted: true, allowNsfw: false },
	},
	{
		id: CH_GAME_NIGHT,
		guildId: GUILD_FRIENDS,
		purpose: "Friday game night",
		allowPublicSharing: false,
		lotteryDefaults: { weighted: true, minPlayers: 3, filterUnfit: true },
	},
	{
		id: CH_MOVIES,
		guildId: GUILD_MOVIE_CLUB,
		purpose: null,
		allowPublicSharing: false,
		lotteryDefaults: null,
	},
];

export const choices: Choice[] = [
	{
		id: 1,
		channelId: CH_ANIME,
		userId: USER_ALEX,
		title: "Frieren: Beyond Journey's End",
		description: "Slow, beautiful fantasy about an elf mage outliving her party.",
		link: null,
		imagePath: null,
		minUsers: null,
		maxUsers: null,
		nsfw: false,
		status: "won",
		createdAt: day(2),
		updatedAt: day(15),
	},
	{
		id: 2,
		channelId: CH_ANIME,
		userId: USER_ALEX,
		title: "Devilman Crybaby",
		description: "Short, intense, and very much not for kids.",
		link: null,
		imagePath: null,
		minUsers: null,
		maxUsers: null,
		nsfw: true,
		status: "active",
		createdAt: day(3),
		updatedAt: day(3),
	},
	{
		id: 3,
		channelId: CH_GAME_NIGHT,
		userId: USER_SAM,
		title: "Lethal Company",
		description: "Co-op horror scavenging. Chaos with proximity chat.",
		link: null,
		imagePath: null,
		minUsers: 1,
		maxUsers: 4,
		nsfw: false,
		status: "active",
		createdAt: day(4),
		updatedAt: day(10),
	},
];

export const participants: Participant[] = [
	{ channelId: CH_ANIME, userId: USER_ALEX, losses: 0, paused: false },
	{ channelId: CH_ANIME, userId: USER_RIO, losses: 1, paused: false },
	{ channelId: CH_GAME_NIGHT, userId: USER_SAM, losses: 2, paused: true },
];

export const bans: Ban[] = [
	{
		guildId: GUILD_FRIENDS,
		userId: "2001000000000000004",
		reason: "Spamming joke entries",
		bannedBy: USER_ADMIN,
		createdAt: day(8),
	},
	{
		guildId: GUILD_MOVIE_CLUB,
		userId: "2001000000000000005",
		reason: null,
		bannedBy: USER_ADMIN,
		createdAt: day(9),
	},
	{
		guildId: GUILD_FRIENDS,
		userId: "2001000000000000006",
		reason: "Asked to be excluded",
		bannedBy: USER_ADMIN,
		createdAt: day(14),
	},
];

export const lotteries: Lottery[] = [
	{
		id: 1,
		channelId: CH_ANIME,
		createdBy: USER_ALEX,
		kind: "instant",
		weighted: true,
		options: { allowNsfw: true },
		status: "drawn",
		messageId: "3001000000000000001",
		endsAt: null,
		createdAt: day(15),
	},
	{
		id: 2,
		channelId: CH_GAME_NIGHT,
		createdBy: USER_SAM,
		kind: "post",
		weighted: true,
		options: { minPlayers: 3, filterUnfit: true },
		status: "open",
		messageId: "3001000000000000002",
		endsAt: day(30),
		createdAt: day(28),
	},
	{
		id: 3,
		channelId: CH_MOVIES,
		createdBy: USER_ADMIN,
		kind: "instant",
		weighted: false,
		options: null,
		status: "drawn",
		messageId: "3001000000000000003",
		endsAt: null,
		createdAt: day(20),
	},
];

// Weight = 1 + lossesBefore for weighted lotteries, 1 for unweighted.
export const lotteryEntrants: LotteryEntrant[] = [
	{ lotteryId: 1, userId: USER_ALEX, lossesBefore: 1, weight: 2 },
	{ lotteryId: 1, userId: USER_RIO, lossesBefore: 0, weight: 1 },
	{ lotteryId: 3, userId: USER_SAM, lossesBefore: 0, weight: 1 },
];

export const draws: Draw[] = [
	// Lottery 1's first draw was rerolled...
	{
		id: 1,
		lotteryId: 1,
		winnerUserId: USER_RIO,
		choiceId: 2,
		choiceTitle: "Devilman Crybaby",
		superseded: true,
		drawnAt: day(15),
	},
	// ...and this reroll is the result that counts.
	{
		id: 2,
		lotteryId: 1,
		winnerUserId: USER_ALEX,
		choiceId: 1,
		choiceTitle: "Frieren: Beyond Journey's End",
		superseded: false,
		drawnAt: day(15),
	},
	// The winning choice was later deleted, so only the copied title remains.
	{
		id: 3,
		lotteryId: 3,
		winnerUserId: USER_SAM,
		choiceId: null,
		choiceTitle: "The Thing",
		superseded: false,
		drawnAt: day(20),
	},
];

export const schemaMigrations: SchemaMigration[] = [
	{ version: 1, appliedAt: day(1) },
	{ version: 2, appliedAt: day(10) },
	{ version: 3, appliedAt: day(25) },
];
