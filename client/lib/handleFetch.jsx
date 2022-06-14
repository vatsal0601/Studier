import getConfig from "next/config";
import axios from "axios";

const { publicRuntimeConfig } = getConfig();

export const handleFetch = async ({ query, options, variables, formData }) => {
	let body;

	if (formData) body = formData;
	else {
		if (variables) body = { query, variables };
		else body = { query };
	}

	try {
		const req = await axios.post(publicRuntimeConfig.BACKEND_URL, body, {
			headers: {
				"Content-Type": "application/json",
				...options,
			},
		});
		return req.data.data;
	} catch (err) {
		console.error(err);
		return null;
	}
};
