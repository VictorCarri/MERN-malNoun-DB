import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";

const routeArr = [
	{
		path: "/",
		name: "Home",
		component: HomeView
	},

	{
		path: "/login",
		name: "Login",
		component: LoginView
	}
];

const router = createRouter(
	{
		history: createWebHistory(import.meta.env.BASE_URL),
		routes: routeArr
	}
);

export default router;
