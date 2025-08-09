import type { Gender } from "./Gender.ts";

export interface FormData {
	isAnimate: boolean,
	gender: Gender,
	isHuman: boolean,
	singular: string,
	errors: string[],
	meanings: string[],
	pluralIsOptional: boolean,
	hasPlural: boolean,
	isYoungChild: boolean,
	hasMultiplePlurals: boolean,
	pluralsList: string[],
	hasIrregularPlural: boolean,
	irregularPlural: string
};
