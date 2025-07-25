<script setup lang="ts">
import { BForm, BRow, BFormGroup, BFormCheckbox, BFormSelect, BFormSelectOption, BFormInput, BButton, BCol, BLink } from "bootstrap-vue-next";
import MeaningsList from "./MeaningsList.vue";
import PluralInfo from "./PluralInfo.vue";
import { object, boolean, string, array } from "yup";
</script>

<template>
	<b-row>
		<ol>
			<li v-for="error in formValidationErrs">
				{{error}}
			</li>
		</ol>
	</b-row>
	<b-row>
		<BForm v-if="showForm" @submit.prevent="$emit('nounFormSubmitted', form)" @reset.prevent="$emit('nounFormReset')" @change="onFormChanged">
			<b-row>
				<b-form-group
					id="animacyInpGroup"
					label="Animacy:"
					label-for="animacyInp"
					description="Please choose the animacy of the new noun."
				>
					<b-form-checkbox
						id="animacyInp"
						v-model="form.isAnimate"
						name="animacyInp"
					>
						Set whether or not the noun is animate
					</b-form-checkbox>
				</b-form-group>
			</b-row>
			<b-row>
				<b-form-group
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
				</b-form-group>
			</b-row>
			<b-row>
				<b-form-group
					id="humanInpGroup"
					label="Humanness:"
					label-for="humanInp"
					description="Please choose whether the new noun refers to a human entity or not:"
				>
					<b-form-checkbox
						id="humanInp"
						v-model="form.isHuman"
						name="humanInp"
					>
						Set whether or not this noun refers to a human
					</b-form-checkbox>
				</b-form-group>
			</b-row>
			<b-row>
				<b-form-group
					id="nounTextInpGroup"
					label="Please type the noun in Malayalam Unicode:"
					label-form="nounTextInp"
					description="The noun in Malayalam Unicode."
				>
					<b-form-input
						v-model="form.nounText"
						placeholder="മലയാളം"
					/>
				</b-form-group>
			</b-row>
			<b-row>
				<b-form-group
					id="denotesYoungChildInpGroup"
					label="Does this noun denote a young child?"
					label-for="denotesYoungChildInp"
					description="Please choose whether the new noun refers to an entity that is a young child:"
				>
					<b-form-checkbox
						id="denotesYoungChildInp"
						v-model="form.isYoungChild"
						name="denotesYoungChildInp"
					>
						Set whether or not this noun refers to a young child
					</b-form-checkbox>
				</b-form-group>
			</b-row>
			<meanings-list
				@meanings-list-changed="onMeaningsListChanged"
				:initial-meanings="form.meanings" />
			<plural-info
				:is-optional="form.pluralIsOptional"
				:has-plural="form.hasPlural"
				:has-multiple-plurals="form.hasMultiplePlurals"
				@plurals-list-changed="onPluralsListChanged"
				:has-irregular-plural="form.hasIrregularPlural"
				@has-plural-changed="onHasPluralChanged"
				@has-irregular-plural-changed="onHasIrregularPluralChanged"
				@irregular-plural-changed="onIrregularPluralChanged"
				@plural-is-optional-changed="onPluralIsOptionalChanged"
				@has-multiple-plurals-changed="onHasMultiplePluralsChanged" />
			<b-row>
				<b-col>
					<b-button type="submit"
						variant="primary">
						{{ submitButtonText }}
					</b-button>
				</b-col>
				<b-col>
					<b-button type="reset"
						variant="danger">
						Reset the form
					</b-button>
				</b-col>
			</b-row>
		</BForm>
	</b-row>
	<br />
	<b-row>
		<b-col>
			<BLink to="/">Return home</BLink>
		</b-col>
	</b-row>
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
					meanings: [],
					pluralIsOptional: false,
					hasPlural: true,
					isYoungChild: false,
					hasMultiplePlurals: false,
					pluralsList: [],
					hasIrregularPlural: false,
					hasPlural: true,
					irregularPlural: ""
				};
			}
		},
		submitButtonText: {
			type: String,
			default: "Create the new noun"
		}
	},

	validateMalayalam(value, context)
	{
		const codePoints = Array.from(value);
		console.log("NounForm.validateMalayalam: Malayalam code points: %o", codePoints);
		let toReturn = true;

		for (let codePoint = 0; codePoint < codePoints.length - 1; codePoint++)
		{
			console.log("NounForm.validateMalayalam: Current Malayalam code point: %o", codePoints[codePoint]);
			const curCodePoint = codePoints[codePoint].codePointAt(0);
			console.log("NounForm.validateMalayalam: Current code point: %d\n\tCurrent code point is equal to or higher than the minimum: %o\n\tCurrent codepoint is equal to or lower than the maximum: %o", curCodePoint, curCodePoint >= 0x0D00, curCodePoint <= 0x0D7F);
			toReturn = toReturn && curCodePoint >= 0x0D00 && curCodePoint <= 0x0D7F;
		}

		return toReturn;
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
				meanings: this.initialForm.meanings,
				pluralIsOptional: this.initialForm.pluralIsOptional,
				hasPlural: this.initialForm.hasPlural,
				isYoungChild: this.initialForm.isYoungChild,
				hasMultiplePlurals: this.initialForm.hasMultiplePlurals,
				pluralsList: this.initialForm.pluralsList,
				hasIrregularPlural: this.initialForm.hasIrregularPlural,
				hasPlural: this.initialForm.hasPlural,
				irregularPlural: this.initialForm.irregularPlural
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
					meanings: array().required().of(string().required().min(1)).min(1),
					pluralIsOptional: boolean().required().default(false),
					hasPlural: boolean().optional().default(true),
					hasMultiplePlurals: boolean().required().default(false),
					pluralsList: array().optional().of(string().required().min(1).test("onlyContainsMalayalam", "${path} contains invalid Malayalam code points", (value, context) => {
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
					})),
					hasIrregularPlural: boolean().required().default(false),
					hasPlural: boolean().optional().default(true),
					irregularPlural: string().transform((value, origValue) => {
							return value === "" ? undefined : value;
						}).optional().min(1).test("onlyContainsMalayalam", "${path} contains invalid Malayalam code points", (value, context) => {
							if (value === undefined)
							{
								return true; // An empty string is valid
							}

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
					})
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
			this.formValidationErrs = []; // Clear old errors

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
		},

		onPluralsListChanged(pluralsList)
		{
			console.log("NounForm.onPluralsListChanged: plurals list = %o", pluralsList);
			this.form.pluralsList = pluralsList;
		},

		onHasPluralChanged(hasPlural)
		{
			console.log("NounForm.onHasPluralChanged: hasPlural = %o", hasPlural);
			this.form.hasPlural = hasPlural;
		},

		onHasIrregularPluralChanged(hasIrregularPlural)
		{
			console.log("NounForm.onHasIrregularPluralChanged: hasIrregularPlural = %o", hasIrregularPlural);
			this.form.hasIrregularPlural = hasIrregularPlural;
		},

		onIrregularPluralChanged(irregularPlural)
		{
			console.log("NounForm.onIrregularPluralChanged: irregularPlural = %o", irregularPlural);
			this.form.irregularPlural = irregularPlural;
		},

		onPluralIsOptionalChanged(pluralIsOptional)
		{
			console.log("NounForm.onPluralIsOptional: pluralIsOptional = %o", pluralIsOptional);
			this.form.pluralIsOptional = pluralIsOptional;
		},

		onHasMultiplePluralsChanged(hasMultiplePlurals)
		{
			console.log("NounForm.onHasMultiplePluralsChanged: hasMultiplePlurals = %o", hasMultiplePlurals);
			this.form.hasMultiplePlurals = hasMultiplePlurals;
		},

		async onFormChanged()
		{
			const isValid = await this.formIsValid();
			this.$emit("validityChanged", isValid, this.form, this.formValidationResult, this.formValidationErrs);
		}
	}
};
</script>
