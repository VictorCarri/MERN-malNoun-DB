const Noun = require("../models/noun"); // Noun model

/* Get all nouns */
module.exports.GetAll = (req, res, next) => {
	// Return all nouns as a JSON array
	Noun.find({}) // Get all nouns
	.then(data => 
		res.json(
			data.sort(
				(a, b) => {
					if (a.createdAt == b.createdAt)
					{
						return a.updatedAt - b.updatedAt;
					}

					else
					{
						return a.createdAt - b.createdAt;
					}
				}
			)
		)
	) // Convert the data to JSON
	.catch(next) // Handle errors
	.finally(next);
};

/* Create a new noun entry in the DB */
module.exports.CreateNoun = (req, res, next) => {
	console.log("CreateNoun: request data = %o", req.body);
	req.body.meanings.sort(); // Sort the noun's meanings
/*	if (req.body.singular)
	{*/
		Noun.create(req.body) // Create a new noun
		.then(data => {
			res.status(200).json({
				"success": true,
				"createdNoun": data
			});
		}
		) // Convert the data to JSON
		.catch(next); // Handle errors
	/*}

	else // Error
	{
		res.json(
			{
				error: "The singular field is empty"
			}
		);
	}*/
};

/* Delete a noun from the DB */
module.exports.DeleteNoun = (req, res, next) => {
	console.log("DeleteNoun: ID of noun to delete = %o", req.params.id);
	Noun.findOneAndDelete(
		{
			"_id": req.params.id // ID of the noun to delete
		}
	)
	.then(data => res.status(200).json(
		{
			"success": true,
			"deletionData": data
		}
	))
	.catch(next)
	.finally(next);
	//return res.status(200);
};

/* Update a noun in the DB */
module.exports.UpdateNoun = (req, res, next) => {
	console.log("UpdateNoun\n\tNoun ID: %o\n\tReq body: %o\nSingular = %o\n\tCodepoints in singular: %o", req.params.id, req.body, req.body.singular, [...req.body.singular].map(char => char.charAt(0)));
	let bodyWithDate = JSON.parse(JSON.stringify(req.body));
	bodyWithDate["updatedAt"] = new Date();
	console.log("\n\tBody with date = %o",  bodyWithDate);
	Noun.findByIdAndUpdate(
		req.params.id,
		bodyWithDate,
		{
			new: true,
			runValidators: true
		}
	)
	.then(updatedNoun => {
			console.log("PATCH\n\tUpdated noun = %o", updatedNoun);
	
			if (!updatedNoun)
			{
				console.log("PATCH\n\tNoun not found");
				/*return*/res.status(404).json(
					{
						error: "Noun not found"
					}
				);
			}

			else // Send the updated document back as the response
			{
				/*return*/ res.status(200)
				.json(
					{
						"success": true,
						"updatedNoun": updatedNoun
					}
				);
			}
		}
	)
	.catch(next)
	.finally(next);
};

function addKalToNeuterNoun(singularForm)
{
	const endsInAm = /^(.*)\u0D02$/u; // A noun ending in -am
	const endsInShortUOrLongVowel = /^(.*)[\u0D41|\u0D3E|\u0D40|\u0D42|\u0D47|\u0D48|\u0D48|\u0D4C]$/u; // A noun ending in a short -u or any long vowel
	const endsInSchwa = /^(.*)\u0D4D$/u; // A noun ending in a schwa
	const singularCodePoints = Array.from(singularForm);
	
	console.log("addKalToNeuterNoun: endsInSchwa.test(%s): %o\n\tCode points: %o", singularForm, endsInSchwa.test(singularForm), singularCodePoints);

	if (endsInAm.test(singularForm)) // Handled in declinePlural
	{
		return {
			pluralStem: singularForm.replace(endsInAm, "$1"),
			pluralSuffix: {
				nominative: "\u0D19\u0D4D\u0D19\u0D7E", // Replace -am with -angngaL
				dative: "\u0D19\u0D4D\u0D19\u0D7E", // Uses a chillu, like the nominative
				other: "\u0D19\u0D4D\u0D19\u0D33" // -angngaL, but with a non-chillu
			}
		};
	}

	else if (endsInShortUOrLongVowel.test(singularForm)) // Handled in declinePlural
	{
		return {
			pluralStem: singularForm,
			pluralSuffix: {
				nominative: "\u0D15\u0D4D\u0D15\u0D7E", // Add -kkaL
				dative: "\u0D15\u0D4D\u0D15\u0D7E", // Uses a chillu, like the nominative
				other: "\u0D15\u0D4D\u0D15\u0D33" // -kkaL, but with a non-chillu
			}
		};
	}

	else if (endsInSchwa.test(singularForm)) // Handled in declinePlural
	{
		return {
			pluralStem: singularForm.replace(endsInSchwa, "$1\u0D41"), // Replace the schwa with an -u
			pluralSuffix: {
				nominative: "\u0D15\u0D7E", // -kaL
				dative: "\u0D15\u0D7E", // Uses a chillu, like the nominative
				other: "\u0D15\u0D33" // kaL (non-chillu)
			}
		};
	}

	else // Default (handled in declinePlural)
	{
		return {
			pluralStem: singularForm,
			pluralSuffix: {
				nominative: "\u0D15\u0D7E", // Add -kaL
				dative: "\u0D15\u0D7E", // Uses a chillu, like the nominative
				other: "\u0D15\u0D33" // kaL (non-chillu)
			}
		};
	}	
}

function getMaarSuffix() // Handled in declinePlural
{
	return {
		pluralSuffix: {
			nominative: "\u0D2E\u0D3E\u0D7C", // maar
			dative: "\u0D2E\u0D3E\u0D7C", // maar (chillu)
			other: "\u0D2E\u0D3E\u0D30" // maar (non-chillu)
		}
	};
}

function getKalSuffix() // Handled in declinePlural
{
	return {
		pluralSuffix:  {
			nominative: "\u0D15\u0D7E", // kaL (with chillu)
			dative: "\u0D15\u0D7E", // Same as the nominative
			other: "\u0D15\u0D33" // kaL (non-chillu)
		}
	};
}

const endsInAnReg = /^(.*)\u0D7B$/u;
const endsInIReg = /^(.*)\u0D3F$/u
const endsInKaaranReg = /^(.*)\u0D15\u0D3E\u0D30\u0D7B/u;
const endsInKaariReg = /^(.*)\u0D15\u0D3E\u0D30\u0D3F$/u; // Any noun that ends in -kaari

/*
* Checks a feminine noun to see whether there is a masculine counterpart.
*/
async function hasMasculineCounterpart(noun)
{
	if (endsInIReg.test(noun.singular) && !endsInKaariReg.test(noun.singular)) // Ends in -i, but not -kaari
	{
		const nounStem = noun.singular.replace(endsInIReg, "$1"); // Get the noun's stem by removing the -i
		const femCounterpart = nounStem + "\u0D7A"; // Add a chillu alveolar nasal to form its masculine counterpart
		
		try
		{
			const counterpartNoun = await Noun.find({singular: femCounterpart}); // Try to find its feminine counterpart in the database
			console.log("hasMasculineCounterpart: find result = %o", counterpartNoun);
			return counterpartNoun.length === 1; // There should be only 1 found document
		}

		catch (e)
		{
			return false;
		}
	}

	else
	{
		return false;
	}
}

async function getPlural(noun)
{
	const endsInSchwa = /^(.*[\u0D15-\u0D3A])\u0D4D$/u; // A noun that ends in a consonant followed by a schwa
	const endsInLongAOrSyllabicRReg = /^.*[\u0D3E|\u0D43]$/u;
	const endsInAReg = /^.*[\u0D15-\u0D3A]$/u; // Any noun that ends in a consonant without a matra
	const endsInAn = /^.*\u0D7B$/u;	 // A noun that ends in a chillu alveolar nasal

	if (noun.human) // The noun refers to a human entity
	{
		console.log("getPlural: The noun %o refers to a human entity", noun);

		if (noun.pluralOptional) // The noun has an optional plural (handled in declinePlural)
		{
			return {
				optional: true,
				plural: noun.plural
			};
		}

		else if (!noun.hasPlural) // The noun has no plural (handled in declinePlural)
		{
			return {
				hasPlural: false
			};
		}

		else if (noun.denotesYoungChild) // These all add variants of -kaL
		{
			if (endsInSchwa.test(noun.singular)) // Handled in declinePlural
			{
				return {
					pluralStem: noun.singular.replace(endsInSchwa, "$1"), // The plural stem is the stem without the schwa
					pluralSuffix: {
						nominative: "\u0D41\u0D19\u0D4D\u0D19\u0D7E", // - ungngaL
						dative: "\u0D41\u0D19\u0D4D\u0D19\u0D7E", // - ungngaL
						other: "\u0D41\U0D19\u0D4D\u0D19\u0D33" // ungngaL, but with a non-chillu
					}
				};
			}

			else // Append -kaL (handled in declinePlural)
			{
				return {
					pluralSuffix: {
						nominative: "\u0D15\u0D7E", // kaL
						dative: "\u0D15\u0D7E", // Same as the nominative
						other: "\u0D15\u0D33" // kaL, but with a non-chillu
					}
				};
			}
		}

		else // Generate this [+HUM] noun's plural
		{
			console.log("getPlural: generating the plural of [+HUM] noun %o", noun);

			if (noun.gender == "masculine")
			{
				console.log("getPlural: generating the plural of masculine noun %o", noun);

				if (endsInLongAOrSyllabicRReg.test(noun.singular)) // Handled in declinePlural
				{
					console.log("getPlural: generating the plural of a noun that ends in long a or a syllabic r");
					return {
						pluralSuffix: {
							nominative: "\u0D15\u0D4D\u0D15\u0D7E", // -kkaL
							dative: "\u0D15\u0D4D\u0D15\u0D7E", // -kkaL
							other: "\u0D15\u0D4D\u0D15\u0D33" // -kkaL, but with a non-chillu
						}
					};
				}

				else if (endsInKaaranReg.test(noun.singular)) // 2 possible plurals (handled in declinePlural)
				{
					console.log("getPlural: generating the plural of a noun that ends in -kaaran");
					return {
						epicenePlural: {
							suffix: {
								nominative: "\u0D2E\u0D3E\u0D7C", // Replace -kaaran with -kaar
								dative: "\u0D2E\u0D3E\u0D7C", // Same as the nominative
								other: "\u0D2E\u0D3E\u0D30" // -kaar, but with a non-chillu
							},
							stem: noun.singular.replace(endsInKaaranReg, "$1") // Remove the -kaaran
						},
						allSameGenderPlural: {
							suffix: {
								nominative: "\u0D2E\u0D3E\u0D7C", // Add -maar for the all-masc plural
								dative: "\u0D2E\u0D3E\u0D7C", // Same as the nominative
								other: "\u0D2E\u0D3E\u0D30" // -maar, but with a non-chillu
							},
							stem: noun.singular // Same stem as the singular nominative for the all-masc plural
						}
					};
				}

				else if (!endsInKaaranReg.test(noun.singular) && endsInAnReg.test(noun.singular)) // This is a noun that ends in -an or -i, but not -kaaran or -kaari (handled in declinePlural)
				{
					console.log("getPlural: generating the plural of a noun that ends in -an");

					return {
						epicenePlural: {
							suffix: {
								nominative:"\u0D7C", // Replace the final vowel with -ar (chillu)
								dative:"\u0D7C", // Same as the nominative
								other: "\u0D30" // -ar, but non-chillu
							},
							stem: noun.singular.replace(endsInAnReg, "$1") // The stem is the noun with its final -an removed
						},
						allSameGenderPlural: {
							suffix: {
								nominative: "\u0D2E\u0D3E\u0D7C", // Add -maar (chillu) for the all-masc plural
								dative: "\u0D2E\u0D3E\u0D7C", // Same as the nominative
								other: "\u0D2E\u0D3E\u0D30" // -maar, but with a non-chillu
							},
							stem: noun.singular // Same stem as the nominative for the all-masc plural
						}
					};
				}

				else if (endsInSchwa.test(noun.singular)) // A masculine noun that ends in a schwa
				{
					console.log("getPlural: generating the plural of a masculine noun that ends in a schwa");
					return {
						pluralStem: noun.singular.replace(endsInSchwa, "$1\u0D41"), // Replace the schwa with a short -u
						pluralSuffix: {
							nominative: "\u0D15\u0D7E", // kaL
							dative: "\u0D15\u0D7E", // Same as the nominative
							other: "\u0D15\u0D33" // kaL, but with a non-chillu
						}
					};
				}

				else // i-stem masculine (handled in declinePlural)
				{
					let toReturn = getMaarSuffix();
					console.log("getPlural: returning -maar %o plural of a masculine noun", toReturn);
					return toReturn;
				}
			}

			else if (noun.gender == "feminine")
			{
				console.log("getPlural: generating the plural of feminine [+HUM] noun %o\nendsInKaariReg.test(%s) = %o\nendsInIReg.test(%s) = %o", noun, noun.singular, endsInKaariReg.test(noun.singular), noun.singular, endsInIReg.test(noun.singular));

				if (endsInAReg.test(noun.singular)) // This is a feminine noun that ends in /a/ (handled in declinePlural)
				{
					return getMaarSuffix();
				}

				else if (endsInKaariReg.test(noun.singular)) // 2 plurals - epicene & all-fem (handled in declinePlural)
				{
					console.log("getPlural: generating the plural of feminine [+HUM] noun %o that ends in -kaari", noun);

					return {
						epicenePlural: {
							suffix: {
								nominative: "\u0D15\u0D3E\u0D7C", // Replace -kaari with -kaar (chillu)
								dative: "\u0D15\u0D3E\u0D7C", // Same as the nominative
								other: "\u0D15\u0D3E\u0D30" // -kaar (non-chillu)
							},
							stem: noun.singular.replace(endsInKaariReg, "$1") // Remove the -kaari to get the noun's plural stem
						},
						allSameGenderPlural: {
							suffix: {
								nominative: "\u0D2E\u0D3E\u0D7C", // Add -maar (chillu) for the all-fem plural
								dative: "\u0D2E\u0D3E\u0D7C", // Same as the nominative
								other: "\u0D2E\u0D3E\u0D30" // -maar (non-chillu)
							},
							stem: noun.singular // The noun's stem for the all-fem. plural is the same as its nominative singular
						}
					};
				}

				else if (endsInIReg.test(noun.singular)) // A feminine noun that ends in /i/
				{
					console.log("getPlural: generating the plural of feminine [+HUM] noun %o that ends in -i", noun);

					if (await hasMasculineCounterpart(noun)) // Handled in declinePlural
					{
						console.log("getPlural: the noun %o has a masculine counterpart", noun);

						return {
							pluralSuffixes: [ // 2 suffixes in free variation
								getMaarSuffix(),
								getKalSuffix()
							],
							epicenePlural: { // AND an epicene plural
								suffix: {
									nominative: "\u0D2E\u0D3E\u0D7C", // Add -maar (chillu)
									dative: "\u0D2E\u0D3E\u0D7C", // Same as the nominative
									other: "\u0D2E\u0D3E\u0D30" // -maar (non-chillu)
								},
								stem: noun.singular.replace(endsInIReg, "$1") // The stem is the noun's singular with the -i removed
							}
						};
					}

					else // No masculine counterpart (handled in declinePlural)
					{
						console.log("getPlural: no masculine counterpart");

						return {
							pluralSuffixes: [ // 2 possibilities in free variation
								getMaarSuffix(),
								getKalSuffix()
							]
						};
					}
				}

				else if (endsInLongAOrSyllabicRReg.test(noun.singular)) // Handled in declinePlural
				{
					return {
						pluralSuffix: {
							nominative: "\u0D15\u0D4D\u0D15\u0D7E", // kkaL
							dative: "\u0D15\u0D4D\u0D15\u0D7E", // kkaL
							other: "\u0D15\u0D4D\u0D15\u0D33" // kkaL (non-chillu)
						}
					};
				}
	
				else if (endsInSchwa.test(noun.singular))
				{
					console.log("getPlural: feminine +HUM noun that ends in a schwa");
					return {
						pluralSuffix: {
							nominative: "\u0D15\u0D4D\u0D15\u0D7E", // kkaL
							dative: "\u0D15\u0D4D\u0D15\u0D7E", // kkaL
							other: "\u0D15\u0D4D\u0D15\u0D33" // kkaL (non-chillu)
						},
						pluralStem: noun.singular.replace(endsInSchwa, "$1\u0D41") // Replace the schwa with a short -u
					};
				}

				else // All other feminine nouns (handled in declinePlural)
				{
					return getKalSuffix();
				}
			} // feminine
		}
	}

	else if (!noun.human && noun.animate) // The noun is [-HUM], but [+ANIM]
	{

		if (endsInAn.test(noun.singular)) // A few nouns that are [-HUM] but end in -an (Handled in declinePlural)
		{
			return getMaarSuffix();
		}

		else // -kaL and variants (handled in declinePlural)
		{
			return addKalToNeuterNoun(noun.singular);
		}
	}

	else // Neither [+HUM] nor [+ANIM]
	{
		if (noun.hasPlural) // Handled in declinePlural
		{
			console.log("GetPlural: the noun is neither human nor animate.");
			return addKalToNeuterNoun(noun.singular);
		}

		else // No plural (handled in declinePlural)
		{
			return {
				hasPlural: false
			};
		}
	}
}

module.exports.GetPlural = async (req, res, next) => {
	try
	{
		const noun = await Noun.findOne({ _id: req.params.id});
		console.log("GetPlural: pluralizing %o", noun);
		res.status(200).json(
			await getPlural(noun)
		);
		
	}

	catch (e)
	{
		console.log(e);
		res.status(404).json(
			{
				success: false,
				error: "Couldn't find noun"
			}
		);
	}

	finally
	{
		next();
	}
};

function declineSingularFrontVowelStem(noun)
{
	return {
		type: "fv", // "f"ront "v"owel
		nominative: noun.singular,
		stems: {
			dative: noun.singular, // Front-vowel stems use the same stem as the nominative in the dative
			other: noun.singular + "\u0D2F", // Add a /j/ because all other case endings begin with vowels, and Malayalam inserts a consonant to break the hiatus
		},
		suffixes: {
			accusative: "\u0D46", // െ
			genitive: "\u0D41\u0D1F\u0D46", // ുടെ
			dative: "\u0D15\u0D4D\u0D15\u0D4D", // ക്ക്
			locative: "\u0D3F\u0D7D", // ിൽ
			sociative: "\u0D4B\u0D1F\u0D4D", // ോട്
			instrumental: "\u0D3E\u0D7D", // ാൽ
			adessive: "\u0D47\u0D7D" // േൽ
		}
	};
}

function declineSingularBackVowelStem(noun)
{
	return {
		type: "bv", // "B"ack "v"owel
		nominative: noun.singular,
		stems: {
			nonNominative: noun.singular + "\u0D35", // Add a വ
			other: noun.singular
		},
		increments: {
			nonNominative:"\u0D3F\u0D28" // -ിന്
		},
		suffixes: {
			accusative: "\u0D46", // െ
			genitive: "\u0D31\u0D4D\u0D31\u0D46", // റ്റെ
			dative: [
				"\u0D4D\u0D28\u0D4D", // ന്
				"\u0D4D" // ്
			],
			locative: "\u0D3F\u0D7D", // ിൽ
			sociative: "\u0D4B\u0D1F\u0D4D", // ോട്
			instrumental: "\u0D3E\u0D7D", // ാൽ
			adessive: "\u0D47\u0D7D" // േൽ
		}
	};
}

const isSchwaStem = /^(.*[\u0D15-\u0D3A])\u0D4D$/u;

function declineSingularSchwaStem(noun)
{
	console.log("declineSingularSchwaStem called");
	return {
		type: "-\u0D4D", // Schwa
		nominative: noun.singular,
		increments: {
			genitive: "\u0D3F\u0D7B", // The genitive singular increment needs a chillu
			nonLocative: "\u0D3F\u0D28" // -ിന്
		},
		stems: {
			other: noun.singular.replace(isSchwaStem, "$1") // Remove the schwa to form the non-nominative stem
		},
		suffixes: {
			accusative: "\u0D46",
			genitive: "\u0D31\u0D4D\u0D31\u0D46",
			dative: [
				"\u0D4D\u0D28\u0D4D", // ന്
				"\u0D4D" // ്
			],
			locative: "\u0D3F\u0D7D", // ിൽ
			sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
			instrumental: "\u0D3E\u0D7D", // -ാൽ
			adessive: "\u0D47\u0D7D" // -േൽ
		}
	};
}

function getCodePoints(text)
{
	return [...text].map(char => char.codePointAt(0));
}

function declineSingular(noun)
{
	/*
	* Possibilities:
	* 1) -an stem.
	* 2) -am stem
	* 3) -Ruh stem
	* 4) -Duh stem
	* 5) -aL stem
	* 6) ്-stem
	* 7) Vowel-stem (else)
	*/
	const isAnStem = /^(.*)\u0D7B$/u;
	const isAmStem = /^(.*)\u0D02$/u;
	const isRuhStem = /^(.*[\u0D3E|\u0D40|\u0D42|\u0D44|\u0D47|\u0D48|\u0D4B|\u0D4C])\u0D31\u0D4D$/u;
	const isDuhStem = /^(.*[\u0D3E|\u0D40|\u0D42|\u0D44|\u0D47|\u0D48|\u0D4B|\u0D4C])\u0D1F\u0D4D$/u;
	const isALStem = /^(.*)\u0D7E$/u;
	const isSchwaStem = /^(.*)[\u0D15-\u0D3A]\u0D4D$/u;
	const isSyllabicRStem = /^(.*)([\u0D43-\u0D44])$/u;
	const isRetroflexNasalStem = /^(.*)\u0D7A$/u;
	const isDentalLabialStem = /^(.*)\u0D7D$/u;
	const isDentalTrillStem = /^(.*)\u0D7C$/u;
	let toReturn = {};

	console.log("declineSingular: noun = %o\n\tisSchwaStem.test(noun.singular) = %o\n\tisDuhStem.test(noun.singular) = %o\n\tCodepoints in the noun's singular form: %o", noun, isSchwaStem.test(noun.singular), isDuhStem.test(noun.singular), getCodePoints(noun.singular));
	
	if (isAnStem.test(noun.singular))
	{
		/* Stems */
		toReturn = {
			type: "-\u0D7B", // Alveolar nasal chillu
			nominative: noun.singular,
			stems: {
				genitive: noun.singular, // The genitive also uses a chillu
				other: noun.singular.replace(isAnStem, "$1\u0D28"), // Replace the chിൽlu with a regular ന
			},
			suffixes: {
				accusative: "\u0D46", // െ
				genitive: "\u0D31\u0D4D\u0D31\u0D46", // റ്റെ
				dative: [
					"\u0D4D\u0D28\u0D4D", // ന്
					"\u0D4D" // ്
				],
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // ോട്
				instrumental: "\u0D3E\u0D7D", // ാൽ
				adessive: "\u0D47\u0D7D" // േൽ
			}
		};
	}

	else if (isAmStem.test(noun.singular))
	{
		toReturn = {
			type: "-\u0D02", // Anusvara
			nominative: noun.singular,
			stems: {
				nonNominative: noun.singular.replace(isAmStem, "$1") // Remove the final anusvara
			},
			increments: {
				obligatory: "\u0D24\u0D4D\u0D24",  // ത്ത്
				optional: "\u0D3F\u0D28" // ിന്
			},
			suffixes: {
				accusative: "\u0D46", // െ
				genitive: "\u0D31\u0D4D\u0D31\u0D46", // റ്റെ
				dative: [ // 2 alternatives
					"\u0D4D\u0D28\u0D4D", // ന്
					"\u0D4D" // ്
				],
				locative: [
					"\u0D3F\u0D7D", // ിൽ
					"\u0D4D" // AM-stems also have a locative that's just a schwa
				],
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	else if (isRuhStem.test(noun.singular)) // Double
	{
		toReturn = {
			type: "-\u0D31\u0D4D", // Alveolar trill followed by a schwa
			nominative: noun.singular,
			stems: {
				genitive: noun.singular.replace(isRuhStem, "$1\u0D31"), // The genitive stem ends with a bare /r/
				other: noun.singular.replace(isRuhStem, "$1\u0D31\u0D4D\u0D31") // The non-genitive cases also use a doubled /t:/
			},
			increments: {
				nonNominative:"\u0D3F\u0D28" // -ിന്
			},
			suffixes: {
				accusative: "\u0D46", // െ
				genitive:"\u0D31\u0D4D\u0D31\u0D46", // -റ്റെ
				dative: [ // 2 alternatives
					"\u0D28\u0D4D", // -ന്
					"\u0D4D" // -്
				],
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	else if (isDuhStem.test(noun.singular))
	{
		console.log("declineSingular: declining a -duh stem");
		toReturn = {
			type: "-\u0D1F\u0D4D", // Unvoiced unaspirated retroflex stop followed by a schwa
			nominative: noun.singular,
			stems: {
				genitive: noun.singular.replace(isDuhStem, "$1\u0D1F"), // The genitive stem ends with a bare /T/
				other: noun.singular.replace(isDuhStem, "$1\u0D1F\u0D4D\u0D1F") // The non-genitive cases also use a doubled /T:/
			},
			increments: {
				genitive: "\u0D3F\u0D7B", // The genitive increment needs a chillu because the genitive ending begins with a consonant
				nonLocative:"\u0D3F\u0D28" // -ിന്
			},
			suffixes: {
				accusative: "\u0D46", // -െ
				genitive:"\u0D31\u0D4D\u0D31\u0D46", // -റ്റെ
				dative: [
					"\u0D4D\u0D28\u0D4D", // ന്
					"\u0D4D" // ്
				],
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	else if (isALStem.test(noun.singular))
	{
		toReturn = {
			type: "-\u0D7E", // Chillu retroflex labial
			nominative: noun.singular,
			stems: {
				dative: noun.singular, // The dative stem is the same as the nominative stem
				other: noun.singular.replace(isALStem, "$1\u0D33") // Replace the chillu with a non-chillu
			},
			suffixes: {
				accusative: "\u0D46", // െ
				genitive: "\u0D41\u0D1F\u0D45", // -ുടെ
				dative: "\u0D15\u0D4D\u0D15\u0D4D", // -ക്ക്
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	else if (isSchwaStem.test(noun.singular))
	{
		console.log("isSingular: declining the schwa stem %o", noun.singular);
		toReturn = declineSingularSchwaStem(noun);
		console.log("isSingular: toReturn = %o after calling declineSingularSchwaStem", toReturn);
	}

	else if (isRetroflexNasalStem.test(noun.singular))
	{
		toReturn = {
			type: "-\u0D7A", // Retroflex nasal
			nominative: noun.singular,
			increments: {
				genitive: "\u0D3F\u0D7B", // -ിന് (chillu)
				nonLocative: "\u0D3F\u0D28" // -ിന്
			},
			stems: {
				nonNominative: noun.singular.replace(isRetroflexNasalStem, "$1\u0D23") // Replace the chillu with a regular retroflex nasal
			},
			suffixes: {
				accusative: "\u0D46",
				genitive: "\u0D31\u0D4D\u0D31\u0D46",
				dative: [
					"\u0D4D\u0D28\u0D4D", // ന്
					"\u0D4D" // ്
				],
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	else if (isDentalTrillStem.test(noun.singular))
	{
		toReturn = {
			type: "-\u0D7C", // Chillu dental trill
			nominative: noun.singular,
			increments: {
				genitive: "\u0D3F\u0D7B", // Use a chillu for the genitive
				other: "\u0D3F\u0D28" // -ിന്
			},
			stems: {
				nonNominative: noun.singular.replace(isDentalTrillStem, "$1\u0D30") // Replace the chillu with a regular ര
			},
			suffixes: {
				accusative: "\u0D46",
				genitive: "\u0D31\u0D4D\u0D31\u0D46",
				dative: [
					"\u0D4D\u0D28\u0D4D", // ന്
					"\u0D4D" // ്
				],
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	else if (isDentalLabialStem.test(noun.singular))
	{
		toReturn = {
			type: "-\u0D7D", // Chillu dental labial
			nominative: noun.singular,
			increments: {
				genitive: "\u0D3F\u0D7B", // -ിന് (chillu)
				nonLocative: "\u0D3F\u0D28" // -ിന്
			},
			stems: {
				nonNominative: noun.singular.replace(isDentalLabialStem, "$1\u0D32") // Replace the chillu with a regular ല
			},
			suffixes: {
				accusative: "\u0D46",
				genitive: "\u0D31\u0D4D\u0D31\u0D46",
				dative: [
					"\u0D4D\u0D28\u0D4D", // ന്
					"\u0D4D" // ്
				],
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	else if (isSyllabicRStem.test(noun.singular))
	{
		/*
		*  3 different declensions are possible:
		* 1) Front-vowel stem.
		* 2) Back-vowel stem.
		* 3) ്Schwa-stem.
		* So we need to return an array of the possible declensions.
		*/
		toReturn = [
			declineSingularFrontVowelStem(noun),
			declineSingularBackVowelStem(noun),
			declineSingularSchwaStem(noun)
		];
	}
	
	else // Vowel stem
	{
		console.log("declineSingular: declining a vowel stem");

		/*
		* These decline differently, depending on which vowels they end with.
		* 1) -a stems add a -/j/ before the dative singular.
		* 2) -i and (probably) -e stems add a /j/ before case endings that begin with vowels (all except dative).
		* 3) -u and (probably) -o stems add either a -/vin/ or a -/j/ before case endings that begin with vowels.
		* 4) All of the rules above (probably) also apply to their long vowel counterparts.
		* 5) /ai/ stems (probably) behave like front vowel stems, and /au/ stems (probably) behave like back vowel stems.
		*/
		const isAStem = /^(.*)([\u0D15-\u0D3A]|\u0D3E)$/u; // A noun whose singular nominative stem ends in any consonant letter without modifications (hence, the default vowel /a/), or a long -aa matra
		const isFrontStem = /^(.*)([\u0D3F|\u0D40|\u0D46|\u0D47|\u0D48])$/u; // A noun whose singular nominative stem ends in any front vowel

		if (isAStem.test(noun.singular))
		{
			toReturn = {
				type: "a", // A-stem
				nominative: noun.singular,
				stems: {
					dative: noun.singular + "\u0D2F\u0D4D", // Add a /j/ and a viraama
					other: noun.singular + "\u0D2F" // Add a /j/
				},
				suffixes: {
					accusative: "\u0D46",
					genitive: "\u0D41\u0D1F\u0D46", // uTe
					dative: "\u0D15\u0D4D\u0D15\u0D4D", // kkuh
					locative: "\u0D3F\u0D7D", // ിൽ
					sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
					instrumental: "\u0D3E\u0D7D", // -ാൽ
					adessive: "\u0D47\u0D7D" // -േൽ
				}
			};
		}

		else if (isFrontStem.test(noun.singular))
		{
			console.log("declineSingular: declining a front vowel stem");
			toReturn = declineSingularFrontVowelStem(noun);
			console.log("declineSingular: front vowel stem declension: returning %o", toReturn);
		}
	
		else // Back-vowel stem
		{
			toReturn = declineSingularBackVowelStem(noun);
		}
	}

	console.log("declineSingular: returning %o", toReturn);	
	return toReturn;
}

function genPluralNonNominativeStem(pluralNominative)
{
	const removeChilluRetroflexLateral = /^(.*)\u0D7E$/u; // Matches a noun that ends in a chillu retroflex lateral, and saves the noun's stem up to the lateral
	const removeChilluDentalTrill = /^(.*)\u0D7C$/u; // Matches a noun that ends in a chillu dental trill, and saves the noun's stem up to the trill

	if (removeChilluRetroflexLateral.test(pluralNominative)) // Need to change the chillu retroflex lateral to a regular retroflex lateral letter for non-accusative cases
	{
		return pluralNominative.replace(removeChilluRetroflexLateral, "$1\u0D33"); // Replace the chillu with a regular letter
	}

	else if (removeChilluDentalTrill.test(pluralNominative))
	{
		return pluralNominative.replace(removeChilluDentalTrill, "$1\u0D30"); // Replace the chillu with a regular dental trill
	}

	else // ??
	{
		return undefined;
	}
}

async function declinePlural(noun)
{
	const pluralData = await getPlural(noun);
	console.log("declinePlural: pluralData = %o", pluralData);
	const caseSuffixes = { // All plurals decline with the same case suffixes
		accusative: "\u0D46",
		genitive: "\u0D41\u0D1F\u0D46", // uTe
		dative: "\u0D15\u0D4D\u0D15\u0D4D", // kkuh
		locative: "\u0D3F\u0D7D", // ിൽ
		sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
		instrumental: "\u0D3E\u0D7D", // -ാൽ
		adessive: "\u0D47\u0D7D" // -േൽ
	};
	
	if (pluralData.hasOwnProperty("optional")) // A noun with an optional plural
	{
		const pluralNominative = pluralData.plural; // We have the plural nominative form

		return {
			nominative: pluralNominative,
			stems: {
				other: genPluralNonNominativeStem(pluralNominative)
			},
			suffixes: caseSuffixes,
			isOptional: true
		};
	}

	else if (pluralData.hasOwnProperty("hasPlural"))
	{
		console.log("declinePlural: pluralData has property 'hasPlural'\npluralData.hasPlural = %o", pluralData.hasPlural);

		if (!pluralData.hasPlural)
		{
			console.log("declinePlural: !pluralData.hasPlural: returning %o", null);
			return null;
		}
	}

	else if (Object.keys(pluralData).length == 1 && pluralData.hasOwnProperty("pluralSuffix")) // There's only 1 plural, and it's formed by adding a suffix to the singular nominative
	{
		const pluralNominative = noun.singular + pluralData.pluralSuffix.nominative; // Form the plural by suffixing the suffix to the noun's singular nominative form
		
		return {
			nominative: pluralNominative,
			stems: {
				nominative: noun.singular,
				other: genPluralNonNominativeStem(pluralNominative)
			},
			suffixes: {
				cases: caseSuffixes,
				plural: pluralData.pluralSuffix
			}
		};
	}

	else if (pluralData.hasOwnProperty("pluralSuffix") && pluralData.hasOwnProperty("pluralStem")) // A noun that has a different plural stem, not just a different suffix
	{
		const pluralNominative = pluralData.pluralStem + pluralData.pluralSuffix.nominative; // Form the plural using the special stem and the suffix
		
		return {
			nominative: pluralNominative,
			stems: {
				nominative: pluralData.pluralStem,
				other: genPluralNonNominativeStem(pluralNominative)
			},
			suffixes: {
				cases: caseSuffixes,
				plural: pluralData.pluralSuffix
			}
		};
	}

	else if (pluralData.hasOwnProperty("pluralSuffixes")) // A noun with multiple plurals
	{
		console.log("declinePlural: multiple plurals");
		let toReturn = [];

		for (pluralInd in pluralData.pluralSuffixes) // Generate a nominative for each suffix
		{
			console.log("Multiple plurals: current plural index = %o", pluralInd);
			const curPluralSuffix = pluralData.pluralSuffixes[pluralInd];
			console.log("Multiple plurals: current plural suffix = %o", curPluralSuffix);
			const pluralNominative = noun.singular + curPluralSuffix.pluralSuffix.nominative;
			console.log("Multiple plurals: plural nominative = %o", pluralNominative);
			toReturn.push(
				{
					nominative: pluralNominative,
					stems: {
						nominative: noun.singular,
						other: genPluralNonNominativeStem(pluralNominative)
					},
					suffixes: {
						cases: caseSuffixes,
						plural: curPluralSuffix
					}
				}
			);
		}

		if (pluralData.hasOwnProperty("epicenePlural")) // A noun that has an epicene plural, in addition to 2 plural suffixes in free variation
		{
			/* Epicene plural */
			toReturn.push(
				{
					nominative: pluralData.epicenePlural.stem + pluralData.epicenePlural.suffix.nominative,
					stems: {
						nominative: pluralData.epicenePlural.stem + pluralData.epicenePlural.suffix.nominative,
						dative: pluralData.epicenePlural.stem + pluralData.epicenePlural.suffix.dative,
						other: pluralData.epicenePluralStem.stem + pluralData.epicenePlural.suffix.other
					},
					suffixes: caseSuffixes
				}
			);
		}

		return toReturn;
	}

	else // 2 possible plurals for a human noun - epicene & all-same-gender
	{
		console.log("declinePlural: this is a noun with an epicene plural and a plural for a group that consists of entities that are all of the same gender.");
		toReturn = [
			/* Epicene plural */
			{
				nominative: pluralData.epicenePlural.stem + pluralData.epicenePlural.suffix.nominative,
				stems: {
					other: pluralData.epicenePlural.stem
				},
				suffixes: {
					cases: caseSuffixes,
					plurals: {
						nominative: pluralData.epicenePlural.suffix.nominative,
						dative: pluralData.epicenePlural.suffix.dative,
						other: pluralData.epicenePlural.suffix.other
					}
				}
			},

			/* All-same-gender plural */
			{
				nominative: pluralData.allSameGenderPlural.stem + pluralData.allSameGenderPlural.suffix.nominative,
				stems: {
					other: pluralData.allSameGenderPlural.stem
				},
				suffixes: {
					cases: caseSuffixes,
					plurals: {
						nominative: pluralData.allSameGenderPlural.suffix.nominative,
						dative: pluralData.allSameGenderPlural.suffix.dative,
						other: pluralData.allSameGenderPlural.suffix.other
					}
				}
			}
		];
		console.log("declinePlural: epicene plural: returning %o", toReturn);
		return toReturn;
	}
}

module.exports.GetDeclensions = async (req, res, next) => {
	try
	{
		const noun = await Noun.findOne(
			{
				_id: req.params.id
			}
		);
		res.status(200).json(
			{
				singular: declineSingular(noun),
				plural: await declinePlural(noun),
				nounInfo: noun
			}
		);
	}

	catch (e)
	{
		console.log(e);
		res.status(404).json(
			{
				success: false,
				error: "Couldn't get declensions"
			}
		);
	}

	finally
	{
		next();
	}
};
