import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const BootcampDetails = ({ caller, display }) => {
	const { bootcamp, photoPath } = useSelector(state => state.publisher);
	const dispatch = useDispatch();

	const [name, setName] = useState(bootcamp?.name || "");
	const [address, setAddress] = useState(bootcamp?.address || "");
	const [number, setNumber] = useState(bootcamp?.phone || "");
	const [email, setEmail] = useState(bootcamp?.email || "");
	const [site, setSite] = useState(bootcamp?.website || "");
	const [desc, setDesc] = useState(bootcamp?.description || "");
	const [careers, setCareers] = useState(bootcamp?.careers || []);
	const [housing, setHousing] = useState(bootcamp?.housing || false);
	const [assistance, setAssistance] = useState(bootcamp?.jobAssistance || false);
	const [guarantee, setGuarantee] = useState(bootcamp?.jobGuarantee || false);
	const [bill, setBill] = useState(bootcamp?.acceptGi || false);
	const [file, setFile] = useState(photoPath || null);

	const handleSubmit = e => {
		e.preventDefault();
		dispatch(
			caller({
				name,
				address,
				email,
				phone: number,
				website: site,
				description: desc,
				careers,
				housing,
				jobAssistance: assistance,
				jobGuarantee: guarantee,
				acceptGi: bill,
				file
			})
		);
	};

	if (display === "Update" && !bootcamp) return <Redirect to="/publisher/manage" />;

	return (
		<form onSubmit={handleSubmit} className="form-bootcamp-dtls">
			<section className="bootcamp-dtls-location">
				<h1>Location and Contact</h1>
				<input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
				<input type="text" placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)} required />
				<input type="text" placeholder="Contact Number" value={number} onChange={e => setNumber(e.target.value)} required />
				<input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
				<input type="text" placeholder="Website" value={site} onChange={e => setSite(e.target.value)} required />
			</section>
			<section className="bootcamp-dtls-other">
				<h1>Other Information</h1>
				<textarea
					className="bootcamp-dtls-text"
					cols="30"
					rows="10"
					placeholder="Description"
					value={desc}
					onChange={e => setDesc(e.target.value)}
					required
				/>

				<select
					name="careers"
					className="bootcamp-dtls-select"
					multiple
					value={careers}
					onChange={e =>
						setCareers(
							Array.from(e.target.options)
								.filter(a => a.selected)
								.map(a => a.value)
						)
					}
					required>
					<optgroup label="Select Relevant Careers">
						<option value="Web Development">Web Development</option>
						<option value="Mobile Development">Mobile Development</option>
						<option value="UI/UX">UI/UX</option>
						<option value="Data Science">Data Science</option>
						<option value="Business">Business</option>
						<option value="Other">Other</option>
					</optgroup>
				</select>

				<label htmlFor="housing">
					<input type="checkbox" id="housing" checked={housing} onChange={e => setHousing(e.target.checked)} /> Housing
				</label>
				<label htmlFor="job-assistance">
					<input type="checkbox" id="job-assistance" checked={assistance} onChange={e => setAssistance(e.target.checked)} /> Job Assistance
				</label>
				<label htmlFor="job-guarantee">
					<input type="checkbox" id="job-guarantee" checked={guarantee} onChange={e => setGuarantee(e.target.checked)} /> Job Guarantee
				</label>
				<label htmlFor="gi-bill">
					<input type="checkbox" id="gi-bill" checked={bill} onChange={e => setBill(e.target.checked)} /> Accepts GI Bill
				</label>

				{file && <img src={file} alt="" />}
				<div className="mb">
					<label htmlFor="">Add a Photo</label> <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" />
				</div>
			</section>

			<button type="submit">{display}</button>
		</form>
	);
};

export default BootcampDetails;
