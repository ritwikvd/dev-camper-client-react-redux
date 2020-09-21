export const performFetch = async (url, config) => {
	const response = await fetch(url, {
		...config,
		headers: {
			"Content-Type": "application/json;charset=utf-8",
			authorization: `Bearer ${localStorage.getItem("TOKEN")}`
		}
	});

	return response.json();
};

export const handleLoadingUpdates = async (arr, dispatch, updater) => {
	for (let a of arr) {
		await new Promise(res => setTimeout(res, 500));
		dispatch(updater({ loading: a }));
		await new Promise(res => setTimeout(res, 500));
	}
	await new Promise(res => setTimeout(res, 500));
};
