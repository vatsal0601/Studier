import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const handleFetch = async (query, options = {}) => {
	try {
		const req = await fetch(publicRuntimeConfig.BACKEND_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json", ...options },
			body: JSON.stringify({ query }),
		});
		const data = await req.json();
		return data.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
