import Cookies from "js-cookie";
import { handleFetch } from "./handleFetch";
import { GetLoggedInUserUsername, GetLoggedInUserData } from "./queries";

export const setToken = (jwt) => Cookies.set("jwt", jwt, { expires: 30 });

export const removeToken = () => Cookies.remove("jwt");

export const getUserFromLocalCookie = async () => {
	let userData = null;
	const jwt = getTokenFromLocalCookie();
	if (jwt) {
		const getUsername = async () => {
			const usernameData = await handleFetch(GetLoggedInUserUsername, {
				Authorization: `Bearer ${jwt}`,
			});
			return usernameData?.me?.username;
		};
		const getUserData = async (username) => {
			const userData = await handleFetch(GetLoggedInUserData(username));
			return userData;
		};
		const username = await getUsername();
		userData = await getUserData(username);
	}
	return userData;
};

export const getTokenFromLocalCookie = () => Cookies.get("jwt");
