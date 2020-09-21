import React from "react";
import { Redirect } from "react-router-dom";
import CourseDetails from "./CourseDetails";
import { createCourse, updatePublisher } from "../publisherSlice";
import useAlert from "../../../common/utils/useAlert";
import useLoading from "../../../common/utils/useLoading";
import { useSelector } from "react-redux";

const CreateCourse = () => {
	const { bootcamp } = useSelector(state => state.publisher);
	const alert = useAlert("publisher", updatePublisher);
	const loading = useLoading("publisher");

	if (loading) return <main className="main-course-dtls">{loading}</main>;

	if (!bootcamp) return <Redirect to="/publisher/manage" />;

	return (
		<main className="main-course-dtls">
			<div className="alert-container align-center course-dtls-alert">{alert && <div>{alert}</div>}</div>
			<CourseDetails {...{ caller: createCourse, display: "Create" }} />
		</main>
	);
};

export default CreateCourse;
