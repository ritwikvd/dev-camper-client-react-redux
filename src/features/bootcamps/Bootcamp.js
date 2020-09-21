import React, { useLayoutEffect } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBootcamp, updateMisc } from "../miscSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const Bootcamp = () => {
	const { id } = useParams();
	const { data } = useSelector(state => state.misc);
	const dispatch = useDispatch();
	const alert = useAlert("misc", updateMisc);
	const loading = useLoading("misc");

	useLayoutEffect(() => {
		dispatch(getBootcamp({ id }));
		//eslint-disable-next-line
	}, []);

	const { name, description, averageRating, housing, jobAssistance, jobGuarantee, acceptGi, courses, photo } = data;

	const averageCost = courses?.length ? (courses.reduce((sum, c) => (sum += c.tuition), 0) / courses.length).toFixed(2) : 0;

	const getIcon = a => (a ? <i className="fas fa-check green"></i> : <i className="fas fa-times red"></i>);

	if (loading) return <main className="main-bootcamp">{loading}</main>;

	if (alert) return <Redirect to="/bootcamps" />;

	return (
		<main className="main-bootcamp">
			<section className="bootcamp-dtls">
				<h1>{name}</h1>
				{photo && <img alt="" src={`${process.env.REACT_APP_API}/uploads/${photo}`} />}
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

			<div className="bootcamp-rating">
				<div>Average Rating: {averageRating ? <span className="bootcamp-avg-rating">{Math.round(averageRating)}</span> : "N/A"}</div>

				<Link
					to={{
						pathname: `/bootcamps/${id}/reviews`,
						state: { name }
					}}>
					Read Reviews
				</Link>
			</div>
		</main>
	);
};

export default Bootcamp;
