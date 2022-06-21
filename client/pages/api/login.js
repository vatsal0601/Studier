import cookie from "cookie";
import { parseCookies } from "@lib/parseCookies";
import { login, getUserData } from "@lib/helpers";

export default async (req, res) => {
	const cookiesData = parseCookies(req);
	console.log(cookiesData);

	// if (!cookiesData) {
	// 	const { jwt, id } = await login(req, res);
	// 	res.setHeader(
	// 		"Set-Cookie",
	// 		cookie.serialize("data", JSON.stringify({ jwt, id }), {
	// 			httpOnly: true,
	// 			secure: process.env.NODE_ENV !== "development",
	// 			maxAge: 60 * 60 * 24 * 30,
	// 			sameSite: "strict",
	// 			path: "/",
	// 		})
	// 	);
	// 	const user = await getUserData(id);
	// 	res.statusCode = 200;
	// 	return res.json({ user });
	// }

	// const user = await getUserData(cookiesData.id);
	res.statusCode = 200;
	return res.json({ user: "A" });
};
