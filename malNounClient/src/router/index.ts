import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import CreateView from "../views/CreateView.vue";
import EditView from "../views/EditView.vue";

import { useUserStore } from "../stores/UserStore";

/* Route def'ns */
const routeArr = [
	{
		path: "/",
		name: "Home",
		component: HomeView,
		meta: {
			requiresAuth: false,
			optionalAuth: true
		}
	},

	{
		path: "/login",
		name: "Login",
		component: LoginView,
		meta: {
			requiresAuth: false,
			optionalAuth: false
		}
	},
	
	{
		path: "/create",
		name: "Create a noun",
		component: CreateView,
		meta: {
			requiresAuth: true,
			optionalAuth: false
		}
	},

	{
		path: "/edit",
		name: "Edit",
		component: EditView,
		meta: {
			requiresAuth: true,
			optionalAuth: false
		}
	}
];

/* Create the router using the route def'ns */
const router = createRouter(
	{
		history: createWebHistory(import.meta.env.BASE_URL),
		routes: routeArr
	}
);

/* Ask the server whether the user is authenticated whenever the user tries to enter any route that requires authentication */
router.beforeEach(async (to, from) => {
		console.log("router.beforeEach called.\n\tto = %o\n\tfrom = %o", to, from);

		if (to.meta.requiresAuth || to.meta.optionalAuth)// The user is trying to access a protected route or a route that optionally displays protected content
		{
			console.log("You're trying to access a protected route.");
	
			/* Call the server to check if we're logged in, because we set an HTTP-only JWT cookie that JavaScript can't access. Thus, we need to contact the server to ask if the user's cookies are valid. */
			const userStore = useUserStore();
			console.log("router.beforeEach: userStore = %o\n\tUser API URL = %s", userStore, userStore.getUserAPIURL);

			try
			{
				const fetchResp = await fetch(userStore.getUserAPIURL + "/isLoggedIn",
					{
						credentials: "include"
					}
				);
				const data = await fetchResp.json();
				console.log("router.beforeEach -> requiresAuth: IsLoggedIn data = %o", data)
					
				if (data.loggedIn) // The user is logged in, according to the server
				{
					userStore.logUserIn(); // Mark the user as logged-in
					return true; // Allow the user to proceed
				}
	
				else // The user isn't logged in
				{
					if (to.meta.requiresAuth) // Only redirect the user if he/she's trying to access a page that *requires* authentication
					{
						return { name: "Login" }; // Redirect the user to the login page
					}
	
					else // They're trying to access a page that doesn't *require* authentication
					{
						return true; // Let them through
					}
				}
			}

			catch(e) // Error while fetching
			{
				console.log("router.beforeEach -> requiresAuth: error: %o", e);
				return false; // Return the user to the previous page
			}
		}

		else // They're trying to access an unprotected route
		{
			return true; // Let them through
		}
	}

);

export default router;
