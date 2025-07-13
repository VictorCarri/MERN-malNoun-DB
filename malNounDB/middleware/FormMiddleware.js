const { body } = require("express-validator"); // body validator
const bodyParserCreator = require("body-parser");

module.exports.bodyParser = bodyParserCreator(); // Body parser used across routes
module.exports.jsonValidator = body().isJSON(); // Validates the entire body as JSON

/*
* @param toValidate The string containing Unicode characters that we want to ensure are all in Malayalam.
* @return True if the string contains only
*/
module.exports.validateMalayalam = (toValidate) => {
	const malReg = /^[\u0D00-\u0D7F]+$/u; // Regex to ensure that the string contains only Malayalam characters
	return malReg.test(toValidate); // Check the string against the regex and return the result
};

// Ensure that the gender string is one of "masculine", "feminine", or "neuter" (case-insensitive)
module.exports.validateGender = (toValidate) => {
	return toValidate in ["masculine", "feminine", "neuter"];
};
