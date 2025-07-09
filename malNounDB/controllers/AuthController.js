const User = require("../models/user");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
	try
	{
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
				httpOnly: true,
				sameSite: "lax",
				maxAge: 24 * 60 * 60 * 1000
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
	}

	catch (e)
	{
		console.log("Error: %o", e);
		res.status(401)
		.json(
			{
				"error": "Unknown"
			}
		);
	}
};

module.exports.Login = async (req, res, next) => {
	try
	{
		console.log("Login: req.body = %o", req.body);
		const { email, password } = req.body;
		console.log("Login: email = %o\n\tpassword = %o", email, password);
	
		if (!email || !password) // Missing fields
		{
			return res.json(
				{
					"error": "All fields are required"
				}
			);
		}
	
		const user = await User.findOne( // Try to find the user they claim to be
			{
				email
			}
		);
		console.log("Login: user = %o", user);
	
		if (!user) // No such user
		{
			return res.json(
				{
					"error": "Incorrect password or email"
				}
			);
		}
	
		const auth = await bcrypt.compare(password, user.password); // Encrypt the password they gave us, then compare it to the stored encrypted password
		console.log("Login: auth = %o", auth);
	
		if (!auth)
		{
			return res.json(
				{
					"error": "Incorrect password or email"
				}
			);
		}
	
		const token = createSecretToken(user._id); // Create a JWT token using the user's ID and our key
		console.log("Login: token = %o", token);
		res.cookie("token", token, {
				withCredentials: true,
				httpOnly: true
			}
		);
		res.status(200)
		.json(
			{
				success: true
			}
		);
	}

	catch (e)
	{
		console.error(e);
		res.status(401)
		.json(
			{
				"error": "Unknown"
			}
		);
	}
};

module.exports.Logout = async (req, res, next) => {
	console.log(req.cookies);
	
	if (req.cookies.token) // The user is logged in
	{
		res.clearCookie("token") // Clear the token cookie
		.status(200)
		.json(
			{
				"status": "loggedOut"
			}
		)
		;
	}
};
