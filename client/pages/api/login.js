import cookie from "cookie";
import { parseCookies } from "@lib/parseCookies";
import { login, getUserData } from "@lib/helpers";

export default async (req, res) => {
	let cookiesData = parseCookies(req);
	console.log(cookiesData);

	if (!cookiesData) {
		try {
			const { jwt, id } = await login(req);
			res.setHeader(
				"Set-Cookie",
				cookie.serialize("data", JSON.stringify({ jwt, id }), {
					httpOnly: true,
					secure: process.env.NODE_ENV !== "development",
					maxAge: 60 * 60 * 24 * 30,
					sameSite: "strict",
					path: "/",
				})
			);
			const user = await getUserData(id);
			res.statusCode = 200;
			return res.json({ user });
		} catch (err) {
			res.statusCode = 500;
			return res.json({ error: err });
		}
	}

	const user = await getUserData(cookiesData.id);
	res.statusCode = 200;
	return res.json({ user });
};
