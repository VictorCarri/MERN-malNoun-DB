import { defineStore } from "pinia";
import type { Noun } from "../types/noun.ts";

export const useNounStore = defineStore("noun", {
		state: () => {
			return {
				nounAPIURL: "https://mernnoundb.victorcarri.com/api",
				currentNoun: {
					animate: false,
					denotesYoungChild: false,
					gender: "neuter",
					hasIrregularPlural: false,
					hasMultiplePlurals: false,
					hasPlural: true,
					human: false,
					meanings: [] as string[],
					multiplePlurals: [] as string[],
					pluralOptional: false,
					singular: "",
					plural: "",
					irregularPlural: ""
				} as Noun
			};
		},

		getters: {
			getNounAPIURL: (state) => state.nounAPIURL,
			getCurrentNoun: (state) => state.currentNoun
		},

		actions: {
			setCurrentNoun(noun : Noun)
			{
				this.currentNoun = noun;
			}
		}
	}
);
