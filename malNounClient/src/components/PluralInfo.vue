<script setup lang="ts">
import { BRow, BFormGroup, BFormCheckbox, BFormInput } from "bootstrap-vue-next";
import PluralsList from "./PluralsList.vue";
</script>

<template>
	<hr />
	<b-row>
		<h4>
			Enter information about this noun's plurality:
		</h4>
	</b-row>
	<b-row>
		<b-form-group
			id="hasPluralInpGroup"
			label="Please indicate whether or not this noun has a plural"
			label-for="hasPluralInp"
			description="Indicates whether or not this noun has a plural"
		>
			<b-form-checkbox
				id="hasPluralInp"
				v-model="nounHasPlural"
				name="hasPluralInp"
				@change="$emit('hasPluralChanged', nounHasPlural)">
				Set whether or not this noun has a plural
			</b-form-checkbox>
		</b-form-group>
	</b-row>
	<div v-show="nounHasPlural">
		<b-row>
			<b-form-group
				id="hasIrregularPluralInpGroup"
				label="Please indicate whether or not this noun has an irregular plural"
				label-for="hasIrregularPluralInp"
				description="Indicates whether or not this noun has an irregular plural">
				<b-form-checkbox
					id="nounHasIrregularPluralInp"
					v-model="nounHasIrregularPlural"
					name="nounHasIrregularPluralInp"
					@change="$emit('hasIrregularPluralChanged', nounHasIrregularPlural)"
				>
					Set whether or not this noun has an irregular plural
				</b-form-checkbox>
			</b-form-group>
			<b-form-group
				id="irregularPluralInpGroup"
				label="Please enter the noun's irregular plural"
				label-for="irregularPluralInp"
				description="The noun's irregular plural"
				v-show="nounHasIrregularPlural">
				<b-form-input
					placeholder="Enter this noun's irregular plural:"
					v-model="irregularPlural"
					@input="$emit('irregularPluralChanged', irregularPlural)" />
			</b-form-group>
		</b-row>
		<b-row>
			<b-form-group
				id="pluralIsOptionalInpGroup"
				label="Please indicate whether or not this noun's plural is optional"
				label-for="pluralIsOptionalInp"
				description="Indicates whether or not this noun's plural is optional."
			>
				<b-form-checkbox
					id="pluralIsOptionalInp"
					v-model="pluralIsOptional"
					name="pluralIsOptionalInp"
					@change="$emit('pluralIsOptionalChanged', pluralIsOptional)"
				>
					Set whether or not this noun&#39;s plural is optional
				</b-form-checkbox>
			</b-form-group>
		</b-row>
		<b-row>
			<b-form-group
				id="hasMultiplePlurals"
				label="Please indicate whether or not this noun has multiple plurals"
				label-for="hasMultiplePluralsInp"
				description="Indicates whether or not this noun has multiple plurals"
			>
				<b-form-checkbox
					id="hasMultiplePLuralsInp"
					v-model="nounHasMultiplePlurals"
					name="hasMultiplePluralsInp"
					@change="$emit('hasMultiplePluralsChanged', nounHasMultiplePlurals)">
					Set whether or not this noun has multiple plurals
				</b-form-checkbox>
			</b-form-group>
		</b-row>
	</div>
	<plurals-list v-show="nounHasMultiplePlurals" @plurals-list-changed="onPluralsListChanged" />
	<hr />
</template>

<script lang="ts">
export default {
	name: "PluralInfo",

	props: {
		isOptional: {
			type: Boolean,
			required: false,
			default: false
		},

		hasPlural: {
			type: Boolean,
			required: false,
			default: true
		},

		hasMultiplePlurals: {
			type: Boolean,
			required: false,
			default: true
		},

		hasIrregularPlural: {
			type: Boolean,
			required: false,
			default: false
		}
	},

	data()
	{
		return {
			pluralIsOptional: this.isOptional,
			nounHasPlural: this.hasPlural,
			nounHasMultiplePlurals: this.hasMultiplePlurals,
			irregularPlural: "",
			nounHasIrregularPlural: this.hasIrregularPlural
		};
	},
	
	components: {
		BRow,
		BFormGroup,
		BFormCheckbox
	},

	emits: ["pluralsListChanged", "hasPluralChanged", "hasIrregularPluralChanged", "irregularPluralChanged", "pluralIsOptionalChanged", "hasMultiplePluralsChanged"],

	methods: {
		onPluralsListChanged(pluralsList)
		{
			console.log("PluralInfo: plurals list changed to %o", pluralsList);
			this.$emit("pluralsListChanged", pluralsList);
		}
	}
};
</script>
