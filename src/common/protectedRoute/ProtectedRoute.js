import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, ...rest }) => {
	const auth = useSelector(state => state.auth);

	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.session === "active" ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/",
							state: { from: location }
						}}
					/>
				)
			}
		/>
	);
};

export default ProtectedRoute;
