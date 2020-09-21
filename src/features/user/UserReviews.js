import React, { useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";
import { Link } from "react-router-dom";
import { handleReviewRetrieval, updateMisc, deleteReview } from "../miscSlice";

const UserReviews = () => {
	const { data } = useSelector(state => state.misc);
	const dispatch = useDispatch();
	const alert = useAlert("misc", updateMisc);
	const loading = useLoading("misc");

	useLayoutEffect(() => {
		dispatch(handleReviewRetrieval());
		//eslint-disable-next-line
	}, []);

	if (loading) return <main className="main-user-reviews">{loading}</main>;

	return (
		<main className="main-user-reviews">
			<div className="alert-container user-review-alert">{alert && <div>{alert}</div>}</div>
			<section className="user-reviews-container">
				{data?.length ? (
					data.map(r => (
						<div key={r._id} className="user-review">
							<div>
								<div className="user-review-title">{r.bootcamp.name}</div>
								<div>{r.title}</div>
								<div>Rating: {r.rating}</div>
							</div>
							<div className="user-review-links">
								<Link to={`/reviews/${r._id}`}>
									<i className="fas fa-pencil-alt green" />
								</Link>
								<button onClick={() => dispatch(deleteReview({ id: r._id }))}>
									<i className="fas fa-times red" />
								</button>
							</div>
						</div>
					))
				) : (
					<div className="user-reviews-msg">You don't have any reviews</div>
				)}
			</section>
		</main>
	);
};

export default UserReviews;
