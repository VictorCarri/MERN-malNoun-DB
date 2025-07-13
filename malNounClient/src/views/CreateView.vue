<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
import { BLink, BForm, BFormGroup, BFormCheckbox, BContainer, BRow, BCol, BFormSelect, BFormSelectOption, BFormInput, BButton } from "bootstrap-vue-next";
import { watch } from "vue";
import { useNounStore } from "../stores/NounStore";
</script>

<template>
	<div v-if="userData.isLoggedIn">
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
		<BForm v-if="showForm" @submit="onCreateNoun" @reset="onReset">
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
				errors: []
			},
			nounData: useNounStore()
		};
	},
	methods: {
		onCreateNoun(e)
		{
			e.preventDefault();
			console.log("Creating a noun...");
			const nounData = {
				"singular": this.form.nounText,
				"human": this.form.isHuman,
				"animate": this.form.isAnimate,
				"gender": this.form.gender
			};
			console.log("Noun data to send: %o", nounData);
			/*fetch(this.nounData.getNounAPIURL + "/nouns",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(nounData)
				}
			);*/
		},

		onReset(e)
		{
			e.preventDefault();
			
			/* Reset form values */
			this.form = {
				isAnimate: false,
				gender: "",
				isHuman: false,
				nounText: "",
				errors: []
			},

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
