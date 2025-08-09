import type { Gender } from "./Gender.ts";

export interface ServerData {
	animate: boolean,
	gender: Gender,
	human: boolean,
	singular: string,
	meanings: string[],
	pluralOptional: boolean,
	hasPlural: boolean,
	denotesYoungChild: boolean,
	hasMultiplePlurals: boolean,
	multiplePlurals: string[],
	hasIrregularPlural: boolean,
	plural: string
};
