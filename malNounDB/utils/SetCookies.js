const { maxTokenAge, maxRefreshTokenAge } = require("../config.js"); // Maximum token ages

/* Set a token cookie upon login/refresh */
module.exports.setTokenCookie = (res, token) => {
	res.cookie("token", token, {
			withCredentials: true,
			httpOnly: true,
			sameSite: "none",
			maxAge: maxTokenAge,
			secure: true
		}
	);
};

/* Set a refresh cookie upon login/refresh */
module.exports.setRefreshCookie = (res, refreshToken) => {
	res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: maxRefreshTokenAge,
			withCredentials: true
		}
	)
};
