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
	console.log("UpdateNoun\n\tNoun ID: %o\n\tReq body: %o", req.params.id, req.body);
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

	if (endsInAm.test(singularForm))
	{
		return singularForm.replace(endsInAm, "$1\u0D19\u0D4D\u0D19\u0D7E"); // Replace -am with -angngaL
	}

	else if (endsInShortUOrLongVowel.test(singularForm))
	{
		return singularForm + "\u0D15\u0D4D\u0D15\u0D7E"; // Add -kkaL
	}

	else if (endsInSchwa.test(singularForm))
	{
		return singularForm.replace(endsInSchwa, "$1\u0D41\u0D15\u0D7E"); // Replace the schwa with an -u, then add -kaL
	}

	else // Default
	{
		return singularForm + "\u0D15\u0D7E"; // Add -kaL
	}	
}

module.exports.GetPlural = async (req, res, next) => {
	try
	{
		const noun = await Noun.findOne({ _id: req.params.id});
		console.log("GetPlural: pluralizing %o", noun);
		
		if (noun.human) // The noun refers to a human entity
		{
			if (noun.pluralOptional) // The noun has an optional plural
			{
				res.status(200).json(
					{
						optional: true,
						plural: noun.plural
					}
				);
			}

			else if (!noun.hasPlural) // The noun has no plural
			{
				res.status(200).json(
					{
						hasPlural: false
					}
				);
			}

			else if (noun.denotesYoungChild) // These all add variants of -kaL
			{
				const endsInSchwa = /^(.*[\u0D15-\u0D3A])\u0D4D/u; // A noun that ends in a consonant followed by a schwa
				
				if (endsInSchwa.test(noun.singular))
				{
					res.status(200).json(
						{
							pluralStem: noun.singular.replace(endsInSchwa, "$1"), // The plural stem is the stem without the schwa
							pluralSuffix: "\u0D41\u0D19\u0D4D\u0D19\u0D7E" // - ungngaL
						}
					);
				}

				else // Append -kaL
				{
					res.status(200).json(
						{
							pluralSuffix: "\u0D15\u0D7E" // kaL
						}
					);
				}
			}

			else // Generate this [+HUM] noun's plural
			{
				const endsInLongAOrSyllabicRReg = /^.*[\u0D3E|\u0D43]$/u;
				const endsInAnOrIReg = /^(.*)[\u0D7B|\u0D3F]$/u;

				if (noun.gender == "masculine")
				{
					const endsInKaaranReg = /^(.*)\u0D15\u0D3E\u0D30\u0D7B/u;

					if (endsInLongAOrSyllabicRReg.test(noun.singular)) 
					{
						res.status(200).json(
							{
								pluralSuffix: "\u0D15\u0D4D\u0D15\u0D7E" // -kkaL
							}
						);
					}

					else if (endsInKaaranReg.test(noun.singular)) // 2 possible plurals
					{
						res.status(200).json(
							{
								epicenePlural: noun.singular.replace(endsInKaaranReg, "$1\u0D15\u0D3E\u0D7C"), // Replace -kaaran with -kaar
								allSameGenderPlural: noun + "\u0D2E\u0D3E\u0D7C" // Add -maar for the all-masc plural
							}
						);
					}

					else if (!endsInKaaranReg.test(noun.singular) && endsInAnOrIReg.test(noun.singular)) // This is a noun that ends in -an or -i, but not -kaaran or -kaari
					{
						res.status(200).json(
							{
								epicenePlural: noun.singular.replace(endsInAnOrIReg, "$1\u0D7C"), // Replace the final vowel with -ar
								allSameGenderPlural: noun + "\u0D2E\u0D3E\u0D7C" // Add -maar for the all-masc plural
							}
						);
					}

					else
					{
						res.status(200).json(
							{
								pluralSuffix: "\u0D2E\u0D3E\u0D7C" // maar
							}
						);
					}
				}

				else if (noun.gender == "feminine")
				{
					const endsInAReg = /^.*[\u0D15-\u0D3A]$/u; // Any noun that ends in a consonant without a matra
					const endsInIReg = /^.*\u0D3F$/u; // Any noun that ends in a short i-matra
					const endsInKaariReg = /^(.*)[\u0D15\u0D3E\u0D30\u0D3F]$/u; // Any noun that ends in -kaari

					if (endsInAReg.test(noun.singular)) // This is a feminine noun that ends in /a/
					{
						res.status(200).json(
							{
								pluralSuffix: "\u0D2E\u0D3E\u0D7C" // maar
							}
						);
					}

					else if (endsInIReg.test(noun.singular)) // A feminine noun that ends in /i/
					{
						res.status(200).json(
							{
								pluralSuffixes: [ // 2 possibilities in free variation
									"\u0D2E\u0D3E\u0D7C", // maar
									"\u0D15\u0D7E" // kaL
								]
							}
						);
					}

					else if (endsInLongAOrSyllabicRReg.test(noun.singular))
					{
						res.status(200).json(
							{
								pluralSuffix: "\u0D15\u0D4D\u0D15\u0D7E" // kkaL
							}
						);
					}

					else if (endsInKaariReg.test(noun.singular)) // 2 plurals - epicene & all-fem
					{
						res.status(200).json(
							{
								epicenePlural: noun.singular.replace(endsInKaariReg, "$1\u0D15\u0D3E\u0D7C"), // Replace -kaaran with -kaar
								allSameGenderPlural: noun + "\u0D2E\u0D3E\u0D7C" // Add -maar for the all-fem plural
							}
						);
					}

					else if (!endsInKaariReg.test(noun.singular) && endsInAnOrIReg.test(noun.singular)) // This is a noun that ends in -an or -i, but not -kaaran or -kaari
					{
						res.status(200).json(
							{
								epicenePlural: noun.singular.replace(endsInAnOrIReg, "$1\u0D7C"), // Replace the final vowel with -ar
								allSameGenderPlural: noun + "\u0D2E\u0D3E\u0D7C" // Add -maar for the all-fem plural
							}
						);
					}

					else // All other feminine nouns
					{
						res.status(200).json(
							{
								pluralSuffix: "\u0D15\u0D7E" // kaL
							}
						);
					}
				} // feminine
			}
		}

		else if (!noun.human && noun.animate) // The noun is [-HUM], but [+ANIM]
		{
			const endsInAn = /^.*\u0D7B$/u;	 // A noun that ends in a chillu alveolar nasal

			if (endsInAn.test(noun.singular)) // A few nouns that are [-HUM] but end in -an
			{
				res.status(200).json(
					{
						pluralSuffix: "\u0D2E\u0D3E\u0D7C" // -maar
					}
				);
			}

			else // -kaL and variants
			{
				res.status(200).json(
					{
						plural: addKalToNeuterNoun(noun.singular)
					}
				);
			}
		}

		else // Neither [+HUM] nor [+ANIM]
		{
			console.log("GetPlural: the noun is neither human nor animate.");

			res.status(200).json(
				{
					plural: addKalToNeuterNoun(noun.singular)
				}
			);
		}
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
	toReturn = {
		type: "-്\u0D4D", // Schwa
		nominative: noun.singular,
		increments: {
			nonLocative: "\u0D3F\u0D28" // -ിന്
		},
		stems: {
			nonNominative: noun.singular.replace(isSchwaStem, "$1") // Remove the schwa to form the non-nominative stem
		},
		suffixes: {
			accusative: "\u0D46",
			genitive: "\u0D31\u0D4D\u0D31\u0D46",
			dative: [
				"\u0D28\u0D4D", // ന്
				"\u0D4D" // ്
			],
			locative: "\u0D3F\u0D7D", // ിൽ
			sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
			instrumental: "\u0D3E\u0D7D", // -ാൽ
			adessive: "\u0D47\u0D7D" // -േൽ
		}
	};
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
	const isRuhStem = /^(.*)\u0D31\u0D4D$/u;
	const isDuhStem = /^(.*)\u0D1F\u0D4D$/u;
	const isALStem = /^(.*)\u0D7E$/u;
	//const isSchwaStem = /^(.*[\u0D15-\u0D3A])\u0D4D$/u;
	const isSyllabicRStem = /^(.*)([\u0D43-\u0D44])$/u;
	const isRetroflexNasalStem = /^(.*)\u0D7A$/u;
	const isDentalLabialStem = /^(.*)\u0D7D$/u;
	const isDentalTrillStem = /^(.*)\u0D7C$/u;
	let toReturn = {};
	
	if (isAnStem.test(noun.singular))
	{
		/* Stems */
		toReturn = {
			type: "-\u0D7B", // Alveolar nasal chillu
			nominative: noun.singular,
			stems: {
				nonNominative: noun.singular.replace(isAnStem, "$1\u0D28"), // Replace the chിൽlu with a regular ന
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
				genitive: noun.singular, // Am-stem's nominative and genitive stems are identical
				other: noun.singular.replace(isAmStem, "$1") // Remove the final anusvara
			},
			increments: {
				obligatory: "\u0D24\u0D4D\u0D24",  // ത്ത്
				optional: "\u0D3F\u0D28" // ിന്
			},
			suffixes: {
				accusative: "\u0D46", // െ
				genitive: "\u0D31\u0D4D\u0D31\u0D46", // റ്റെ
				dative: [ // 2 alternatives
					"\u0D28\u0D4D", // ന്
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
		toReturn = {
			type: "-\u0D1F\u0D4D", // Unvoiced unaspirated retroflex stop followed by a schwa
			nominative: noun.singular,
			stems: {
				genitive: noun.singular.replace(isDuhStem, "$1\u0D1F"), // The genitive stem ends with a bare /T/
				other: noun.singular.replace(isDuhStem, "$1\u0D1F\u0D4D\u0D1F") // The non-genitive cases also use a doubled /T:/
			},
			increments: {
				nonLocative:"\u0D3F\u0D28" // -ിന്
			},
			suffixes: {
				accusative: "\u0D46", // -െ
				genitive:"\u0D31\u0D4D\u0D31\u0D46", // -റ്റെ
				dative: [
					"\u0D28\u0D4D", // ന്
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
		toReturn = declineSingularSchwaStem(noun);
	}

	else if (isRetroflexNasalStem.test(noun.singular))
	{
		toReturn = {
			type: "-\u0D7A", // Retroflex nasal
			nominative: noun.singular,
			increments: {
				nonLocative: "\u0D3F\u0D28" // -ിന്
			},
			stems: {
				nonNominative: noun.singular.replace(isRetroflexNasalStem, "$1\u0D23") // Replace the chillu with a regular retroflex nasal
			},
			suffixes: {
				accusative: "\u0D46",
				genitive: "\u0D31\u0D4D\u0D31\u0D46",
				dative: [
					"\u0D28\u0D4D", // ന്
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
				nonLocative: "\u0D3F\u0D28" // -ിന്
			},
			stems: {
				nonNominative: noun.singular.replace(isDentalTrillStem, "$1\u0D30") // Replace the chillu with a regular ര
			},
			suffixes: {
				accusative: "\u0D46",
				genitive: "\u0D31\u0D4D\u0D31\u0D46",
				dative: [
					"\u0D28\u0D4D", // ന്
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
				nonLocative: "\u0D3F\u0D28" // -ിന്
			},
			stems: {
				nonNominative: noun.singular.replace(isDentalLabialStem, "$1\u0D32") // Replace the chillu with a regular ല
			},
			suffixes: {
				accusative: "\u0D46",
				genitive: "\u0D31\u0D4D\u0D31\u0D46",
				dative: [
					"\u0D28\u0D4D", // ന്
					"\u0D4D" // ്
				],
				locative: "\u0D3F\u0D7D", // ിൽ
				sociative: "\u0D4B\u0D1F\u0D4D", // -ോട്
				instrumental: "\u0D3E\u0D7D", // -ാൽ
				adessive: "\u0D47\u0D7D" // -േൽ
			}
		};
	}

	/* TODO: replace the code below with code that replaces toReturn with a new object taിൽored to the stem type, as above. */
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
			toReturn = declineSingularFrontVowelStem(noun);
		}
	
		else // Back-vowel stem
		{
			toReturn = declineSingularBackVowelStem(noun);
		}
	}
	
	return toReturn;
}

module.exports.GetDeclensions = async (req, res, next) => {
	try
	{
		const noun = await Noun.findOne({ _id: req.params.id});
		console.log("GetDeclensions: declining %o", noun);
		const singularDeclensions = declineSingular(noun);
		// TODO: Handle plural declensions, because they're complex
		res.status(200).json(
			{
				singular: singularDeclensions
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
