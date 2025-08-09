const { body } = require("express-validator"); // body validator
const bodyParserCreator = require("body-parser");

module.exports.bodyParser = bodyParserCreator.json(); // JSON Body parser used across routes
module.exports.jsonValidator = body().isJSON(); // Validates the entire body as JSON

/*
* @param toValidate The string containing Unicode characters that we want to ensure are all in Malayalam.
* @return True if the string contains only
*/
module.exports.validateMalayalam = (toValidate) => {
	const malReg = /^[\u0D00-\u0D7F| ]+$/u; // Regex to ensure that the string contains only Malayalam characters or spaces
	console.log("validateMalayalam: Testing the string \"%s\" for Malayalam code points\n\tCodepoints in the string: %o", toValidate, [...toValidate].map(char => char.charAt(0)));
	const toReturn = malReg.test(toValidate); // Check the string against the regex and return the result
	console.log("validateMalayalam: returning %o", toReturn);
	return toReturn;
};

// Ensure that the gender string is one of "masculine", "feminine", or "neuter" (case-insensitive)
module.exports.validateGender = (toValidate) => {
	return toValidate in ["masculine", "feminine", "neuter"];
};
