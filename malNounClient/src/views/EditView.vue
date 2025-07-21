<script setup lang="ts">
import { useNounStore } from "../stores/NounStore";
import NounForm from "../components/NounForm.vue";
import { BRow, BContainer, BAlert } from "bootstrap-vue-next";
</script>

<template>
	<h1>Update the noun {{nounData.getCurrentNoun.singular}}</h1>
	<br />
	<b-alert variant="danger" v-show="showFailureAlert">
		{{ failureReason }}
	</b-alert>
	<b-alert variant="success" v-show="showSuccessAlert">
		Successfully updated the noun {{ nounData.getCurrentNoun.singular }}!
	</b-alert>
	</br />
	<b-container>
		<b-row v-for="error in form.errors">
			<b-alert variant="danger">
				{{ error }}
			</b-alert>
		</b-row>
	</b-container>
	<br />
	<noun-form v-if="showForm" :meanings-list-changed-handler="onMeaningsListChanged" @noun-form-submitted="onEditNoun" @noun-form-reset="onReset" :initial-form="form" submit-button-text="Update this noun" @validity-changed="onFormValidityChanged" />
</template>

<script lang="ts">
export default {
	name: "EditView",
	
	data()
	{
		const nounStore = useNounStore();
		const currentNoun = nounStore.getCurrentNoun;
		console.log("EditView.data(): noun store = %o\nCurrent noun = %o", nounStore, currentNoun);
		return {
			nounData: nounStore,
			showForm: true,
			form: {
				isAnimate: currentNoun.animate,
				gender: currentNoun.gender,
				isHuman: currentNoun.human,
				nounText: currentNoun.singular,
				errors: [],
				meanings: currentNoun.meanings
			},
			showFailureAlert: false,
			failureReason: "",
			showSuccessAlert: false
		};
	},

	methods: {
		onMeaningsListChanged(meaningsList)
		{
			console.log("New meanings list: %o", meaningsList);
			this.form.meanings = meaningsList;
			console.log("Form meanings: %o", this.form.meanings);
		},

		async onEditNoun(formData)
		{
			console.log("onEditNoun: form data = %o", formData);

			if (this.form.errors.length == 0) // No errors
			{
				const urlToFetch = new URL(this.nounData.getNounAPIURL + "/nouns/" + this.nounData.getCurrentNoun._id);
				const fetchOpts = {
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(formData)
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
				return;
			}
		},

		async onFormValidityChanged(isFormValid, formData, validationData, validationErrs)
		{
			const validityResult = await isFormValid;
			console.log("EditView: validity result = %o", validityResult);

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
			}

			else
			{
				console.log("The form is valid!");
			}
		},

		resetForm()
		{
			this.showForm = true;
			const currentNoun = nounStore.getCurrentNoun;
			this.form = {
				isAnimate: currentNoun.animate,
				gender: currentNoun.gender,
				isHuman: currentNoun.human,
				nounText: currentNoun.singular,
				errors: [],
				meanings: currentNoun.meanings
			};
		},

		onReset(e)
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
