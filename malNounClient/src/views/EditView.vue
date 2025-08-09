<script setup lang="ts">
import { useNounStore } from "../stores/NounStore";
import NounForm from "../components/NounForm.vue";
import { BRow, BContainer, BAlert } from "bootstrap-vue-next";
import type { Noun } from "../types/noun.ts";
import type { FormData } from "../types/FormData.ts";
</script>

<template>
	<h1>Update the noun {{nounData.getCurrentNoun.singular}}</h1>
	<br />
	<br />
	<noun-form v-if="showForm" :meanings-list-changed-handler="onMeaningsListChanged" @noun-form-submitted="onEditNoun" @noun-form-reset="onReset" :initial-form="form" submit-button-text="Update this noun" @validity-changed="onFormValidityChanged" />
	<b-alert variant="danger" v-show="showFailureAlert">
		{{ failureReason }}
	</b-alert>
	<b-alert variant="success" v-show="showSuccessAlert">
		Successfully updated the noun {{ nounData.getCurrentNoun.singular }}!
	</b-alert>
	<b-container>
		<b-row v-for="error in form.errors">
			<b-alert variant="danger">
				{{ error }}
			</b-alert>
		</b-row>
	</b-container>
</template>

<script lang="ts">
export default {
	name: "EditView",
	
	data()
	{
		const nounStore = useNounStore();
		const currentNoun : Noun = nounStore.getCurrentNoun;
		console.log("EditView.data(): noun store = %o\nCurrent noun = %o", nounStore, currentNoun);
		let toReturn = {
			nounData: nounStore,
			showForm: true,
			form: {
				isAnimate: currentNoun.animate,
				gender: currentNoun.gender,
				isHuman: currentNoun.human,
				singular: currentNoun.singular,
				errors: [] as string[],
				meanings: currentNoun.meanings,
				pluralIsOptional: currentNoun.pluralOptional,
				hasPlural: currentNoun.hasPlural,
				isYoungChild: currentNoun.denotesYoungChild,
				hasMultiplePlurals: currentNoun.hasMultiplePlurals,
				pluralsList: currentNoun.multiplePlurals,
				hasIrregularPlural: currentNoun.hasIrregularPlural,
				irregularPlural: currentNoun.irregularPlural
			} as FormData,
			showFailureAlert: false,
			failureReason: "",
			showSuccessAlert: false
		};

		if (currentNoun.hasOwnProperty("irregularPlural"))
		{
			toReturn.form["irregularPlural"] = currentNoun["irregularPlural"];
		}

		return toReturn;
	},

	methods: {
		onMeaningsListChanged(meaningsList : string[])
		{
			console.log("New meanings list: %o", meaningsList);
			this.form.meanings = meaningsList;
			console.log("Form meanings: %o", this.form.meanings);
		},

		async onEditNoun(formData : FormData)
		{
			console.log("onEditNoun: form data = %o", formData);

			if (this.form.errors.length == 0) // No errors
			{
				console.log("onEditNoun: calling API\n\tNoun codepoints: %o", [...this.form.singular].map(char => char.charAt(0)));
				const formDataToSend = JSON.stringify(this.form); // TODO: create a JSON object using the same parameters as the backend
				console.log("onEditNoun: form data to send = %o", formDataToSend);
				const urlToFetch = new URL(this.nounData.getNounAPIURL + "/nouns/" + this.nounData.getCurrentNoun._id);
				const fetchOpts : RequestInit = {
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: formDataToSend
				};
				console.log("Fetching URL %o with data %o", urlToFetch, fetchOpts);
				const fetchRes = await fetch(urlToFetch, fetchOpts); // Fetch the data
				const jsonData = await fetchRes.json(); // Convert it to JSON
				console.log(jsonData);

				if (jsonData.success) // The request succeeded
				{
					this.showSuccessAlert = true;
					setTimeout(() =>
						{
							this.showSuccessAlert = false;
							setTimeout(() => {
								this.$router.push("/");
							},
							2000);
						},
						5000
					);
				}

				else // PATCH failed
				{
					this.showFailureAlert = true;	
					this.failureReason = jsonData.error;
					/*setTimeout(() => {
							this.showFailureAlert = false;
							setTimeout(() => {
									this.$router.push("/");
								}
							, 2000);
						},
					3000);*/
				}
			}

			else
			{
				console.log("onEditNoun: the form has errors: %o", );
				return;
			}
		},

		async onFormValidityChanged(isFormValid : boolean, formData : FormData, validationData : object, validationErrs : string[])
		{
			const validityResult = await isFormValid;
			console.log("EditView: validity result = %o", validityResult);
			this.form = formData; // ALWAYS STORE FORM DATA!

			if (!validityResult) //  The form is invalid
			{
				console.log("Form validity data: %o\nForm validation errors: %o", validationData, validationErrs);
				this.form.errors = [];
				console.log("onFormValidityChanged: this.form.errors = %o", this.form.errors);
				
				for (const err in validationErrs)
				{
					this.form.errors.push(validationErrs[err]);
				}

				console.log("onFormValidityChanged: this.form.errors = %o", this.form.errors);
				console.log("onFormValidityChanged: codepoints in this.form.singular = %o", [...this.form.singular].map(char => char.charAt(0)));
			}

			else
			{
				console.log("The form is valid!");
				this.form.errors = []; // Reset errors
			}
		},

		resetForm()
		{
			this.showForm = true;
			const currentNoun : Noun = this.nounData.getCurrentNoun;
			this.form = {
				isAnimate: currentNoun.animate,
				gender: currentNoun.gender,
				isHuman: currentNoun.human,
				singular: currentNoun.singular,
				errors: [],
				meanings: currentNoun.meanings,
				pluralIsOptional: currentNoun.pluralOptional,
				hasPlural: currentNoun.hasPlural,
				isYoungChild: currentNoun.denotesYoungChild,
				hasMultiplePlurals: currentNoun.hasMultiplePlurals,
				pluralsList: currentNoun.multiplePlurals,
				hasIrregularPlural: currentNoun.hasIrregularPlural,
				irregularPlural: currentNoun.irregularPlural
			} as FormData;
		},

		onReset(e : Error)
		{
			this.resetForm();
			this.showForm = false;
			this.$nextTick(() => { this.showForm = true;});
		}
	},
	
	mounted()
	{
		console.log("EditView.mounted(): current noun = %o\n\tform = %o", this.nounData.getCurrentNoun, this.form);
	}
};
</script>
