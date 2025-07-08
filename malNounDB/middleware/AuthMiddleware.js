const User = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async function requireAuth (req, res, next) {
	const token = req.cookies.token; // Get the token cookie
	
	if (!token) // No token cookie
	{
		return res.json(
			{
				loggedIn: false // The user may not access this route because they're not logged in
			}
		);
	}

	jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
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
							status: false
						}
					);
				}
			}
		}
	);
};
