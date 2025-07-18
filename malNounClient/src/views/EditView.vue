<script setup lang="ts">
import { useNounStore } from "../stores/NounStore";
import NounForm from "../components/NounForm.vue";
</script>

<template>
	<noun-form v-if="showForm" :meanings-list-changed-handler="onMeaningsListChanged" @noun-form-submitted="onEditNoun" @noun-form-reset="onReset" :initial-form="form" submit-button-text="Update this noun" />
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
			}
		};
	},

	methods: {
		onMeaningsListChanged(meaningsList)
		{
			console.log("New meanings list: $o", meaningsList);
		},

		onEditNoun(formData)
		{
			console.log("onEditNoun: form data = %o", formData);
		},

		resetForm()
		{
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
