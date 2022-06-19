import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const handleFetch = async ({ query, options, variables, formData }) => {
	let body;

	if (formData) body = formData;
	else {
		if (variables) body = { query, variables };
		else body = { query };
	}

	try {
		const req = await fetch(publicRuntimeConfig.BACKEND_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...options,
			},
			body: JSON.stringify(body),
		});
		const data = await req.json();
		return data.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
