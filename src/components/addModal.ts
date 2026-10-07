import { ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export const ADD_CHOICE_MODAL = 'addChoiceModal';
export const CHOICE_FIELDS = {
	title: 'choiceTitle',
	description: 'choiceDescription',
	link: 'choiceLink',
	minUsers: 'choiceMinUsers',
	maxUsers: 'choiceMaxUsers',
} as const;

type ChoiceFieldId = typeof CHOICE_FIELDS[keyof typeof CHOICE_FIELDS];

function makeTitleComponent(): LabelBuilder {
	const titleInput = new TextInputBuilder()
		.setCustomId(CHOICE_FIELDS.title)
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('What\'s the option?');

	const titleLabel = new LabelBuilder()
		.setLabel('Title')
		.setTextInputComponent(titleInput);

	return titleLabel
}

function makeDescriptionComponent(): LabelBuilder {

	const descriptionInput = new TextInputBuilder()
		.setCustomId(CHOICE_FIELDS.description)
		.setStyle(TextInputStyle.Paragraph)
		.setPlaceholder('Why should this one get picked?');

	const descriptionLabel = new LabelBuilder()
		.setLabel('Description')
		.setTextInputComponent(descriptionInput);

	return descriptionLabel;
}

function makeLinkComponent(): LabelBuilder {
	const linkInput = new TextInputBuilder()
		.setCustomId(CHOICE_FIELDS.link)
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('https://… (optional)')
		.setRequired(false);

	const linkLabel = new LabelBuilder()
		.setLabel('Link')
		.setTextInputComponent(linkInput);

	return linkLabel;
}

function numberChoiceComponent(label: string, description: string, id: ChoiceFieldId): LabelBuilder {

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
			.setValue(`${i}`));
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
export function render(): ModalBuilder {
	const responseModal = new ModalBuilder().setCustomId(ADD_CHOICE_MODAL).setTitle('Add Lottery Choice');

	responseModal.addLabelComponents(makeTitleComponent());
	responseModal.addLabelComponents(makeDescriptionComponent());
	responseModal.addLabelComponents(makeLinkComponent());
	responseModal.addLabelComponents(numberChoiceComponent('Min Users', 'Leave blank for no minimum', CHOICE_FIELDS.minUsers));
	responseModal.addLabelComponents(numberChoiceComponent('Max Users', 'Leave blank for no maximum', CHOICE_FIELDS.maxUsers));

	return responseModal;
}
