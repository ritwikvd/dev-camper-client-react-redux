import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { resetPassword, updateMisc } from "../miscSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const ResetPassword = () => {
	const [email, setEmail] = useState("");

	const {
		data: { resetToken }
	} = useSelector(state => state.misc);
	const dispatch = useDispatch();
	const alert = useAlert("misc", updateMisc);
	const loading = useLoading("misc");

	const handleSubmit = async e => {
		e.preventDefault();
		if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return dispatch(updateMisc({ alert: "Please enter a valid email" }));
		dispatch(resetPassword({ email }));
	};

	if (resetToken)
		return (
			<Redirect
				to={{
					pathname: "/new-password",
					state: { resetToken, email }
				}}
			/>
		);

	if (loading) return <main className="main-reset">{loading}</main>;

	return (
		<main className="main-reset">
			<form onSubmit={handleSubmit} className="form-reset">
				<div className="alert-container align-center">
					{"Enter your email"}
					{alert && <div>{alert}</div>}
				</div>

				<input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
			</form>
		</main>
	);
};

export default ResetPassword;
