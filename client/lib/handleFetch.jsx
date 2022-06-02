export const handleFetch = async (query) => {
	const req = await fetch("http://localhost:1337/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
	});

	const data = await req.json();
	return data.data;
};
