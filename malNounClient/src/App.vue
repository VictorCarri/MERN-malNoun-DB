<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { BLink } from "bootstrap-vue-next";
</script>

<template>
	<!-- <RouterLink to="/">Home</RouterLink>
	<RouterLink to="/login">Login</RouterLink> -->
	<BLink to="/">
		Home
	</BLink>
	<BLink to="/login">
		Login
	</BLink>
	<RouterView />
</template>

<script lang="ts">
export default {
	name: "App",
	components: {
	},
	data() {
		return {
			input: {
				username: "",
				password: ""
			}
		};
	}
}
</script>
