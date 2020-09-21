import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Redirect, Link } from "react-router-dom";
import { handleLoginOrRegistration, updateAuth } from "./authSlice";
import useAlert from "../../common/utils/useAlert";
import useLoading from "../../common/utils/useLoading";

const Login = () => {
	const [email, setEmail] = useState("admin@gmail.com");
	const [password, setPassword] = useState("123456");

	const auth = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const alert = useAlert("auth", updateAuth);
	const loading = useLoading("auth");
	const location = useLocation();

	const handleLoginSubmit = e => {
		e.preventDefault();
		dispatch(handleLoginOrRegistration({ email, password }));
	};

	if (loading) return <main className="main-login">{loading}</main>;

	if (auth.session === "active") {
		const pathname = location?.state?.from?.pathname;

		return <Redirect to={pathname || "/bootcamps"} />;
	}

	return (
		<main className="main-login">
			<form onSubmit={handleLoginSubmit} className="form-login">
				<div className="alert-container align-center">
					<h1>Welcome to Dev Camper!</h1>
					{alert && <div>{alert}</div>}
				</div>

				<input className="login-email" type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />

				<input
					className="login-pass"
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>

				<button className="login-submit cursor-pointer" type="submit">
					Login
				</button>

				<div className="align-center">
					<Link to="/reset-password">Reset Password</Link>
				</div>
			</form>
		</main>
	);
};

export default Login;
