<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
import { BLink, BRow, BCol, BAlert } from "bootstrap-vue-next";
import { useNounStore } from "../stores/NounStore";
//import MeaningsList from "../components/MeaningsList.vue"; // Custom component to allow the user to edit a list of meanings
import NounForm from "../components/NounForm.vue"; // The generic form for editing a noun
</script>

<template>
	<div v-if="userData.isLoggedIn">
		<b-alert variant="success" v-show="showSuccessAlert">
			Successfully created the noun {{ createdNoun }}!
		</b-alert>
		<b-alert variant="danger" v-show="formErrors.length" dismissible>
			There is at least 1 error!
		</b-alert>
		<b-row>
			<b-col>
				<h1>
					Add a new noun to the database
				</h1>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<h2>
					Enter the new noun&apos;s data
				</h2>
			</b-col>
		</b-row>
		<noun-form v-if="showForm" :meanings-list-changed-handler="onMeaningsListChanged" @noun-form-submitted="onCreateNoun" @noun-form-reset="onReset" @validity-changed="onValidityChanged" />
	</div>
	<div v-else>
		You must <b-link to="/login">login</b-link> to add a noun to the database.
	</div>
</template>

<script lang="ts">
export default {
	name: "CreateView",
	data()
	{
		return {
			userData: useUserStore(),
			showForm: true,
			nounData: useNounStore(),
			showSuccessAlert: false,
			createdNoun: "",
			formErrors: [],
			formIsValid: false,
			showErrorsAlert: false
		};
	},
	methods: {
		onMeaningsListChanged(meaningsList)
		{
			console.log("Meanings list changed: %o", meaningsList);
			this.meanings = [];

			for (let meaning in meaningsList)
			{
				this.meanings.push(meaningsList[meaning]);
			}
		
			console.log("Updated meanings: %o", this.meanings);	
		},

		onCreateNoun(formData)
		{
			//e.preventDefault();
			
			if (!this.formIsValid) // Form is invalid
			{
				return;
			}
			
			console.log("Creating a noun...\nForm data = %o", formData);
			const nounData = { // Req'd parameters
				singular: formData.nounText,
				human: formData.isHuman,
				animate: formData.isAnimate,
				gender: formData.gender,
				meanings: formData.meanings
			};

			/* Only include optional parameters if they're set to non-defaults */
			if (formData.hasOwnProperty("irregularPlural"))
			{
				if (formData.irregularPlural.length >= 1)
				{
					nounData.plural = formData.irregularPlural;
				}
			}

			if (formData.pluralIsOptional)
			{
				nounData.pluralOptional = true;
			}

			if (formData.pluralsList.length > 0)
			{
				nounData.multiplePlurals = formData.pluralsList;
			}

			if (!formData.hasPlural)
			{
				nounData.hasPlural = false;
			}

			if (formData.isYoungChild)
			{
				nounData.denotesYoungChild = true;
			}

			if (formData.hasMultiplePlurals)
			{
				nounData.hasMultiplePlurals = true;
			}

			if (formData.hasIrregularPlural)
			{
				nounData.hasIrregularPlural = true;
			}

			console.log("Noun data to send: %o", nounData);
			fetch(this.nounData.getNounAPIURL + "/nouns",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(nounData)
				}
			)
			.then(resp => resp.json())
			.then(data => {
					console.log(data);

					if (data.success) // We successfully created a noun!
					{
						this.createdNoun = data.createdNoun.singular; // Show the user the noun they created
						this.showSuccessAlert = true;
						setTimeout(() => {
								this.showSuccessAlert = false;
								this.$router.push("/"); // Redirect the user to the homepage to show them the newly-created noun
							},
							4000
						);
					}
				
					else
					{
						console.log("Error in creating a noun...");
					}
				}
			)
			.catch((e) => console.log(e));
		},

		resetForm()
		{
			this.form = {
				isAnimate: false,
				gender: "",
				isHuman: false,
				nounText: "",
				errors: [],
				meanings: []
			};
			this.showSuccessAlert = false;
		},

		onReset(e)
		{
			//e.preventDefault();
			
			/* Reset form values */
			this.resetForm();

			/* Trick to reset/clear native browser form validation state */
			this.showForm = false;
			this.$nextTick(() => {
					this.showForm = true;
				}
			);
		},

		onValidityChanged(formIsValid, form, formValidationResult, formValidationErrs)
		{
			console.log("onValidityChanged: formIsValid = %o", formIsValid);
			console.log("onValidityChanged: formValidationErrs = %o", formValidationErrs);
			this.formIsValid = formIsValid;
			console.log("onValidityChanged: this.formIsValid = %o", this.formIsValid);

			if (this.formIsValid)
			{
				this.formErrors = [];
			}

			else
			{
				this.formErrors = formValidationErrs;
				console.log("onValidityChanged: this.formErrors = %o", this.formErrors);
			}
		}
	}
};
</script>
