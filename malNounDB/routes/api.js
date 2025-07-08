// Import Express and create a router
const express = require("express");
const router = express.Router();
const Noun = require("../models/noun.js"); // Noun model
const requireAuth = require("../middleware/AuthMiddleware"); // Authentication middleware

// GET all nouns
router.get("/nouns", (req, res, next) => {
		// Return all nouns as a JSON array
		Noun.find({}) // Get all nouns
		.then(data => res.json(data)) // Convert the data to JSON
		.catch(next); // Handle errors
	}
);

// POST to create a new noun entry
router.post("/nouns", requireAuth, (req, res, next) => {
		if (req.body.singular)
		{
			Noun.create(req.body) // Create a new noun
			.then(data => res.json(data)) // Convert the data to JSON
			.catch(next); // Handle errors
		}

		else // Error
		{
			res.json(
				{
					error: "The singular field is empty"
				}
			);
		}
	}
);

// DELETE a noun by ID
router.delete("/nouns/:id", requireAuth, (req, res, next) => {
		Noun.findOneAndDelete(
			{
				"_id": req.params.id // ID of the noun to delete
			}
		)
		.then(data => res.json(data))
		.catch(next);
	}
);

// PATCH a noun by ID
router.patch("/nouns/:id", requireAuth, (req, res, next) => {
		console.log("PATCH\n\tNoun ID: %o\n\tReq body: %o", req.params.id, req.body);
		Noun.findByIdAndUpdate(
			req.params.id,
			req.body,
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
					return res.status(404).json(
						{
							error: "Noun not found"
						}
					);
				}

				else // Send the updated document back as the response
				{
					return res.json(updatedNoun);
				}
			}
		)
		.catch(next);
	}
);

// Export the router
module.exports = router;
