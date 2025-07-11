import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
		state: () => {
			return {
				loggedIn: false, // Whether or not the user is logged in
				userName:  "", // The user's user name
				userAPIURL: "https://mernnoundb.victorcarri.com/auth" // The API URL we need to handle user ops
			};
		},

		getters: {
			isLoggedIn: (state) => state.loggedIn,
			getUserName: (state) => state.userName,
			getUserAPIURL: (state) => state.userAPIURL
		},

		actions: {
			logUserIn()
			{
				this.loggedIn = true;
			},

			logUserOut()
			{
				this.loggedIn = false;
			},

			setUserName(userName : string)
			{
				this.userName = userName;
			}
		}
	}
);
