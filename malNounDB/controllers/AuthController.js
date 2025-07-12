const User = require("../models/user");
const { createSecretToken, createRefreshToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { setTokenCookie, setRefreshCookie } = require("../utils/SetCookies"); // Cookie setters
const { neitherTokenNorRefresh, findReqUser, markAsNotLoggedIn, genNewAccessToken, markAsLoggedIn } = require("../utils/LoginInfoAndHandlers");

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
		const token = createSecretToken(user.id);
		console.log("Signup: token = %o", token);
		const refreshToken = createRefreshToken(user.id); // Create a JWT refresh token
		console.log("Signup: refresh token = %o", refreshToken);
		/*res.cookie("token", token, {
				withCredentials: true,
				httpOnly: true,
				sameSite: "none",
				maxAge: 60 * 60
			}
		);*/
		setTokenCookie(res, token);
		setRefreshCookie(res);
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
		next();
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
	
		const token = await createSecretToken(user.id); // Create a JWT token using the user's ID and our key
		console.log("Login: token = %o", token);
		const refreshToken = await createRefreshToken(user.id); // Create a JWT refresh token
		console.log("Login: refreshToken = %o", refreshToken);
		/*res.cookie("token", token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60
			}
		)*/
		setTokenCookie(res, token);
		/*.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 24 * 60 * 60
			}
		)*/
		setRefreshCookie(res, refreshToken);
		res.status(200)
		.json(
			{
				success: true,
				userName: user.username
			}
		);
		next();
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
		next();
	}
};

module.exports.Logout = async (req, res, next) => {
	console.log("Logout: request cookies: %o", req.cookies);
	
	if (req.cookies.token || req.cookies.refreshToken) // The user is logged in
	{
		console.log("Logout: The user is logged in, logging them out");
		res.clearCookie("token") // Clear the token cookie
		.clearCookie("refreshToken") // Clear the refresh token
		.status(200)
		.json(
			{
				"status": "loggedOut"
			}
		)
		;
		next();
	}
};

module.exports.Refresh = async (req, res, next) => {
	console.log("Refresh: request cookies: %o", req.cookies);
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) // The user isn't logged in, because the refresh token lasts longer than the main JWT token
	{
		res.status(401)
			.json(
				{
					loggedIn: false,
					reason: "noRefresh"
				}
			);
		next();
	}

	try
	{
		const decoded = jwt.verify(refreshToken, process.env.TOKEN_KEY); // Verify the refresh token
		const accessToken = await createSecretToken(decoded.id); // Create a new temporary secret token
		/*res.cookie("token", accessToken, { // Set a new temporary access token cookie
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 60 * 60
			}
		)*/
		setTokenCookie(res, accessToken);
		res.status(200)
		.json(
			{
				refreshed: true
			}
		);
		next();
	}

	catch (e)
	{
		res.status(400)
			.json(
				{
					loggedIn: false,
					reason: "invalidRefresh"
				}
			);
		next();
	}
};

module.exports.IsLoggedIn = async (req, res, next) => {
	console.log("IsLoggedIn: request cookies: %o", req.cookies);
	const accessToken = req.cookies.token;
	const refreshToken = req.cookies.refreshToken;

	if (neitherTokenNorRefresh(req.cookies))
	{
		console.log("IsLoggedIn: the user has neither a \"token\" cookie nor a \"refresh\" cookie");
		/*res.status(200)
		.json(
			{
				loggedIn: false
			}
		);*/
		markAsNotLoggedIn(res, 200);
		next();
	}

	else
	{
		try
		{
			reqUser = findReqUser(accessToken); // Try to find the request's user
			// The user is logged in if we got here
			/*res.status(200) // Tell the client what their username is, and that they're logged in
			.json(
				{
					userName: reqUser.username,
					loggedIn: true
				}
			);*/
			markAsLoggedIn(res, reqUser, 200);
			next();
		}
	
		catch (e) // Error with access token
		{
			if (!refreshToken) // They can't be logged in because they lack both a refresh token and an access token
			{
				markAsNotLoggedIn(res, 200);
				next();
			}
	
			try
			{
				({refreshToken, accessToken } = genNewAccessToken(refreshToken, res)); // Create a new access token for them using their refresh token
				reqUser = findReqUser(accessToken);
				markAsLoggedIn(res, reqUser, 200);
				next();
			}
	
			catch (e)
			{
				markAsNotLoggedIn(res, 200);
				next();
			}
		}
	}
};
