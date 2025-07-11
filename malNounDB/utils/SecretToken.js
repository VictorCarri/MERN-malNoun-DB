require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.createSecretToken = async (id) => {
	console.log("createSecretToken: id = %o", id);
	const user = await User.findById(id);
	console.log("createSecretToken: user = %o", user);
	const toReturn = jwt.sign({ id: id, userName: user.username }, process.env.TOKEN_KEY, {
			expiresIn: 60 * 60
		}
	);
	console.log("createSecretToken: toReturn = %o", toReturn);
	return toReturn;
};

module.exports.createRefreshToken = async (id) => {
	console.log("createRefreshToken: id = %o", id);
	const user = await User.findById(id);
	console.log("createRefreshToken: user = %o", user);
	const toReturn = jwt.sign({ id: id, userName: user.username }, process.env.TOKEN_KEY, {
			expiresIn: 24 * 60 * 60
		}
	);
	console.log("createRefreshtToken: toReturn = %o", toReturn);
	return toReturn;
};
