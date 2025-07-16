<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
import { BLink, BForm, BFormGroup, BFormCheckbox, BContainer, BRow, BCol, BFormSelect, BFormSelectOption, BFormInput, BButton, BAlert } from "bootstrap-vue-next";
import { useNounStore } from "../stores/NounStore";
import MeaningsList from "../components/MeaningsList.vue"; // Custom component to allow the user to edit a list of meanings
</script>

<template>
	<div v-if="userData.isLoggedIn">
		<BAlert variant="success" v-show="showSuccessAlert">
			Successfully created the noun {{ createdNoun }}!
		</BAlert>
		<BRow>
			<BCol>
				<h1>
					Add a new noun to the database
				</h1>
			</BCol>
		</BRow>
		<BRow>
			<BCol>
				<h2>
					Enter the new noun&apos;s data
				</h2>
			</BCol>
		</BRow>
		<BRow v-if="form.errors.length">
			<h3>Please correct the following error(s):</h3>
			<ul>
				<li v-for="error in form.errors">
					{{ error }}	
				</li>
			</ul>
		</BRow>
		<BForm v-if="showForm" @submit.prevent="onCreateNoun" @reset.prevent="onReset">
			<BRow>
				<BFormGroup
					id="animacyInpGroup"
					label="Animacy:"
					label-for="animacyInp"
					description="Please choose the animacy of the new noun."
				>
					<BFormCheckbox
						id="animacyInp"
						v-model="form.isAnimate"
						name="animacyInp"
					>
						Set whether or not the noun is animate
					</BFormCheckbox>
				</BFormGroup>
			</BRow>
			<BRow>
				<BFormGroup
					id="genderInpGroup"
					label="Gender"
					label-for="genderInp"
					description="Please choose the new noun's gender."
				>
					<BFormSelect v-model="form.gender">
						<BFormSelectOption value="masculine">
							Masculine
						</BFormSelectOption>
						<BFormSelectOption value="feminine">
							Feminine
						</BFormSelectOption>
						<BFormSelectOption value="neuter">
							Neuter
						</BFormSelectOption>
					</BFormSelect>
				</BFormGroup>
			</BRow>
			<BRow>
				<BFormGroup
					id="humanInpGroup"
					label="Humanness:"
					label-for="humanInp"
					description="Please choose whether the new noun refers to a human entity or not:"
				>
					<BFormCheckbox
						id="humanInp"
						v-model="form.isHuman"
						name="humanInp"
					>
						Set whether or not the noun refers to a human
					</BFormCheckbox>
				</BFormGroup>
			</BRow>
			<BRow>
				<BFormGroup
					id="nounTextInpGroup"
					label="Please type the noun in Malayalam Unicode:"
					label-form="nounTextInp"
					description="The noun in Malayalam Unicode."
				>
					<BFormInput
						v-model="form.nounText"
						placeholder="മലയാളം"
					/>
				</BFormGroup>
			</BRow>
			<meanings-list @meanings-list-changed="onMeaningsListChanged" />
			<BRow>
				<BCol>
					<BButton type="submit"
						variant="primary">
						Create the new noun
					</BButton>
				</BCol>
				<BCol>
					<BButton type="reset"
						variant="danger">
						Reset the form
					</BButton>
				</BCol>
			</BRow>
		</BForm>
	</div>
	<div v-else>
		You must <BLink to="/login">login</BLink> to add a noun to the database.
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
			form: {
				isAnimate: false,
				gender: "",
				isHuman: false,
				nounText: "",
				errors: [],
				meanings: []
			},
			nounData: useNounStore(),
			showSuccessAlert: false,
			createdNoun: ""
		};
	},
	methods: {
		validateForm()
		{
			// TODO: write code to validate the input
		},

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

		onCreateNoun(e)
		{
			//e.preventDefault();
			console.log("Creating a noun...");
			const nounData = {
				"singular": this.form.nounText,
				"human": this.form.isHuman,
				"animate": this.form.isAnimate,
				"gender": this.form.gender,
				"meanings": this.meanings
			};
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
		}
	}
};
</script>
