import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, ...rest }) => {
	const session = useSelector(state => state.auth.session);

	return (
		<Route
			{...rest}
			render={({ location }) =>
				session === "active" ? (
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
