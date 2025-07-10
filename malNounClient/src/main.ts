/* JS imports */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createBootstrap } from "bootstrap-vue-next";
//import { createStore } from "vuex";
import App from './App.vue'
import router from './router'

/* CSS Imports */
import './assets/main.css' // Our main CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

const app = createApp(App)
/*const store = createStore(
	{
		state()
		{
			return {
				loggedIn: false,
				userName: "",
				userAPIURL: "http://15.156.81.125:5000/auth/",
				nounAPIURL: "http://15.156.81.125:5000/api/"
			};
		},

		mutations: {
			loginUser(state)
			{
				state.loggedIn = true; // The user is logged in
			},

			logoutUser(state)
			{
				state.loggedIn = false; // The user is logged out
			},

			setUserName(state, userName)
			{
				state.userName = userName; // Set the user's name after logging in
			}
		}
	}
);*/
app.use(createPinia())
app.use(router)
app.use(createBootstrap())
//app.use(store)
app.mount('#app')
