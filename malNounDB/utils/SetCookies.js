/* Set a token cookie upon login/refresh */
module.exports.setTokenCookie = (res, token) => {
	res.cookie("token", token, {
			withCredentials: true,
			httpOnly: true,
			sameSite: "none",
			maxAge: 60 * 60,
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
			maxAge: 24 * 60 * 60,
			withCredentials: true
		}
	)
};
