import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { deleteCourse, updatePublisher } from "../publisherSlice";
import useLoading from "../../../common/utils/useLoading";
import useAlert from "../../../common/utils/useAlert";

const ManageCourses = () => {
	const { bootcamp } = useSelector(state => state.publisher);
	const dispatch = useDispatch();
	const alert = useAlert("publisher", updatePublisher);
	const loading = useLoading("publisher");

	const { courses } = bootcamp || {};

	const getCoursesContainer = () => (
		<section className="courses-container">
			<div className="alert-container align-center courses-alert">{alert && <div>{alert}</div>}</div>
			{courses.map(c => (
				<div key={c._id} className="bootcamp-course">
					<div className="bootcamp-course-title">{c.title}</div>

					<div className="bootcamp-course-links">
						<Link to={`/publisher/courses/${c._id}/edit`}>
							<i className="fas fa-pencil-alt green" />
						</Link>

						<button onClick={() => dispatch(deleteCourse({ id: c._id }))}>
							<i className="fas fa-times red" />
						</button>
					</div>
				</div>
			))}
		</section>
	);

	if (!bootcamp) return <Redirect to="/publisher/manage" />;

	if (loading) return <main className="main-manage-courses">{loading}</main>;

	return (
		<main className="main-manage-courses">
			{courses?.length ? getCoursesContainer() : <div className="courses-msg">No courses added yet</div>}
			<Link to="/publisher/courses/create">Add new course</Link>
		</main>
	);
};

export default ManageCourses;
