<script setup lang="ts">
import { BForm, BFormGroup, BFormInput, BButton, BAlert, BRow, BCol, BContainer, BFormInvalidFeedback } from "bootstrap-vue-next";
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
		<BAlert variant="danger" v-model="showServerErrorAlert">
			{{ serverError }}
		</BAlert>
		<BContainer v-if="form.errors.length">
			<BRow v-for="error in form.errors">
				<BCol>
					<BAlert variant="danger">
						{{ error }}
					</BAlert>
				</BCol>
			</BRow>
		</BContainer>
		<BForm v-if="show" @submit.prevent="onLogin" @reset.prevent="onReset" @input.prevent="formIsValid">
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
					novalidate
					:state="form.emailState"
				/>
				<BFormInvalidFeedback>
					You must enter a valid email
				</BFormInvalidFeedback>
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
					:state="form.passwordState"
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
				email: null,
				password: null,
				errors: [],
				emailState: false,
				passwordState: false
			},
			show: true,
			showSuccessAlert: false,
			store: useUserStore(),
			showServerErrorAlert: false,
			serverError: ""
		};
	},
	methods: {
		emailIsValid(email)
		{
			 var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		      let toReturn = re.test(email);
			console.log("emailIsValid: toReturn = %o", toReturn);
			return toReturn;
		},

		formIsValid()
		{
			console.log("formIsValid called\n\tthis.form = %o", this.form);
			this.form.errors = []; // Reset validation errors on call

			/*if (this.form.email && this.form.password) // The user has entered something for both
			{
				if (this.emailIsValid(this.form.email)) // The email is valid
				{
					this.form.emailState = true; // Mark the input field as valid
					return true; // The form is valid
				}

				else // The email is invalid
				{
					this.form.emailState = false;
					this.form.errors.push("Your email is invalid");
					return false;
				}
			}

			else // The user has not entered one of the 2
			{
				if (!this.form.email)
				{
					this.form.emailState = false;
					this.form.errors.push("Email required");
				}

				if (!this.form.password)
				{
					this.form.errors.push("Password required");
				}

				return false; // The form is invalid
			}*/

			if (this.form.email) // The user has entered their email
			{
				/* Validate their email */
				if (this.emailIsValid(this.form.email)) // Their email is valid
				{
					this.form.emailState = true; // Mark the email input field as valid

					if (this.form.password) // The user has entered a password
					{
						this.form.passwordState = true;
						// The user has entered a valid email and a password
						return true; // The entire form is valid
					}

					else // The user hasn't entered a password
					{
						this.form.errors.push("Password required.");
						this.form.passwordState = false;
						return false;
					}
				}

				else // Their email is invalid
				{
					this.form.emailState = false;
					this.form.passwordState = true;
					this.form.errors.push("Your email is invalid.");
					return false;
				}
			}

			else // No email
			{
				this.form.emailState = false;
				this.form.passwordState = true;
				this.form.errors.push("Email required");
				return false;
			}
		},

		onLogin(e)
		{
			//e.preventDefault();
			console.log("onLogin: formIsValid = %o", this.formIsValid());
			
			if (!this.formIsValid()) // The form is invalid
			{
				return false; // Stop
			}

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
						this.showServerErrorAlert = true;
						this.serverError = data.error;
						setTimeout(() => {
								this.showServerErrorAlert = false;
								this.serverError = "";
							},
							4000
						);
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
			//e.preventDefault();

			/* Reset form values */
			this.form.email = null
			this.form.password = null

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
