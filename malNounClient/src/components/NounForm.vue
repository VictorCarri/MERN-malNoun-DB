<script setup lang="ts">
import { BForm, BRow, BFormGroup, BFormCheckbox, BFormSelect, BFormSelectOption, BFormInput, BButton, BCol, BLink } from "bootstrap-vue-next";
import MeaningsList from "./MeaningsList.vue";
import { object, boolean, string, array } from "yup";
</script>

<template>
	<BRow>
		<BForm v-if="showForm" @submit.prevent="$emit('nounFormSubmitted', form)" @reset.prevent="$emit('nounFormReset')" @change="$emit('validityChanged', formIsValid(), form, formValidationResult, formValidationErrs)">
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
			<meanings-list @meanings-list-changed="onMeaningsListChanged" :initial-meanings="form.meanings" />
			<BRow>
				<BCol>
					<BButton type="submit"
						variant="primary">
						{{ submitButtonText }}
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
	</BRow>
	<br />
	<BRow>
		<BCol>
			<BLink to="/">Return home</BLink>
		</BCol>
	</BRow>
</template>

<script lang="ts">
export default {
	name: "NounForm",

	props: {
		meaningsListChangedHandler: {
			type: Function,
			required: true
		},
		initialForm: {
			type: Object,
			required: false,

			default (rawProps)
			{
				return {
					isAnimate: false,
					gender: "",
					isHuman: false,
					nounText: "",
					errors: [],
					meanings: []
				};
			}
		},
		submitButtonText: {
			type: String,
			default: "Create the new noun"
		}
	},
	
	data() {
		console.log("NounForm.data(): initialForm = %o", this.initialForm);
		const toReturn = {
			showForm: true,
			onMeaningsListChanged: this.meaningsListChangedHandler,
			form: {
				isAnimate: this.initialForm.isAnimate,
				gender: this.initialForm.gender,
				isHuman: this.initialForm.isHuman,
				nounText: this.initialForm.nounText,
				errors: [],
				meanings: this.initialForm.meanings
			},
			formSchema: object(
				{
					isAnimate: boolean().required().default(false),
					gender: string().required().lowercase().oneOf(["masculine", "feminine", "neuter"]),
					isHuman: boolean().required().default(false),
					nounText: string().required().min(1).test("onlyContainsMalayalam", "${path} contains invalid Malayalam code points", (value, context) => {
							const codePoints = Array.from(value);
							console.log("Malayalam code points: %o", codePoints);
							let toReturn = true;
		
							for (let codePoint = 0; codePoint < codePoints.length - 1; codePoint++)
							{
								console.log("Current Malayalam code point: %o", codePoints[codePoint]);
								const curCodePoint = codePoints[codePoint].codePointAt(0);
								console.log("Current code point: %d\n\tCurrent code point is equal to or higher than the minimum: %o\n\tCurrent codepoint is equal to or lower than the maximum: %o", curCodePoint, curCodePoint >= 0x0D00, curCodePoint <= 0x0D7F);
								toReturn = toReturn && curCodePoint >= 0x0D00 && curCodePoint <= 0x0D7F;
							}

							return toReturn;
					}),
					meanings: array().of(string().required().min(1)).min(1)
				}
			),
			formValidationResult: {},
			formValidationErrs: []
		};
		console.log("NounForm.data(): returning %o", toReturn);
		return toReturn;
	},

	components: {
		BForm,
		BRow,
		BFormGroup,
		BFormCheckbox,
		BFormSelect,
		BFormSelectOption,
		BFormInput,
		BButton
	},

	emits: ["nounFormSubmitted", "nounFormReset", "validityChanged"],

	methods: {
		async formIsValid()
		{
			try
			{
				this.formValidationResult = await this.formSchema.validate(this.form);
				console.log("NounForm: result of validation: %o", this.formValidationResult);
				return true;
			}

			catch (e)
			{
				console.error("Form validation error: %o", e);
				this.formValidationErrs = e.errors;
				return false;
			}
		}
	}
};
</script>
