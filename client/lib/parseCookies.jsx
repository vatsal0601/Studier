import cookie from "cookie";

export const parseCookies = (req) => {
	let cookiesData = null;
	const cookies = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
	if (cookies?.data) cookiesData = JSON.parse(cookies.data);
	return cookiesData;
};
