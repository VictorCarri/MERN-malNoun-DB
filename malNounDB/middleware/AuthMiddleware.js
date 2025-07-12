const User = require("../models/user");
require("dotenv").config();
//const jwt = require("jsonwebtoken");
//const { createSecretToken, createRefreshToken } = require("../utils/SecretToken");
//const { setTokenCookie, setRefreshCookie } = require("../utils/SetCookies");
const { neitherTokenNorRefresh, findReqUser, markAsNotLoggedIn, genNewAccessToken } = require("../utils/LoginInfoAndHandlers");

module.exports.requireAuth = async function (req, res, next) {
	const token = req.cookies.token; // Get the token cookie
	const refreshToken = req.cookies.refreshToken; // Get the refresh token cookie
	
	//if (!token && !refreshToken) // No token or refresh token
	//if (neitherTokenNorRefresh(token, refreshToken))
	if (neitherTokenNorRefresh(req.cookies))
	{
		/*res.status(401)
		.json(
			{
				loggedIn: false // The user may not access this route because they're not logged in
			}
		);*/
		markAsNotLoggedIn(res, 401);
	}

	/*jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
			if (err) // Error in verification
			{
				return res.json(
					{
						loggedIn: false
					}
				);
			}

			else // The user is logged in
			{
				const user = await User.findById(data.id); // Find the user who's associated with this token
				
				if (user) // There is a user associated with this token
				{
					req.user = user;
					next();
				}

				else // No user associated with token
				{
					return res.json(
						{
							loggedIn: false
						}
					);
				}
			}
		}
	);
	next();*/
	try /* First, check if they have an access token */
	{
		/*const decodedAccessToken = jwt.verify(accessToken, process.env.TOKEN_KEY); // They have an access token
		req.user = await User.findById(decodedAccessToken.id);*/
		req.user = findReqUser(accessToken);
		next();
	}

	catch (e)
	{
		if (!refreshToken) // Their access token is invalid, and they lack a refresh token. Deny access.
		{
			/*res.status(400)
			.json(
				{
					loggedIn: false
				}
			);*/
			markAsNotLoggedIn(res, 400);
		}

		try // Their access token has expired, but they still have a refresh token. So generate a new access token for them automatically.
		{
			/*const decodedRefreshToken = jwt.verify(refreshToken, process.env.TOKEN_KEY);
			const accessToken = createSecretToken(decodedRefreshToken.id); // Create a new refresh token using the same user ID
			setRefreshCookie(res, refreshToken);
			setTokenCookie(res, accessToken);*/
			const decodedRefreshToken = genNewAccessToken(refreshToken, res);
			req.user = await User.findById(decodedRefreshToken.id);
			next();
		}

		catch (e)
		{
			/*res.status(400)
			.json(
				{
					loggedIn: false
				}
			);*/
			markAsNotLoggedIn(res, 400);
			next();
		}
	}
};
