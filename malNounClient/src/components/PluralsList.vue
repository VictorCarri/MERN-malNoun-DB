<script setup lang="ts">
import { BRow, BCol, BButton, BFormInput } from "bootstrap-vue-next";
</script>

<template>
	<div>
		<b-row>
			<b-col>
				<h5>
					Please enter this noun&apos;s multiple plurals:
				</h5>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<ol>
					<li v-for="(plural, index) in enteredPlurals" @input="$emit('pluralsListChanged', enteredPlurals)">
						<b-row>
							<b-col>
								<b-form-input placeholder="Please enter a plural" :value="plural" v-model="enteredPlurals[index]" />
							</b-col>
							<b-col>
								<b-button variant="danger" @click.prevent="onDeletePlural(index)">
									Delete this plural
								</b-button>
							</b-col>
						</b-row>
					</li>
				</ol>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-button variant="success" @click.prevent="onAddPlural">
					Add a new plural form
				</b-button>
			</b-col>
		</b-row>
	</div>
</template>

<script lang="ts">
export default {
	name: "PluralsList",

	props: {
	},

	data()
	{
		return {
			enteredPlurals: []
		};
	},

	components: {
		BRow,
		BCol,
		BButton,
		BFormInput
	},

	emits: ["pluralsListChanged"],

	methods: {
		onAddPlural(e)
		{
			console.log("PluralsList.onAddPlural: Adding a plural to the plurals list");
			this.enteredPlurals.push("");
			this.$emit("pluralsListChanged", this.enteredPlurals);
		},

		onDeletePlural(index)
		{
			console.log("PluralsList.onDeletePlural: Deleting the plural @ index %d", index);
			this.enteredPlurals.splice(index, 1); // Remove the plural @ that index
			this.$emit("pluralsListChanged", this.enteredPlurals);
		}
	}
};
</script>
