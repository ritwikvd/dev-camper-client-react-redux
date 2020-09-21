import React, { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";
import { editReview, updateMisc } from "../miscSlice";

const EditUserReview = () => {
	const { id } = useParams();
	const { data } = useSelector(state => state.misc);
	const dispatch = useDispatch();
	const alert = useAlert("misc", updateMisc);
	const loading = useLoading("misc");

	const review = (Array.isArray(data) ? data : []).find(a => a._id === id);

	const { title: t, rating: r, text: x, bootcamp, _id } = review || {};

	const [title, setTitle] = useState(t);
	const [rating, setRating] = useState(r);
	const [text, setText] = useState(x);

	if (!review || data.edited) return <Redirect to="/reviews" />;

	const handleSubmit = e => {
		e.preventDefault();
		if (title + rating + text === t + r + x) return dispatch(updateMisc({ alert: "No updates" }));
		dispatch(editReview({ title, rating, text, reviewID: _id }));
	};

	if (loading) return <main className="main-create-review">{loading}</main>;

	return (
		<main className="main-create-review">
			<form onSubmit={handleSubmit} className="form-create-review">
				<div className="alert-container">
					<h1>Edit your review for {bootcamp.name}</h1>
					{alert && <div>{alert}</div>}
				</div>

				<input type="number" placeholder="Rating" value={rating} onChange={e => setRating(e.target.value)} min="1" max="10" required />
				<input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
				<textarea
					name="review"
					placeholder="Description"
					cols="30"
					rows="10"
					value={text}
					onChange={e => setText(e.target.value)}
					required
				/>
				<button type="submit">Update</button>
			</form>
		</main>
	);
};

export default EditUserReview;
