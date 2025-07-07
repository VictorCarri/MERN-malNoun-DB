const User = require("../models/user");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
	const { email, password, username, createdAt } = req.body;
	console.log("Signup: request body = %o", req.body);
	const existingUser = await User.findOne({ email });
	console.log("Signup: existingUser = %o", existingUser);
	
	if (existingUser)
	{
		return res.json(
			{
				error: "User already exists"
			}
		);
	}

	const user = await User.create({email, password, username, createdAt});
	console.log("Signup: user = %o", user);
	const token = createSecretToken(user._id);
	console.log("Signup: token = %o", token);

	res.cookie("token", token, {
			withCredentials: true,
			httpOnly: false
		}
	);

	res.status(201)
	.json(
		{
			message: "User signed in successfully",
			success: true,
			user
		}
	);
	next();
};
