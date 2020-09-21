import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import CourseDetails from "./CourseDetails";
import { editCourse, updatePublisher } from "../publisherSlice";
import useAlert from "../../../common/utils/useAlert";
import useLoading from "../../../common/utils/useLoading";

const EditCourse = () => {
	const { bootcamp } = useSelector(state => state.publisher);
	const alert = useAlert("publisher", updatePublisher);
	const loading = useLoading("publisher");
	const { courseID } = useParams();

	if (!bootcamp) return <Redirect to="/publisher/manage" />;

	if (loading) return <main className="main-course-dtls">{loading}</main>;

	return (
		<main className="main-course-dtls">
			<div className="alert-container align-center course-dtls-alert">{alert && <div>{alert}</div>}</div>
			<CourseDetails {...{ caller: editCourse, courseID, display: "Update" }} />
		</main>
	);
};

export default EditCourse;
