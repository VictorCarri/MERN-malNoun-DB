import type { Gender } from "./Gender.ts";

export interface Noun {
	_id: string,
	animate: boolean,
	denotesYoungChild: boolean,
	gender: Gender,
	hasIrregularPlural: boolean,
	hasMultiplePlurals: boolean,
	hasPlural: boolean,
	human: boolean,
	meanings: string[],
	multiplePlurals: string[],
	pluralOptional: boolean,
	singular: string,
	plural: string,
	irregularPlural: string
};
