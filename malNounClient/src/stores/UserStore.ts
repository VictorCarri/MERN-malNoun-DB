import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
		state: () => {
			return {
				loggedIn: false, // Whether or not the user is logged in
				userName:  "", // The user's user name
				userAPIURL: "http://15.156.81.125:5000/auth/", // The API URL we need to handle user ops
				nounAPIURL: "http://15.156.81.125:5000/api/" // The API URL we need to handle noun ops
			};
		},

		getters: {
			isLoggedIn: (state) => state.loggedIn,
			getUserName: (state) => state.userName,
			getUserAPIURL: (state) => state.userAPIURL,
			getNounAPIURL: (state) => state.nounAPIURL
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
