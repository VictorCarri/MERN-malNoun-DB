<script setup lang="ts">
import { BRow, BCol, BContainer } from "bootstrap-vue-next";
import { useNounStore } from "../stores/NounStore";
</script>

<template>
	<div v-if="loading">
		Loading declension data...
	</div>
	<div v-else>
		<b-container fluid>
			<b-row>
				<b-col>
				</b-col>
				<b-col>
					Declension of {{ declensionData.singular.nominative }}
				</b-col>
				<b-col>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
				</b-col>
				<b-col>
					<h4>
						Singular
					</h4>
				</b-col>
				<b-col>
					<h4>
						Plural
					</h4>
				</b-col>
			</b-row>
			<div v-if="declensionData.singular.type === 'fv'"> <!-- Front-vowel stem declension -->
				<b-row>
					<b-col>
						Nominative
					</b-col>
					<b-col>
						{{ declensionData.singular.nominative }}
					</b-col>
					<b-col>
						{{ declensionData.singular.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural }}</span>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						Accusative
					</b-col>
					<b-col>
						{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.accusative}}</span>
					</b-col>
				</b-row>
			</div>
		</b-container>
	</div>
</template>

<script lang="ts">
export default {
	name: "DeclensionView",
	data() {
		return {
			nounData: useNounStore(),
			declensionData: null,
			loading: true
		};
	},
	methods: {
	},

	async mounted()
	{
		console.log("Store object: %o\n\tNoun store getter: %o\n\nRoute object: %o", this.nounData, this.nounData.getNounAPIURL, this.$route);

		try
		{
			const fetchRes = await fetch(this.nounData.getNounAPIURL + "/nouns/" + this.$route.params.id + "/declensions"); // Get all declensions of this noun
			const declensionInfo = await fetchRes.json();
			console.log("mounted: declension info: %o", declensionInfo);
			this.declensionData = declensionInfo;
			this.loading = false;
		}

		catch (e)
		{
			console.log("DeclensionView: mounted: fetch error: %o", e);
		}
	}
};
</script>
