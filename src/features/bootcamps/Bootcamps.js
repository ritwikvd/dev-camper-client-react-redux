import React, { useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { bootcampSelectors, handleRetrieval, updateBootcamps, handlePagination } from "./bootcampSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";
import Image from "../../common/image/Image";

const Bootcamps = () => {
	const bootcamps = useSelector(bootcampSelectors.selectEntities);
	const { total, page } = useSelector(state => state.bootcamps);
	const dispatch = useDispatch();

	const alert = useAlert("bootcamps", updateBootcamps);
	const loading = useLoading("bootcamps");

	const [miles, setMiles] = useState("");
	const [zip, setZip] = useState("");
	const [rating, setRating] = useState("");

	useLayoutEffect(() => {
		dispatch(handleRetrieval());
		//eslint-disable-next-line
	}, []);

	const handleSubmit = e => {
		e.preventDefault();

		if ((miles && !zip) || (zip && !miles))
			return dispatch(updateBootcamps({ alert: "Miles from and zip code need to be entered together" }));

		if (!miles && !zip && !rating) return dispatch(handleRetrieval());

		dispatch(handleRetrieval({ miles, zip, rating }));
	};

	return (
		<main className="main-bootcamps">
			<form onSubmit={handleSubmit} className="form-bootcamps">
				<div className="alert-container align-center">
					{"Search via distance and/or rating"}
					{alert && <div>{alert}</div>}
				</div>

				<input type="number" placeholder="Miles from" value={miles} onChange={e => setMiles(e.target.value)} />
				<input type="number" placeholder="Zipcode" value={zip} onChange={e => setZip(e.target.value)} />

				<select value={rating} onChange={e => setRating(e.target.value)}>
					<option value="">Rating</option>
					<option value="9">9+</option>
					<option value="8">8+</option>
					<option value="7">7+</option>
					<option value="6">6+</option>
					<option value="5">5+</option>
					<option value="4">4+</option>
					<option value="3">3+</option>
					<option value="2">2+</option>
					<option value="1">1+</option>
				</select>

				<button type="submit">Submit</button>
			</form>

			<div className="bootcamps-container">
				<div className="bootcamps">
					{loading || (
						<>
							{total ? null : <p className="align-center">No results found</p>}
							{Object.values(bootcamps).map(a => (
								<Entry key={a.id} {...{ camp: a }} />
							))}
						</>
					)}
				</div>

				<div className="bootcamps-pag">
					{Array.from({ length: Math.ceil((total > 5 ? total : 0) / 5) }).map((_, i) => (
						<button key={i} className={page === i + 1 ? "pag-active" : ""} onClick={() => dispatch(handlePagination({ page: i + 1 }))}>
							{i + 1}
						</button>
					))}
				</div>
			</div>
		</main>
	);
};

const Entry = ({ camp }) => {
	return (
		<div className="bootcamp">
			<Link to={`/bootcamps/${camp.id}`}>
				<Image {...{ src: `${process.env.REACT_APP_API}/uploads/${camp.photo}` }} />
			</Link>

			<div className="bootcamp-data">
				<h1>
					<Link to={`/bootcamps/${camp.id}`}>{camp.name}</Link>
				</h1>

				<div>{`Average Rating: ${camp.averageRating ? Math.round(camp.averageRating) : `N/A`}`}</div>

				<div>
					{camp.location?.city}, {camp.location?.state}
				</div>

				<div>{`Careers: ${camp.careers.join(", ")}`}</div>
			</div>
		</div>
	);
};

export default Bootcamps;
