export const handleFetch = async (query, options = {}) => {
	try {
		const req = await fetch("http://localhost:1337/graphql", {
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
