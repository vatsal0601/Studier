import Cookies from "js-cookie";
import { handleFetch } from "./handleFetch";
import { GetLogedInUserUsername, GetLogedInUserData } from "./queries";

export const setToken = (jwt) => {
	Cookies.set("jwt", jwt);
};

export const removeToken = () => {
	Cookies.remove("jwt");
};

export const getUserFromLocalCookie = async () => {
	let userData = null;
	const jwt = getTokenFromLocalCookie();
	if (jwt) {
		const getUsername = async () => {
			const usernameData = await handleFetch(GetLogedInUserUsername, {
				Authorization: `Bearer ${jwt}`,
			});
			return usernameData?.me?.username;
		};
		const getUserData = async (username) => {
			const userData = await handleFetch(GetLogedInUserData(username));
			return userData;
		};
		const username = await getUsername();
		userData = await getUserData(username);
	}
	return userData;
};

export const getTokenFromLocalCookie = () => {
	return Cookies.get("jwt");
};

export const getTokenFromServerCookie = (req) => {
	if (!req.headers.cookie || "") {
		return undefined;
	}
	const jwtCookie = req.headers.cookie.split(";").find((c) => c.trim().startsWith("jwt="));
	if (!jwtCookie) {
		return undefined;
	}
	const jwt = jwtCookie.split("=")[1];
	return jwt;
};
