import { ContainerBuilder, SectionBuilder } from "discord.js";
import { render as renderChoice, type ChoiceContent } from "./choice.ts";

//TODO: Add paging 
export interface ChoiceListContent {
	userName: string | null
	channelName: string | null
	choices: ChoiceContent[]
}

function formatContent(content: ChoiceListContent): string {

	const contentSections = {
		header: "",
		subtext: "",
	}

	contentSections.header = `## ${content.channelName ?? content.userName}'s choices`;

	contentSections.subtext = `-# ${content.choices.length} choices`

	return Object.values(contentSections).map(section => section).join("\n");
}

export function render(content: ChoiceListContent): ContainerBuilder {
	const containerComponent = new ContainerBuilder()
		.setAccentColor(0x2C1E3A)
		.addTextDisplayComponents((textDisplay) => textDisplay.setContent(formatContent(content)));

	for (const choice of content.choices) {
		//TODO: Add image support

		containerComponent.addSeparatorComponents((separator) => separator);

		const choiceComponent = renderChoice(choice);

		if (choiceComponent instanceof SectionBuilder) {
			containerComponent.addSectionComponents(choiceComponent);
		} else {
			containerComponent.addTextDisplayComponents(choiceComponent);
		}

	}

	return containerComponent;
}

