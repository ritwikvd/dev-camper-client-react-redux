import React, { lazy, memo, Suspense, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import useErrorBoundary from "use-error-boundary";
import Header from "../common/header/Header";
import ProtectedRoute from "../common/protectedRoute/ProtectedRoute";

const login = import("../features/auth/Login");
const register = import("../features/auth/Register");
const resetP = import("../features/auth/ResetPassword");
const newP = import("../features/auth/NewPassword");
const userR = import("../features/user/UserReviews");
const editR = import("../features/user/EditUserReview");
const account = import("../features/user/Account");
const updateP = import("../features/user/UpdatePassword");
const manageB = import("../features/publisher/ManageBootcamp");
const createB = import("../features/publisher/CreateBootcamp");
const editB = import("../features/publisher/EditBootcamp");
const manageC = import("../features/publisher/courses/ManageCourses");
const createC = import("../features/publisher/courses/CreateCourse");
const editC = import("../features/publisher/courses/EditCourse");
const bootcamps = import("../features/bootcamps/Bootcamps");
const bootcamp = import("../features/bootcamps/Bootcamp");
const bootcampR = import("../features/bootcamps/BootcampReviews");
const createR = import("../features/bootcamps/CreateBootcampReview");

const WrappedComponent = memo(({ c, p, r, e }) => {
	const C = lazy(() => c);
	const R = r ? Route : ProtectedRoute;

	return (
		<R exact={e || false} path={p}>
			<Suspense fallback={null}>
				<C />
			</Suspense>
		</R>
	);
});

const App = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	const { ErrorBoundary, didCatch, error } = useErrorBoundary();

	didCatch && console.error(error);

	if (didCatch)
		return (
			<main className="main-login">
				<p className="loading align-center">Oops, something went wrong</p>
			</main>
		);

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
					{/* Auth Routes */}
					<WrappedComponent {...{ c: login, p: "/", r: true, e: true }} />
					<WrappedComponent {...{ c: register, p: "/register", r: true }} />
					<WrappedComponent {...{ c: resetP, p: "/reset-password", r: true }} />
					<WrappedComponent {...{ c: newP, p: "/new-password", r: true }} />

					{/* User Routes */}
					<WrappedComponent {...{ c: userR, p: "/reviews", e: true }} />
					<WrappedComponent {...{ c: editR, p: "/reviews/:id" }} />
					<WrappedComponent {...{ c: account, p: "/account", e: true }} />
					<WrappedComponent {...{ c: updateP, p: "/account/update-password" }} />

					{/* Publisher Routes */}
					<WrappedComponent {...{ c: manageB, p: "/publisher/manage" }} />
					<WrappedComponent {...{ c: createB, p: "/publisher/create-bootcamp" }} />
					<WrappedComponent {...{ c: editB, p: "/publisher/edit-bootcamp" }} />
					<WrappedComponent {...{ c: manageC, p: "/publisher/courses/manage" }} />
					<WrappedComponent {...{ c: createC, p: "/publisher/courses/create" }} />
					<WrappedComponent {...{ c: editC, p: "/publisher/courses/:courseID/edit" }} />

					{/* Bootcamp Routes */}
					<WrappedComponent {...{ c: bootcamps, p: "/bootcamps", e: true }} />
					<WrappedComponent {...{ c: bootcamp, p: "/bootcamps/:id", e: true }} />
					<WrappedComponent {...{ c: bootcampR, p: "/bootcamps/:id/reviews" }} />
					<WrappedComponent {...{ c: createR, p: "/bootcamps/:id/create-review" }} />
				</Router>
			</ErrorBoundary>
		</div>
	);
};

export default App;
