import React from "react";
import { Route, Redirect } from "react-router-dom";

const RestrictedRoute = ({ component: Component, ...rest }) => {
	const localData = JSON.parse(localStorage.getItem("userData"));
	let admin = false;
	if (localData) {
		admin = localData.admin;
	}

	return (
		// restricted = false meaning public route
		// restricted = true meaning restricted route
		<Route
			{...rest}
			render={(props) =>
				admin ? <Component {...props} /> : <Redirect to="/" />
			}
		/>
	);
};

export default RestrictedRoute;
