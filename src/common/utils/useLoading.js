import React from "react";
import { useSelector } from "react-redux";

const useLoading = slice => {
	const loading = useSelector(state => state[slice].loading);

	if (loading === "idle") return null;

	return <p className="loading align-center">{loading}</p>;
};

export default useLoading;
