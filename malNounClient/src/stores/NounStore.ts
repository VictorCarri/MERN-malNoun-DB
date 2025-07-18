import { defineStore } from "pinia";

export const useNounStore = defineStore("noun", {
		state: () => {
			return {
				nounAPIURL: "https://mernnoundb.victorcarri.com/api",
				currentNoun: {
					animate: false,
					gender: "",
					human: false,
					singular: "",
					plural: ""
				}
			};
		},

		getters: {
			getNounAPIURL: (state) => state.nounAPIURL,
			getCurrentNoun: (state) => state.currentNoun
		},

		actions: {
			setCurrentNoun(noun)
			{
				this.currentNoun = noun;
			}
		}
	}
);
