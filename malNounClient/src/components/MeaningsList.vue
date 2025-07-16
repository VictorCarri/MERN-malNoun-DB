<script lang="ts">
import { BFormInput, BRow, BCol, BButton, BFormGroup } from "bootstrap-vue-next";

export default {
	name: "MeaningsList",
	data() {
		return {
			enteredMeanings: []
		};
	},

	methods: {
		onAddMeaning(e)
		{
			console.log("Adding a meaning to the meanings list");
			this.enteredMeanings.push("");
			this.$emit("meaningsListChanged", this.enteredMeanings);
		}
	},

	components: {
		BFormInput,
		BRow,
		BCol,
		BButton
	},

	emits: ["meaningsListChanged"]
};
</script>

<template>
	<b-row>
		<h4>
			Enter this noun&apos;s meanings
		</h4>
	</b-row>
	<b-row>
		<ol @input="$emit('meaningsListChanged', enteredMeanings)">
			<li v-for="(meaning, index) in enteredMeanings">
				<b-form-input placeholder="Please enter a meaning" :value="meaning" v-model="enteredMeanings[index]" />
			</li>
		</ol>
	</b-row>
	<b-row>
		<b-col>
			<b-button variant="success" @click="onAddMeaning">
				Add a new meaning
			</b-button>
		</b-col>
	</b-row>
</template>
