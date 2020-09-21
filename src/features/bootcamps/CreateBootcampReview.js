import React, { useState } from "react";
import { Redirect, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateMisc, submitReview } from "../miscSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const CreateBootcampReview = () => {
	const { id } = useParams();
	const { state } = useLocation();

	const {
		data: { submitted }
	} = useSelector(state => state.misc);
	const dispatch = useDispatch();
	const alert = useAlert("misc", updateMisc);
	const loading = useLoading("misc");

	const [title, setTitle] = useState("");
	const [rating, setRating] = useState("");
	const [text, setText] = useState("");

	const handleSubmit = e => {
		e.preventDefault();
		dispatch(submitReview({ id, body: { title, rating, text } }));
	};

	if (submitted) return <Redirect to={`/bootcamps/${id}/reviews`} />;

	if (loading) return <main className="main-create-review">{loading}</main>;

	return (
		<main className="main-create-review">
			<form onSubmit={handleSubmit} className="form-create-review">
				<div className="alert-container">
					<h1>Writing a review for {state?.name}</h1>
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
				<button type="submit">Create</button>
			</form>
		</main>
	);
};

export default CreateBootcampReview;
