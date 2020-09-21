import React, { useState } from "react";
import { BrowserRouter as Router, Route as R, Switch } from "react-router-dom";
import useErrorBoundary from "use-error-boundary";
import "../styles/main.scss";
import Header from "../common/header/Header";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ResetPassword from "../features/auth/ResetPassword";
import NewPassword from "../features/auth/NewPassword";
import CreateBootcamp from "../features/publisher/CreateBootcamp";
import UserReviews from "../features/user/UserReviews";
import EditUserReview from "../features/user/EditUserReview";
import Account from "../features/user/Account";
import UpdatePassword from "../features/user/UpdatePassword";
import Bootcamps from "../features/bootcamps/Bootcamps";
import Bootcamp from "../features/bootcamps/Bootcamp";
import BootcampReviews from "../features/bootcamps/BootcampReviews";
import CreateBootcampReview from "../features/bootcamps/CreateBootcampReview";
import ManageBootcamp from "../features/publisher/ManageBootcamp";
import EditBootcamp from "../features/publisher/EditBootcamp";
import ManageCourses from "../features/publisher/courses/ManageCourses";
import CreateCourse from "../features/publisher/courses/CreateCourse";
import EditCourse from "../features/publisher/courses/EditCourse";
import PR from "../common/protectedRoute/ProtectedRoute";

const App = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	const { ErrorBoundary, didCatch, error } = useErrorBoundary();

	didCatch && console.error(error);

	if (didCatch) return <p>Oops, something went wrong.</p>;

	return (
		<div
			className="wrapper"
			onClick={e => {
				if (e.defaultPrevented) return;
				setMenuOpen(false);
			}}>
			<ErrorBoundary>
				<Router>
					<Header {...{ menuOpen, setMenuOpen }} />
					<Switch>
						{/* Auth Routes */}
						<R exact path="/">
							<Login />
						</R>
						<R path="/register">
							<Register />
						</R>
						<R path="/reset-password">
							<ResetPassword />
						</R>
						<R path="/new-password">
							<NewPassword />
						</R>

						{/* User Routes */}
						<PR path="/reviews/:id">
							<EditUserReview />
						</PR>
						<PR path="/reviews">
							<UserReviews />
						</PR>
						<PR path="/account/update-password">
							<UpdatePassword />
						</PR>
						<PR path="/account">
							<Account />
						</PR>

						{/* Publisher Routes */}
						<PR path="/publisher/manage">
							<ManageBootcamp />
						</PR>
						<PR path="/publisher/create-bootcamp">
							<CreateBootcamp />
						</PR>
						<PR path="/publisher/edit-bootcamp">
							<EditBootcamp />
						</PR>
						<PR path="/publisher/courses/manage">
							<ManageCourses />
						</PR>
						<PR path="/publisher/courses/create">
							<CreateCourse />
						</PR>
						<PR path="/publisher/courses/:courseID/edit">
							<EditCourse />
						</PR>

						{/* Bootcamp Routes */}
						<PR path="/bootcamps/:id/reviews">
							<BootcampReviews />
						</PR>
						<PR path="/bootcamps/:id/create-review">
							<CreateBootcampReview />
						</PR>
						<PR path="/bootcamps/:id">
							<Bootcamp />
						</PR>
						<PR path="/bootcamps">
							<Bootcamps />
						</PR>
					</Switch>
				</Router>
			</ErrorBoundary>
		</div>
	);
};

export default App;
