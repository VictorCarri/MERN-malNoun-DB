<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <main>
	<h1>Welcome</h1>
	<RouterLink to="/login">
		<button>
			Login
		</button>
	</RouterLink>
  </main>
</template>
