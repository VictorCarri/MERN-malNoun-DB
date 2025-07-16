require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { maxTokenAge, maxRefreshTokenAge } = require("../config.js");

module.exports.createSecretToken = async (id) => {
	console.log("createSecretToken: id = %o", id);
	const user = await User.findById(id);
	console.log("createSecretToken: user = %o", user);
	const toReturn = jwt.sign({ id: id }, process.env.TOKEN_KEY, {
			expiresIn: maxTokenAge
		}
	);
	console.log("createSecretToken: toReturn = %o", toReturn);
	return toReturn;
};

module.exports.createRefreshToken = async (id) => {
	console.log("createRefreshToken: id = %o", id);
	const user = await User.findById(id);
	console.log("createRefreshToken: user = %o", user);
	const toReturn = jwt.sign({ id: id}, process.env.TOKEN_KEY, {
			expiresIn: maxRefreshTokenAge
		}
	);
	console.log("createRefreshtToken: toReturn = %o", toReturn);
	return toReturn;
};
