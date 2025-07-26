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

function addKalToNeuterNoun(singularForm)
{
	const endsInAm = /^(.*)\u0D02$/u; // A noun ending in -am
	const endsInShortUOrLongVowel = /^(.*)[\u0D41|\u0D3E|\u0D40|\u0D42|\u0D47|\u0D48|\u0D48|\u0D4C]$/u; // A noun ending in a short -u or any long vowel
	const endsInSchwa = /^(.*)\u0D4D$/u; // A noun ending in a schwa
	
	console.log("addKalToNeuterNoun: endsInSchwa.test(%s): %b", singularForm, endsInSchwa.test(singularForm));

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
