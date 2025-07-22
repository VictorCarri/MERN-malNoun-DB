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
