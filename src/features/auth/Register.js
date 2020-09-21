import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { handleLoginOrRegistration, updateAuth } from "./authSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const Register = () => {
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");

	const auth = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const alert = useAlert("auth", updateAuth);
	const loading = useLoading("auth");

	const handleSubmit = e => {
		e.preventDefault();
		if (password.length < 6) return dispatch(updateAuth({ alert: "Your password needs to contain atleast 6 characters" }));
		if (password !== confirm) return dispatch(updateAuth({ alert: "Your passwords need to match" }));
		if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return dispatch(updateAuth({ alert: "Please enter a valid email" }));

		dispatch(handleLoginOrRegistration({ name, role, email, password }));
	};

	if (loading) return <main className="main-reg">{loading}</main>;

	if (auth.session === "active") return <Redirect to={"/bootcamps"} />;

	return (
		<main className="main-reg">
			<form onSubmit={handleSubmit} className="form-reg">
				<div className="alert-container align-center">
					<h1>Registration</h1>
					{alert && <div>{alert}</div>}
				</div>

				<input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
				<input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
				<input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
				<input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required />

				<select name="role" value={role} onChange={e => setRole(e.target.value)} required>
					<option value="">--Select a role--</option>
					<option value="user">User</option>
					<option value="publisher">Publisher</option>
				</select>
				<button type="submit">Submit</button>
			</form>
		</main>
	);
};

export default Register;
