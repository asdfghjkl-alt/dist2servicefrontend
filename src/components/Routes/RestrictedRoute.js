import React from "react";
import { Route, Redirect } from "react-router-dom";

const RestrictedRoute = ({ component: Component, ...rest }) => {
	return (
		// restricted = false meaning public route
		// restricted = true meaning restricted route
		<Route
			{...rest}
			render={(props) =>
				localStorage.getItem("userData") ? (
					<Redirect to="/" />
				) : (
					<Component {...props} />
				)
			}
		/>
	);
};

export default RestrictedRoute;
