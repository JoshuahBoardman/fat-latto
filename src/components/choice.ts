import { ButtonStyle, SectionBuilder, TextDisplayBuilder } from 'discord.js';

export interface ChoiceContent {
	title: string;
	description: string;
	link: string | null;
	nsfw: boolean;
	createdAt: number;
	minUsers: number | null;
	maxUsers: number | null;
}

function formatSubtext(content: ChoiceContent): string {

	const subtext: string[] = [];

	if (content.nsfw) {
		subtext.push("🔞 NSFW");
	}

	if (content.createdAt) {
		subtext.push(`Added <t:${Math.floor(content.createdAt / 1000)}:d>`);
	}

	return subtext.join(" · ");
}

function formatFooter(content: ChoiceContent): string {
	if (!(content.minUsers && content.maxUsers)) return "";

	return `👥 ${content.minUsers}-${content.maxUsers}`
}

function formatContent(content: ChoiceContent): string {

	const contentSections = {
		header: "",
		subtext: "",
		body: "",
		footer: ""
	}

	contentSections.header = `### ${content.title}`;
	contentSections.subtext = formatSubtext(content);
	contentSections.body = content.description;
	contentSections.footer = formatFooter(content);

	return Object.values(contentSections).map((section) => section).filter(section => section.length).join("\n");
}

// Sections require an accessory, so choices without a link render as plain text
export function render(content: ChoiceContent): SectionBuilder | TextDisplayBuilder {

	if (!content.link) {
		return new TextDisplayBuilder().setContent(formatContent(content));
	}

	return new SectionBuilder().addTextDisplayComponents((textDisplay) => {
		return textDisplay.setContent(formatContent(content))
	}).setButtonAccessory((button) => {
		return button.setStyle(ButtonStyle.Link).setLabel("Peep").setURL(content.link as string)
	})
}
