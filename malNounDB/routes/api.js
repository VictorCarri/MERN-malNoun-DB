/* Imports */
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/AuthMiddleware"); // Authentication middleware
const { GetAll, CreateNoun, DeleteNoun, UpdateNoun, GetPlural } = require("../controllers/NounController.js"); // Noun controller that responds to routes
const { bodyParser, jsonValidator, validateMalayalam, validateGender } = require("../middleware/FormMiddleware.js"); // To validate the body as JSON, then parse the JSON into body properties
const { body } = require("express-validator"); // Main body validator creator function

/** Route setup **/

/* GET routes */
router.get("/nouns", GetAll); // GET all nouns
router.get("/nouns/:id/plural", GetPlural); // Get the plural form of a noun

/*
* To create a noun, we need to:
* 
* 1) Ensure that the user is authorized to access this route.
* 2) Ensure that the body contains valid JSON.
* 3) Parse the JSON into the body.
* 4) Ensure that the "singular" parameter:
*	a) Is present.
*	b) Has at least 1 character.
*	c) Contains valid Malayalam unicode.
* 5) For each of the Boolean parameters:
*	a) Validate that:
*		i) They're present.
*		ii) Their value can be converted to a Boolean.
* 6) Validate that the gender parameter:
*	a) Is present.
*	b) Is a string.
*	c) Passes a custom validator that ensures that the string is one of "masculine", "feminine", or "neuter" (case-insensitive).
* 7) Validates that the plural parameter:
*	a) MAY be present.
*	b) Exists.
*	c) Is a string.
*	d) Has at least 1 UTF-16 codepoint.
*	e) Has only Malayalam UTF-16 codepoints.
* 8) Call the CreateNoun controller method.
*/
const singularValidator = body("singular").exists().isString().isLength({min: 1}).custom(validateMalayalam);
const humanValidator = body("human").exists().isBoolean();
const animateValidator = body("animate").exists().isBoolean();
const genderValidator = body("gender").exists().isString().toLowerCase().custom(validateGender);
const hasPluralValidator = body("hasPlural").exists().isBoolean();
const pluralIsOptionalValidator = body("pluralIsOptional").optional().exists().isBoolean();
const pluralValidator = body("plural").optional().exists().isString().isLength({min: 1}).custom(validateMalayalam);
const isYoungChildValidator = body("isYoungChild").exists().isBoolean();
const hasMultiplePlurals = body("hasMultiplePlurals").optional().exists().isBoolean();
const meaningsValidator = body("meanings").exists().isArray({min: 1});
const hasIrregularPluralValidator = body("hasIrregularPlural").exists().isBoolean();
router.post("/nouns", requireAuth, jsonValidator, bodyParser, singularValidator, humanValidator, animateValidator, genderValidator, meaningsValidator, pluralValidator, pluralIsOptionalValidator, hasPluralValidator, isYoungChildValidator, hasIrregularPluralValidator, CreateNoun); // POST to create a new noun entry

/*
* To delete a noun, we need to:
*
* 1) Ensure that the user is authorized to access this route.
* 2) Ensure that the body contains valid JSON.
* 3) Parse the JSON into the body.
* 4) Ensure that the request's "id" parameter:
*	a) Is present.
*	b) Has at least 1 character.
*/
const idValidator = body("id").exists().isString().isLength({min: 1});
router.delete("/nouns/:id", requireAuth, jsonValidator, bodyParser, idValidator, DeleteNoun); // DELETE a noun by ID

/*
* To update a noun, we need to:
*
* 1) Ensure that the user is authorized to access this route.
* 2) Ensure that the body contains valid JSON.
* 3) Parse the JSON into the body.
* 4) Ensure that the request's "id" parameter:
*	a) Is present.
*	b) Has at least 1 character.
* 5) Ensure that the "singular" parameter:
*	a) Is present.
*	b) Has at least 1 character.
*	c) Contains valid Malayalam unicode.
* 6) For each of the Boolean parameters:
*	a) Validate that:
*		i) They're present.
*		ii) Their value can be converted to a Boolean.
* 7) Validate that the gender parameter:
*	a) Is present.
*	b) Is a string.
*	c) Passes a custom validator that ensures that the string is one of "masculine", "feminine", or "neuter" (case-insensitive).
* 8) Validates that the plural parameter:
*	a) MAY be present.
*	b) Exists.
*	c) Is a string.
*	d) Has at least 1 UTF-16 codepoint.
*	e) Has only Malayalam UTF-16 codepoints.
* 9) Call the UpdateNoun controller method.
*/
router.patch("/nouns/:id", requireAuth, jsonValidator, bodyParser, idValidator, singularValidator, humanValidator, animateValidator, genderValidator, pluralValidator, UpdateNoun); // PATCH a noun by ID

/* Exports */
module.exports = router; // Export the router
