import { defineStore } from "pinia";

export const useNounStore = defineStore("noun", {
		state: () => {
			return {
				nounAPIURL: "https://mernnoundb.victorcarri.com/api"
			};
		},

		getters: {
			getNounAPIURL: (state) => state.nounAPIURL
		}
	}
);
