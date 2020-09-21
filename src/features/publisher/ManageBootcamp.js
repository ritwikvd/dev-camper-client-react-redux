import React, { useLayoutEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPublisherBootcamp, updatePublisher } from "./publisherSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";
import Image from "../../common/image/Image";

let loaded = false;

const ManageBootcamp = () => {
	const { bootcamp, photoPath } = useSelector(state => state.publisher);
	const dispatch = useDispatch();
	const alert = useAlert("publisher", updatePublisher);
	const loading = useLoading("publisher");

	useLayoutEffect(() => {
		if (!bootcamp) {
			dispatch(getPublisherBootcamp());
			loaded = true;
		}

		return () => (loaded = false);
		//eslint-disable-next-line
	}, []);

	if (loading) return <main className="main-manage-bootcamp">{loading}</main>;

	if (alert) return <Redirect to="/bootcamps" />;

	if (!bootcamp && loaded) return <Redirect to="/publisher/create-bootcamp" />;

	const { name, description, housing, jobAssistance, jobGuarantee, acceptGi, courses } = bootcamp || {};

	const averageCost = courses?.length ? (courses.reduce((sum, c) => (sum += c.tuition), 0) / courses.length).toFixed(2) : 0;

	const getIcon = a => (a ? <i className="fas fa-check green"></i> : <i className="fas fa-times red"></i>);

	return (
		<main className="main-manage-bootcamp">
			<section className="bootcamp-dtls">
				<h1>{name}</h1>
				{photoPath && <Image {...{ src: `${photoPath}` }} />}
				<p>{description}</p>

				<div>
					<div>Housing: {getIcon(housing)}</div>
					<div>Job Assistance: {getIcon(jobAssistance)}</div>
					<div>Job Guarantee: {getIcon(jobGuarantee)}</div>
					<div>GI Bill Accepted: {getIcon(acceptGi)}</div>
				</div>

				<div>{`Average course cost: $${averageCost}`}</div>

				{courses &&
					courses.map(c => (
						<div key={c._id} className="bootcamp-courses">
							<h2>{c.title}</h2>
							<h3>Duration: {c.weeks} weeks</h3>

							<p>{c.description}</p>

							<div>
								<div>Cost: ${c.tuition}</div>
								<div>Proficiency Level: {c.minimumSkill[0].toUpperCase() + c.minimumSkill.slice(1)}</div>
								<div>Scholarship Available: {getIcon(c.scholarshipAvailable)}</div>
							</div>
						</div>
					))}
			</section>
			<div className="bootcamp-links">
				<Link to={`/publisher/edit-bootcamp`}>Edit Bootcamp</Link>
				<Link to={`/publisher/courses/manage`}>Manage Courses</Link>
			</div>
		</main>
	);
};

export default ManageBootcamp;
