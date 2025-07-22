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
		<BAlert v-show="showLogoutAlert" variant="success">
			Successfully logged you out!
		</BAlert>
		<b-alert v-show="showDeletionAlert" variant="success">
			Successfully deleted the noun {{ deletedNoun.singular }}.
		</b-alert>
		<b-alert v-show="showDeletionFailureAlert" variant="danger">
			Could't delete the noun {{ deletedNoun.singular }}: {{ deletionError }}.
		</b-alert>
		<div v-if="userData.isLoggedIn">
			<h1>Welcome, {{userData.getUserName}}</h1>
			<h2>Editable list of nouns</h2>
		</div>
		<h2 v-else>List of nouns</h2>
		<BContainer fluid>
			<BRow fluid>
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
				<BCol>
					<h3>
						Meanings
					</h3>
				</BCol>
				<BCol>
					<h3>
						Special Plural forms
					</h3>
				</BCol>
			</BRow>
			<BRow v-for="(noun, nounIndex) in nouns" :key="noun._id" fluid>
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
				<BCol>
					<ol>
						<li v-for="(meaning, index) in noun.meanings" :key="index">
							{{ meaning }}
						</li>
					</ol>
				</BCol>
				<BCol v-if="Object.hasOwn(noun, 'plural')"> <!-- The noun has a special plural -->
					{{ noun.plural }}
				</BCol>
				<BCol v-if="userData.isLoggedIn">
					<BButton @click="onEdit(noun)">
						Edit
					</BButton>
				</BCol>
				<BCol v-if="userData.isLoggedIn">
					<BButton variant="danger" @click="onDelete(noun)">
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
			showLogoutAlert: false,
			deletedNoun: "",
			showDeletionAlert: false,
			deletionError: "",
			showDeletionFailureAlert: false
		};
	},
	methods: {
		onCreate(e)
		{
			console.log("Redirecting to creation page...");
			this.$router.push("/create");
		},

		onEdit(data)
		{
			console.log("Redirecting you to the editing page...\nData = %o", data);
			this.nounData.setCurrentNoun(data);
			this.$router.push("/edit");
			console.log("onEdit: After router call");
		},

		async onDelete(noun)
		{
			console.log("Deleting noun %o", noun._id);
			const fetchURL = new URL(this.nounData.getNounAPIURL + "/nouns/" + noun._id);
			const fetchOpts = {
					method: "DELETE",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					}
			};
	
			try
			{
				const fetchResp = await fetch(fetchURL, fetchOpts);
				const jsonData = await fetchResp.json();
				console.log(jsonData);
				this.deletedNoun = noun; // So that the UI can show the appropriate alert

				if (jsonData.success) // Delete operation was successful
				{
					this.showDeletionAlert = true;
					setTimeout(() => {
							this.showDeletionAlert = false;
							this.$router.push("/"); // Reload the page
						},
					4000);
				}

				else // Delete operation was unsuccessful
				{
					this.showDeletionFailureAlert = true;
					this.deletionError = jsonData.error;
					setTimeout(() => {
							this.showDeletionFailureAlert = false;
						},
					4000);
				}
			}

			catch (e)
			{
				console.log("onDelete: fetch error: %o", e);
			}
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
