<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";
import { BLink } from "bootstrap-vue-next";
</script>

<template>
	<div v-if="userData.isLoggedIn">
		<h1>Add a new noun to the database</h1>
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
			userData: useUserStore()
		};
	},
	methods: {
	}
};
</script>
