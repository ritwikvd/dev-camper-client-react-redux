import React, { useLayoutEffect } from "react";
import { useParams, Link, useLocation, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBootcampReviews, updateMisc } from "../miscSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const BootcampReviews = () => {
	const { id } = useParams();
	const { state } = useLocation();
	const { data } = useSelector(state => state.misc);
	const dispatch = useDispatch();
	const alert = useAlert("misc", updateMisc);
	const loading = useLoading("misc");

	useLayoutEffect(() => {
		dispatch(getBootcampReviews({ id }));
		//eslint-disable-next-line
	}, []);

	if (loading) return <main className="main-reviews">{loading}</main>;

	if (alert) return <Redirect to="/bootcamps" />;

	return (
		<main className="main-reviews">
			<section className="bootcamp-reviews">
				{data.length ? (
					data.map(r => (
						<div key={r._id} className="review">
							<h1>{r.title}</h1>
							<div>Rating: {r.rating}</div>
							<p>{r.text}</p>
							<div className="reduce-opa">Written by {r.user.name}</div>
						</div>
					))
				) : (
					<div className="reviews-msg">{"No Reviews Yet"}</div>
				)}
			</section>
			<div className="reviews-links">
				<Link
					to={{
						pathname: `/bootcamps/${id}`,
						state: { name: state?.name }
					}}>
					Back to bootcamp
				</Link>
				<Link
					to={{
						pathname: `/bootcamps/${id}/create-review`,
						state: { name: state?.name }
					}}>
					Write a review
				</Link>
			</div>
		</main>
	);
};

export default BootcampReviews;
