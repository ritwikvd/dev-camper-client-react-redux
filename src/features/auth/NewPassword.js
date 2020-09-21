import React, { useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handlePasswordReset, updateAuth } from "./authSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const NewPassword = () => {
	const [password, setPass] = useState("");
	const [confirm, setConfirm] = useState("");

	const {
		state: { resetToken, email }
	} = useLocation();
	const dispatch = useDispatch();
	const session = useSelector(state => state.auth.session);
	const alert = useAlert("auth", updateAuth);
	const loading = useLoading("auth");

	const handleSubmit = e => {
		e.preventDefault();
		if (password !== confirm) return dispatch(updateAuth({ alert: "Your passwords need to match" }));
		if (password.length < 6) return dispatch(updateAuth({ alert: "Your password needs to contain atleast 6 characters" }));
		dispatch(handlePasswordReset({ password, resetToken, email }));
	};

	if (loading) return <main className="main-new">{loading}</main>;

	if (session === "active") return <Redirect to={"/bootcamps"} />;

	return (
		<main className="main-new">
			<form onSubmit={handleSubmit} className="form-new">
				<div className="alert-container align-center">
					{"Reset your password"}
					{alert && <div>{alert}</div>}
				</div>
				<input type="password" placeholder="Enter new password" value={password} onChange={e => setPass(e.target.value)} required />
				<input type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
				<button type="submit">Submit</button>
			</form>
		</main>
	);
};

export default NewPassword;
