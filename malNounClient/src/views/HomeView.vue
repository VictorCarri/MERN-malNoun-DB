<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
//import { computed } from "vue";
import { BLink, BContainer, BRow, BCol, BButton, BAlert } from "bootstrap-vue-next";
import { useUserStore } from "../stores/UserStore";
import { useNounStore } from "../stores/NounStore";

/*const store = useStore();
const isLoggedIn = computed(() => store.state.loggedIn);
const userName = computed(() => store.state.userName);*/
</script>

<template>
  <main>
	<div v-if="loading">
		Loading noun data...
	</div>
	<div v-else>
		<BAlert v-if="userData.isLoggedIn && showLogoutAlert">
			Successfully logged you out!
		</BAlert>
		<div v-if="userData.isLoggedIn">
			<h1>Welcome, {{userData.getUserName}}</h1>
			<h2>Editable list of nouns</h2>
		</div>
		<h2 v-else>List of nouns</h2>
		<BContainer>
			<BRow>
				<BCol>
					<h3>
						Animate?
					</h3>
				</BCol>
				<BCol>
					<h3>
						Gender
					</h3>
				</BCol>
				<BCol>
					<h3>
						Human?
					</h3>
				</BCol>
				<BCol>
					<h3>
						Singular
					</h3>
				</BCol>
			</BRow>
			<BRow v-for="noun in nouns" :key="noun._id">
				<BCol>
					{{ noun.animate ? "Animate" : "Inanimate"  }}
				</BCol>
				<BCol>
					{{ 
						noun.gender.charAt(0).toUpperCase() + noun.gender.slice(1)
					}}
				</BCol>
				<BCol>
					{{ noun.human ? "Human" : "Non-human" }}
				</BCol>
				<BCol>
					{{ noun.singular }}
				</BCol>
				<BCol v-if="userData.isLoggedIn">
					<BButton>
						Edit
					</BButton>
				</BCol>
				<BCol v-if="userData.isLoggedIn">
					<BButton
						variant="danger">
						Delete
					</BButton>
				</BCol>
			</BRow>
			<BRow v-if="userData.isLoggedIn">
				<BCol>
					<BButton @click="onCreate">
						Add a new noun
					</BButton>
				</BCol>
				<BCol>
					<BButton @click="onLogout">
						Logout
					</BButton>
				</BCol>
			</BRow>
		</BContainer>
		<BContainer v-if="!userData.isLoggedIn">
			Please <BLink to="/login">login</BLink> to edit nouns.
		</BContainer>
	</div>
  </main>
</template>

<script lang="ts">
export default {
	name: "HomeView",
	data()
	{
		return {
			nouns: [],
			loading: true,
			userData: useUserStore(),
			nounData: useNounStore(),
			showLogoutAlert: false
		};
	},
	methods: {
		onCreate(e)
		{
			console.log("Redirecting to creation page...");
			this.$router.push("/create");
		},

		onLogout(e)
		{
			console.log("Logging out...\n\tUser data: %o\n\tUser API URL: %s", this.userData, this.userData.getUserAPIURL);
			fetch(this.userData.getUserAPIURL + "/logout",
				{
					method: "POST",
					credentials: "include"
				}
			)
			.then(resp => resp.json())
			.then(data => {
				console.log("Logout data: %o", data);
				
				if (data.status == "loggedOut") // The logout operation was successful
				{
					console.log("Logging user out on the frontend...");
					this.userData.logUserOut(); // Log the user out
					this.showLogoutAlert = true; // Let the user know that they've been logged out
					setTimeout(() => {
						this.showLogoutAlert = false;
						this.userData.logUserOut();
						this.$router.push("/"); // Send them back to the home page, but as an anonymous user this time
					}, 3000);
				}
			});
		}
	},
	mounted()
	{
		console.log("Store object: %o\n\tNoun store getter: %o", this.nounData, this.nounData.getNounAPIURL);
		fetch(this.nounData.getNounAPIURL + "/nouns") // Get a list of all nouns
		.then(resp => resp.json()) // Convert the noun list to JSON
		.then(nouns => {
			console.log(nouns);
			this.loading = false;
			this.nouns = nouns; // Store the list of nouns to use in our component's state
		})
		.catch(e => console.log(e)); // Handle the noun list
	}
};
</script>
