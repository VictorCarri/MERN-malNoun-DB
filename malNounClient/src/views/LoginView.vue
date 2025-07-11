<script setup lang="ts">
import { BForm, BFormGroup, BFormInput, BButton, BAlert } from "bootstrap-vue-next";
import { reactive, ref } from "vue";
import { useUserStore } from "../stores/UserStore";
</script>

<template>
	<div class="login">
		<BAlert
			variant="success"
			v-model="showSuccessAlert"
		>
			Successfully logged in, redirecting...
		</BAlert>
		<BForm v-if="show" @submit="onLogin" @reset="onReset">
			<BFormGroup
				id="emailInpGroup"
				label="Email:"
				label-for="emailInp"
				description="Please enter your e-mail address to log in:"
			>
				<BFormInput
					id="emailInp"
					v-model="form.email"
					type="email"
					placeholder="email@email.com"
					required
				/>
			</BFormGroup>

			<BFormGroup
				id="passwordInpGroup"
				label="Password:"
				label-for="passwordInp"
				description="Please enter your password to log in:"
			>
				<BFormInput
					id="passwordInp"
					v-model="form.password"
					type="password"
					placeholder="Enter your password"
					required
				/>
			</BFormGroup>

			<BButton
				type="submit"
				variant="primary"
			>
				Submit
			</BButton>

			<BButton
				type="reset"
				variant="danger"
			>
				Reset
			</BButton>
		</BForm>
	</div>
  </template>

<script lang="ts">
export default {
  name: 'LoginView',
data() {
		return {
			form: {
				email: "",
				password: ""
			},
			show: true,
			showSuccessAlert: false,
			store: useUserStore()
		};
	},
	methods: {
		onLogin(e)
		{
			e.preventDefault();
			console.log("Logging in...\nPinia store = %o\nUser API URL = %s", this.store, this.store.getUserAPIURL);
			fetch(this.store.getUserAPIURL + "/login",
			//fetch("http://15.156.81.125:5000/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(
						{
							email: this.form.email,
							password: this.form.password
						}
					),
					credentials: "include"
				}
			)
			.then(resp => resp.json())
			.then(data => {
					console.log("Login fetch data: %o", data);
				
					if (data.success) // The user successfully logged in
					{
						console.log("Login was successful, redirecting...");
						this.showSuccessAlert = true;
						setTimeout(() => {
							this.showSuccessAlert = false;
							//this.$store.commit("loginUser"); // Mark the user as logged in in our app
							this.store.logUserIn(); // Log the user in
							//this.$store.commit("setUserName", data.userName);
							this.store.setUserName(data.userName);
							this.$router.push("/"); // Redirect to the home page
						}, 3000);
					}

					else // Login error
					{
						console.error("Login error: %o", data);
					}
				}
			)
			.catch(e => {
					console.log("Error while fetching login request: %o", e);
				}
			);
		},

		onReset(e)
		{
			e.preventDefault();

			/* Reset form values */
			this.form.email = "";
			this.form.password = "";

			/* Trick to reset/clear native browser form validation state */
			this.show = false;
			this.$nextTick(() => {
					this.show = true;
				}
			);
		}
	}
}
</script>
