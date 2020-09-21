import React from "react";
import BootcampDetails from "./BootcampDetails";
import { editBootcamp, updatePublisher } from "./publisherSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const EditBootcamp = () => {
	const alert = useAlert("publisher", updatePublisher);
	const loading = useLoading("publisher");

	if (loading) return <main className="main-bootcamp-dtls">{loading}</main>;

	return (
		<main className="main-bootcamp-dtls">
			<div className="alert-container align-center bootcamp-dtls-alert">{alert && <div>{alert}</div>}</div>
			<BootcampDetails {...{ caller: editBootcamp, display: "Update" }} />
		</main>
	);
};

export default EditBootcamp;
