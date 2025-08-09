<script setup lang="ts">
import { BRow, BCol, BContainer, BLink, BAlert } from "bootstrap-vue-next";
import { useNounStore } from "../stores/NounStore";

</script>

<template>
	<div v-if="loading">
		Loading declension data...
		<b-alert v-if="showErrorAlert">
			{{ errorText }}
		</b-alert>
	</div>
	<div v-else>
		<b-container fluid>
			<b-row>
				<b-col>
				</b-col>
				<b-col>
					<h3>
						Declension of {{ declensionData.singular.nominative }} &#40;{{ declensionData.nounInfo.gender.charAt(0).toUpperCase() }}&#41;
					</h3>
				</b-col>
				<b-col>
				</b-col>
			</b-row>
			<div v-if="declensionData">
				<div v-if="!Array.isArray(declensionData.plural)"> <!-- Only 1 plural -->
					<b-row>
						<b-col>
						</b-col>
						<b-col>
							<h4>
								Singular
							</h4>
						</b-col>
						<b-col v-if="declensionData.plural !== null"> <!-- Only show the plural heading if the noun has a plural -->
							<h4>
								Plural
							</h4>
						</b-col>
					</b-row>
					<div v-if="declensionData.singular.type === 'fv'"> <!-- Front-vowel stem declension -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">
									{{ declensionData.plural.suffixes.plural.nominative }}
								</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.accusative}}</span>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Dative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.dative }}<span class="caseSuffix">{{ declensionData.singular.suffixes.dative }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.nominative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === 'a'"> <!-- A-stem stem declension -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">
									{{ declensionData.plural.suffixes.plural.nominative }}
								</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.accusative}}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.singular.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Dative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.dative }}<span class="caseSuffix">{{ declensionData.singular.suffixes.dative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.nominative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D1F\u0D4D'"> <!-- Duh-stem -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">
									{{ declensionData.plural.suffixes.plural.nominative }}
								</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.accusative}}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.genitive }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								Dative
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.other}}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.nominative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D4D'"> <!-- Schwa-stem -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">
									{{ declensionData.plural.suffixes.plural.nominative }}
								</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.accusative}}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.genitive }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								Dative
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.other}}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.nominative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col>
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D02'"> <!-- -am stem -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{declensionData.plural.suffixes.plural.nominative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.accusative }}</span> or {{declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}{{ declensionData.singular.increments.optional }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.accusative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}{{ declensionData.singular.increments.optional }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Dative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}{{ declensionData.singular.increments.optional }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}{{ declensionData.singular.increments.optional }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.dative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.locative[0] }}</span> or {{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.locative[1] }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}{{ declensionData.singular.increments.optional }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}{{ declensionData.singular.increments.optional }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.obligatory }}{{ declensionData.singular.increments.optional }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D7C'"> <!-- -ar stem -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{declensionData.plural.suffixes.plural.nominative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.other }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.accusative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.genitive }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Dative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.other }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.other }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.dative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.other }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.other }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.other }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D7D'"> <!-- Chillu dental l stem -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{declensionData.plural.suffixes.plural.nominative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.accusative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.genitive }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Dative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.dative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D7B'"> <!-- Chillu alveolar n stem -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{declensionData.plural.suffixes.plural.nominative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.accusative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.genitive }}<span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Dative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.dative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D7A'"> <!-- Chillu retroflex n stem -->
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{declensionData.plural.suffixes.plural.nominative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.accusative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.genitive }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Dative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.dative }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.nonNominative }}<span class="increment">{{ declensionData.singular.increments.nonLocative }}</span><span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-if="declensionData.plural !== null">
								{{ declensionData.plural.stems.nominative }}<span class="pluralSuffix">{{ declensionData.plural.suffixes.plural.other }}</span><span class="caseSuffix">{{ declensionData.plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else> <!-- Unknown declension -->
						Unknown declension type {{ declensionData.singular.type }} of a noun with 1 plural
					</div>
				</div>
				<div v-else> <!-- Multiple plurals -->
					<div v-if="declensionData.singular.type === 'fv'">
						<b-row>
							<b-col>
							</b-col>
							<b-col>
								<h4>
									Singular
								</h4>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural"> <!-- Only show the plural heading if the noun has a plural -->
								<h4>
									Plural #{{ index+1 }}
								</h4>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.nominative }}<span class="pluralSuffix">
									{{ plural.suffixes.plural.pluralSuffix.nominative }}
								</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Accusative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.accusative}}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.nominative }}<span class="pluralSuffix">{{ plural.suffixes.plural.pluralSuffix.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Genitive</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.nominative }}<span class="pluralSuffix">{{ plural.suffixes.plural.pluralSuffix.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Dative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.dative }}<span class="caseSuffix">{{ declensionData.singular.suffixes.dative }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ declensionData.singular.nominative }}<span class="pluralSuffix">{{ plural.suffixes.plural.pluralSuffix.dative }}</span><span class="caseSuffix">{{ plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Locative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.nominative }}<span class="pluralSuffix">{{ plural.suffixes.plural.pluralSuffix.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Adessive &#40;dialectical&#41;</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.nominative }}<span class="pluralSuffix">{{ plural.suffixes.plural.pluralSuffix.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Sociative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.nominative }}<span class="pluralSuffix">{{ plural.suffixes.plural.pluralSuffix.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Instrumental</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.nominative }}<span class="pluralSuffix">{{ plural.suffixes.plural.pluralSuffix.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="declensionData.singular.type === '-\u0D7B'"> <!-- -an stem -->
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
									Epicene plural
								</h4>
							</b-col>
							<b-col>
								<h4>
									All-same-gender plural
								</h4>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>Nominative</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.nominative }}
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.nominative }}
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Accusative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.accusative }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.other }}<span class="pluralSuffix">{{ plural.suffixes.plurals.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.accusative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Genitive
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.genitive }}<span class="caseSuffix">{{ declensionData.singular.suffixes.genitive }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.other }}<span class="pluralSuffix">{{ plural.suffixes.plurals.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.genitive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Dative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.dative[0] }}</span> or {{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.dative[1] }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.other }}<span class="pluralSuffix">{{ plural.suffixes.plurals.dative }}</span><span class="caseSuffix">{{ plural.suffixes.cases.dative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Locative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.locative }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.other }}<span class="pluralSuffix">{{ plural.suffixes.plurals.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.locative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Adessive &#40;dialectical&#41;
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.adessive }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.other }}<span class="pluralSuffix">{{ plural.suffixes.plurals.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.adessive }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Sociative
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.sociative }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.other }}<span class="pluralSuffix">{{ plural.suffixes.plurals.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.sociative }}</span>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h5>
									Instrumental
								</h5>
							</b-col>
							<b-col>
								{{ declensionData.singular.stems.other }}<span class="caseSuffix">{{ declensionData.singular.suffixes.instrumental }}</span>
							</b-col>
							<b-col v-for="(plural, index) in declensionData.plural">
								{{ plural.stems.other }}<span class="pluralSuffix">{{ plural.suffixes.plurals.other }}</span><span class="caseSuffix">{{ plural.suffixes.cases.instrumental }}</span>
							</b-col>
						</b-row>
					</div>
					<div v-else>
						Unknown singular declension type {{ declensionData.singular.type }} of noun with multiple plurals
					</div>
				</div>
				<b-row>
					<h2>
						Meanings
					</h2>
					<ol>
						<li v-for="meaning in declensionData.nounInfo.meanings">
							{{ meaning }}
						</li>
					</ol>
				</b-row>
			</div>
			<b-row>
				<b-link to="/">
					Return home
				</b-link>
			</b-row>
		</b-container>
	</div>
</template>

<script lang="ts">
export default {
	name: "DeclensionView",
	data() {
		return {
			nounData: useNounStore(),
			declensionData: null as any,
			loading: true,
			showErrorAlert: false,
			errorText: ""
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
			console.log("Fetch result: %o", fetchRes);
			const declensionInfo = await fetchRes.json();
			console.log("Declension info: %o", declensionInfo);

			if (declensionInfo.hasOwnProperty("singular") || declensionInfo.hasOwnProperty("plural")) // We successfully fetched the declensions
			{
				console.log("mounted: declension info: %o", declensionInfo);
				window.declensionInfo = declensionInfo;
				this.declensionData = declensionInfo;
				this.loading = false;
			}

			else // There was an error
			{
				this.showErrorAlert = true;
				this.errorText = declensionInfo.error;
			}
		}

		catch (e)
		{
			console.log("DeclensionView: mounted: fetch error: %o", e);
		}
	}
};
</script>
