import { ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Choice } from '../dummy-data.ts'

export const CHOICE_FIELDS = {
	title: 'choiceTitle',
	description: 'choiceDescription',
	link: 'choiceLink',
	minUsers: 'choiceMinUsers',
	maxUsers: 'choiceMaxUsers',
} as const;

type ChoiceFieldId = typeof CHOICE_FIELDS[keyof typeof CHOICE_FIELDS];

function makeTitleComponent(value?: string): LabelBuilder {
	const titleInput = new TextInputBuilder()
		.setCustomId(CHOICE_FIELDS.title)
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('What\'s the option?');

	if (value) {
		titleInput.setValue((value));
	}

	const titleLabel = new LabelBuilder()
		.setLabel('Title')
		.setTextInputComponent(titleInput);

	return titleLabel
}

function makeDescriptionComponent(value?: string): LabelBuilder {

	const descriptionInput = new TextInputBuilder()
		.setCustomId(CHOICE_FIELDS.description)
		.setStyle(TextInputStyle.Paragraph)
		.setPlaceholder('Why should this one get picked?');

	if (value) {
		descriptionInput.setValue(value);
	}

	const descriptionLabel = new LabelBuilder()
		.setLabel('Description')
		.setTextInputComponent(descriptionInput);

	return descriptionLabel;
}

function makeLinkComponent(value?: string): LabelBuilder {
	const linkInput = new TextInputBuilder()
		.setCustomId(CHOICE_FIELDS.link)
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('https://… (optional)')
		.setRequired(false);

	if (value) {
		linkInput.setValue(value);
	}

	const linkLabel = new LabelBuilder()
		.setLabel('Link')
		.setTextInputComponent(linkInput);

	return linkLabel;
}

function numberChoiceComponent(label: string, description: string, id: ChoiceFieldId, value?: string): LabelBuilder {

	if (!label || !description) {
		console.warn("Missing label or description arg");
	}

	const minUserInput = new StringSelectMenuBuilder()
		.setCustomId(id)
		.setPlaceholder('Any')
		.setRequired(false);


	for (let i = 1; i <= 25; i++) {
		minUserInput.addOptions(new StringSelectMenuOptionBuilder()
			.setLabel((i === 1) ? "1 user" : `${i} users`)
			.setValue(`${i}`)
			.setDefault(value ? i.toString() === value : false));

	}

	const minUsersLabel = new LabelBuilder()
		.setLabel(label)
		.setDescription(description)
		.setStringSelectMenuComponent(minUserInput)

	return minUsersLabel;

}
//TODO: Refactor to handle editing choices too.
//	- Should populate each section with relivant data and submission should set the change as the new data 
//TODO: Make this handle populating fileds with channel spcific user configured text
export function render(id: string, title: string, choice?: Choice): ModalBuilder {
	const responseModal = new ModalBuilder().setCustomId(id).setTitle(title);

	responseModal.addLabelComponents(makeTitleComponent(choice?.title));
	responseModal.addLabelComponents(makeDescriptionComponent(choice?.description ?? ""));
	responseModal.addLabelComponents(makeLinkComponent(choice?.link ?? ""));
	responseModal.addLabelComponents(numberChoiceComponent('Min Users', 'Leave blank for no minimum', CHOICE_FIELDS.minUsers, choice?.minUsers?.toString()));
	responseModal.addLabelComponents(numberChoiceComponent('Max Users', 'Leave blank for no maximum', CHOICE_FIELDS.maxUsers, choice?.maxUsers?.toString()));

	return responseModal;
}
