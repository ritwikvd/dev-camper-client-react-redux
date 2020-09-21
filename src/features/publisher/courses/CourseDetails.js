import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const CourseDetails = ({ caller, courseID = null, display }) => {
	const { bootcamp } = useSelector(state => state.publisher);
	const dispatch = useDispatch();

	const { courses } = bootcamp || {};

	const course = (courses || []).find(a => a._id === courseID);

	const [title, setTitle] = useState(course?.title || "");
	const [description, setDesc] = useState(course?.description || "");
	const [weeks, setDuration] = useState(course?.weeks || "");
	const [tuition, setCost] = useState(course?.tuition || "");
	const [minimumSkill, setSkill] = useState(course?.minimumSkill || "");
	const [scholarshipAvailable, setAid] = useState(course?.scholarshipAvailable || false);

	const handleSubmit = e => {
		e.preventDefault();
		dispatch(caller({ title, description, weeks, tuition, minimumSkill, scholarshipAvailable, courseID }));
	};

	return (
		<form onSubmit={handleSubmit} className="form-course-dtls">
			<input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
			<input type="number" min="1" placeholder="Duration(in weeks)" value={weeks} onChange={e => setDuration(e.target.value)} required />
			<input type="number" min="1" placeholder="Tuition" value={tuition} onChange={e => setCost(e.target.value)} required />
			<select name="skill" value={minimumSkill} onChange={e => setSkill(e.target.value)} required>
				<option value="" disabled>
					Select a minimum skill level
				</option>
				<option value="beginner">Beginner</option>
				<option value="intermediate">Intermediate</option>
				<option value="advanced">Advanced</option>
			</select>
			<textarea
				name="description"
				cols="30"
				rows="10"
				placeholder="Description"
				value={description}
				onChange={e => setDesc(e.target.value)}
				required
			/>
			<label htmlFor="sch">
				<input type="checkbox" id="sch" checked={scholarshipAvailable} onChange={e => setAid(e.target.checked)} /> Scholarship Available
			</label>
			<button type="submit">{display}</button>
		</form>
	);
};

export default CourseDetails;
