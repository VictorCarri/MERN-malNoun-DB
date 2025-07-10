import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import CreateView from "../views/CreateView.vue";

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
	},
	
	{
		path: "/create",
		name: "Create a noun",
		component: CreateView
	}
];

const router = createRouter(
	{
		history: createWebHistory(import.meta.env.BASE_URL),
		routes: routeArr
	}
);

export default router;
