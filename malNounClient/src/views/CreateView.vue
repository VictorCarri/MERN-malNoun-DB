<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
import { BLink, BRow, BCol, BAlert } from "bootstrap-vue-next";
import { useNounStore } from "../stores/NounStore";
//import MeaningsList from "../components/MeaningsList.vue"; // Custom component to allow the user to edit a list of meanings
import NounForm from "../components/NounForm.vue"; // The generic form for editing a noun
import type { FormData } from "../types/FormData.ts";
import type { ServerData } from "../types/ServerData.ts";
import { defineComponent } from "vue";
</script>

<template>
	<div v-if="userData.isLoggedIn">
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
		<b-alert variant="success" v-show="showSuccessAlert">
			Successfully created the noun {{ createdNoun }}!
		</b-alert>
		<b-alert variant="danger" v-show="formErrors.length" dismissible>
			There is at least 1 error!
		</b-alert>
	</div>
	<div v-else>
		You must <b-link to="/login">login</b-link> to add a noun to the database.
	</div>
</template>

<script lang="ts">
export default defineComponent({
	name: "CreateView",
	data()
	{
		return {
			userData: useUserStore(),
			showForm: true,
			nounData: useNounStore(),
			showSuccessAlert: false,
			createdNoun: "",
			formErrors: [] as string[],
			formIsValid: false,
			showErrorsAlert: false,
			meanings: [] as string[],
			form: {} as FormData
		};
	},
	methods: {
		onMeaningsListChanged(meaningsList : string[])
		{
			console.log("Meanings list changed: %o", meaningsList);
			this.meanings = [];

			for (let meaning in meaningsList)
			{
				this.meanings.push(meaningsList[meaning]);
			}
		
			console.log("Updated meanings: %o", this.meanings);	
		},

		onCreateNoun(formData : FormData)
		{
			//e.preventDefault();
			
			if (!this.formIsValid) // Form is invalid
			{
				return;
			}
			
			console.log("Creating a noun...\nForm data = %o", formData);
			let nounData = { // Req'd parameters
				singular: formData.singular,
				human: formData.isHuman,
				animate: formData.isAnimate,
				gender: formData.gender,
				meanings: formData.meanings,
				hasPlural: formData.hasPlural,
				denotesYoungChild: formData.isYoungChild,
				hasIrregularPlural: formData.hasIrregularPlural,
				pluralOptional: false,
				irregularPlural: "",
				hasMultiplePlurals: false,
				multiplePlurals: formData.pluralsList,
				plural: formData.irregularPlural
			} as ServerData;

			if (formData.pluralIsOptional)
			{
				nounData.pluralOptional = true;
			}

			/* Only include optional parameters if they're set to non-defaults */
			if (formData.hasOwnProperty("irregularPlural"))
			{
				if (formData.irregularPlural.length >= 1)
				{
					nounData.plural = formData.irregularPlural;
				}
			}

			if (formData.pluralsList.length > 0)
			{
				nounData.multiplePlurals = formData.pluralsList;
			}

			if (formData.hasMultiplePlurals)
			{
				nounData.hasMultiplePlurals = true;
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
							3000
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
				gender: undefined,
				isHuman: false,
				singular: "",
				errors: [],
				meanings: [],
				pluralIsOptional: false,
				hasPlural: true,
				isYoungChild: false,
				hasMultiplePlurals: false,
				pluralsList: [],
				hasIrregularPlural: false,
				irregularPlural: ""
			} as FormData;
			this.showSuccessAlert = false;
		},

		onReset(e : Error)
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

		onValidityChanged(formIsValid : boolean, form : FormData, formValidationResult : object, formValidationErrs : string[])
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
});
</script>
