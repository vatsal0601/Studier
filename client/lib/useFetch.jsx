import { useState, useEffect } from "react";

export const useFetch = (url, options) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const results = await fetch(url, options);
				const data = await results.json();
				setData(data.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [url, options]);

	return [loading, data, error];
};
