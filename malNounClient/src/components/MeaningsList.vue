<script lang="ts">
import { BFormInput, BRow, BCol, BButton, BFormGroup } from "bootstrap-vue-next";
import { defineComponent } from "vue";

export default defineComponent({
	name: "MeaningsList",

	data() {
		console.log("MeaningsList.data(): initialMeanings = %o", this.initialMeanings);
		return {
			enteredMeanings: this.initialMeanings
		};
	},

	methods: {
		onAddMeaning(e : MouseEvent)
		{
			console.log("Adding a meaning to the meanings list");
			this.enteredMeanings.sort();
			this.enteredMeanings.push("");
			this.$emit("meaningsListChanged", this.enteredMeanings);
		},

		onDeleteMeaning(index : number)
		{
			console.log("MeaningList.onDeleteMeaning: deleting meaning @ index %d", index);
			this.enteredMeanings.splice(index, 1); // Remove the meaning at that index
			this.enteredMeanings.sort();
			this.$emit("meaningsListChanged", this.enteredMeanings);
		}
	},

	components: {
		BFormInput,
		BRow,
		BCol,
		BButton
	},

	emits: ["meaningsListChanged"],

	props: {
		initialMeanings: {
			type: Array as () => string[],
			required: false,
			default: () => []
		}
	}
});
</script>

<template>
	<hr />
	<b-row>
		<h4>
			Enter this noun&apos;s meanings
		</h4>
	</b-row>
	<b-row>
		<b-col>
			<ol @input="$emit('meaningsListChanged', enteredMeanings)">
				<li v-for="(meaning, index) in enteredMeanings">
					<b-row>
						<b-col>
							<b-form-input placeholder="Please enter a meaning" :value="meaning" v-model="enteredMeanings[index]" />
						</b-col>
						<b-col>
							<b-button variant="danger" @click.prevent="onDeleteMeaning(index)">
								Delete this meaning
							</b-button>
						</b-col>
					</b-row>
				</li>
			</ol>
		</b-col>
	</b-row>
	<b-row>
		<b-col>
			<b-button variant="success" @click="onAddMeaning">
				Add a new meaning
			</b-button>
		</b-col>
	</b-row>
	<hr />
</template>
