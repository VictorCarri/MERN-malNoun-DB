require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.createSecretToken = (id) => {
	const user = await User.findById(id);
	return jwt.sign({ id: id, userName: user.username }, process.env.TOKEN_KEY, {
			expiresIn: 60 * 60
		}
	);
};

module.exports.createRefreshToken = (id) => {
	const user = await User.findById(id);
	return jwt.sign({ id: id, userName: user.username }, process.env.TOKEN_KEY, {
			expiresIn: 24 * 60 * 60
		}
	);
};
