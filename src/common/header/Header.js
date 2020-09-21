import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../../features/auth/authSlice";
import { useHistory, Link } from "react-router-dom";

const Header = ({ menuOpen, setMenuOpen }) => {
	const session = useSelector(state => state.auth.session);
	const dispatch = useDispatch();
	const history = useHistory();

	const [headerFixed, setHeaderFixed] = useState(false);

	const interval = useRef();

	const logout = () => {
		clearInterval(interval.current);
		dispatch(handleLogout({ email: "", session: "inactive", name: "" }));
		history.push("/");
	};

	useEffect(() => {
		document.addEventListener("scroll", () => {
			if (!window.pageYOffset) return setHeaderFixed(false);
			setHeaderFixed(true);
		});
	}, []);

	useEffect(() => {
		if (session === "active") {
			interval.current = setInterval(() => localStorage.getItem("TOKEN") || logout(), 2000);
		}
	}, [session]);

	const getHeaderElements = () => {
		if (session !== "active")
			return (
				<ul className="nav-links">
					<li>
						<Link to="/register">Register</Link>
					</li>
					<li>
						<Link to="/">Login</Link>
					</li>
				</ul>
			);

		return (
			<>
				<ul className="nav-links">
					<li className="nav-links-item">
						<div
							className="nav-menu-toggler"
							onClick={e => {
								setMenuOpen(!menuOpen);
								e.preventDefault();
							}}>
							<span className={`${menuOpen ? "open" : ""} cursor-pointer nav-account`}>Account</span>
						</div>

						<ul className={`${menuOpen ? "" : "none"} nav-account-links`} onClick={e => e.preventDefault()}>
							{["publisher", "admin"].includes(localStorage.getItem("ROLE")) ? (
								<li>
									<Link to="/publisher/manage">Manage Bootcamp</Link>
								</li>
							) : null}

							<li>
								<Link to="/reviews">Manage Reviews</Link>
							</li>

							<li>
								<Link to="/account">Manage Account</Link>
							</li>
						</ul>
					</li>

					<li className="nav-links-item" onClick={logout}>
						<a href="#!">Logout</a>
					</li>
				</ul>
			</>
		);
	};

	return (
		<header>
			<nav className={headerFixed ? "pos-fixed nav-shadow" : ""}>
				<Link to="/bootcamps">
					<i className="fas fa-code hover"></i>
				</Link>
				{getHeaderElements()}
			</nav>
		</header>
	);
};

export default Header;
