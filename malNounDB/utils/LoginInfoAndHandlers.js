const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { createSecretToken, createRefreshToken } = require("./SecretToken");
const { setTokenCookie, setRefreshCookie } = require("./SetCookies");

module.exports.neitherTokenNorRefresh = (accessCookie, refreshCookie) => {
	return !accessCookie && !refreshCookie;
};

module.exports.findReqUser = async (accessToken) => {
	const decodedAccessToken = jwt.verify(accessToken, process.env.TOKEN_KEY);
	const reqUser = await User.findById(decodedAccessToken.id);
	return reqUser;
};

module.exports.markAsNotLoggedIn = (res, status) => {
	res.status(status)
	.json(
		{
			loggedIn: false
		}
	);
};

module.exports.genNewAccessToken = (refreshToken, res) => {
	const decodedRefreshToken = jwt.verify(refreshToken, process.env.TOKEN_KEY);
	const accessToken = createSecretToken(decodedRefreshToken.id);
	setRefreshCookie(res, refreshToken);
	setTokenCookie(res, accessToken);
	return {refreshToken, accessToken};
};

module.exports.markAsLoggedIn = (res, user, status) => {
	res.status(status)
	.json(
		{
			userName: user.userName,
			loggedIn: true
		}
	);
};
