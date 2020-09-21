import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { handleAccountUpdate, updateAuth } from "../auth/authSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const Account = () => {
	const { name, email } = useSelector(state => state.auth);
	const alert = useAlert("auth", updateAuth);
	const loading = useLoading("auth");
	const dispatch = useDispatch();

	const [username, setUsername] = useState(name);
	const [usermail, setUsermail] = useState(email);

	const handleSubmit = e => {
		e.preventDefault();
		if (name === username && email === usermail) return dispatch(updateAuth({ alert: "Update something to save" }));
		if (!usermail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
			return dispatch(updateAuth({ alert: "Please enter a valid email" }));

		dispatch(handleAccountUpdate({ name: username, email: usermail }));
	};

	if (loading) return <main className="main-account-dtls">{loading}</main>;

	return (
		<main className="main-account-dtls">
			<form onSubmit={handleSubmit} className="form-account-dtls">
				<div className="alert-container align-center">
					<h1>Account Details</h1>
					{alert && <div>{alert}</div>}
				</div>
				<input type="text" placeholder="Name" value={username} onChange={e => setUsername(e.target.value)} />
				<input type="text" placeholder="Email" value={usermail} onChange={e => setUsermail(e.target.value)} />
				<button type="submit">Save</button>
				<div className="align-center">
					<Link to="/account/update-password">Update Password</Link>
				</div>
			</form>
		</main>
	);
};

export default Account;
