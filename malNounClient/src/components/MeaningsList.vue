<script lang="ts">
import { BFormInput, BRow, BCol, BButton } from "bootstrap-vue-next";

export default {
	data() {
		return {
			enteredMeanings: []
		};
	},
	methods: {
	}
};
</script>

<template>
	<BRow v-for="meanings in enteredMeanings">
		<BFormInput placeholder="Please enter a meaning" />
	</BRow>
	<BRow>
		<BCol>
			<BButton variant="danger">
				Add a new meaning
			</BButton>
		</BCol>
	</BRow>
</template>
