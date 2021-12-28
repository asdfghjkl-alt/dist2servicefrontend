import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";

import RestrictedRoute from "./components/Routes/RestrictedRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";

import AddLocation from "./components/Admin/AddLocation";
import Distance2Home from "./components/Distance2Home";
import D2HNavbar from "./components/D2HNavbar";
import D2HFooter from "./components/D2HFooter";
import Login from "./components/User/Login";
import Signup from "./components/User/Signup";
import AddCategory from "./components/Admin/AddCategory";
import Users from "./components/User/Users";
import { AuthProvider } from "./auth-context";
import { LocationProvider } from "./location-context";

function App() {
	const localStorage_myRadius = "distance2homeRadius";
	const localStorage_myCategory = "category";
	const [radius, setRadius] = useState(
		localStorage.getItem(localStorage_myRadius) || 5 // default to 5km, unless set by user previously
	);

	const [category, setCategory] = useState(
		localStorage.getItem(localStorage_myCategory) || "Chinese Churches"
	);

	const [selectedMarker, setSelectedMarker] = useState(null);

	return (
		<AuthProvider>
			<LocationProvider>
				<Router>
					<D2HNavbar
						setRadius={setRadius}
						setCategory={setCategory}
						localStorage_myRadius={localStorage_myRadius}
						localStorage_myCategory={localStorage_myCategory}
						setSelectedMarker={setSelectedMarker}
						selectedMarker={selectedMarker}
					/>
					<div className="d2hContent">
						<Switch>
							<Route exact path="/">
								<Distance2Home
									cRadius={Number(radius) * 1000}
									category={category}
									selectedMarker={selectedMarker}
									setSelectedMarker={setSelectedMarker}
								/>
							</Route>
							<RestrictedRoute exact path="/login" component={Login} />
							<RestrictedRoute exact path="/signup" component={Signup} />
							<ProtectedRoute
								exact
								path="/addlocation"
								component={AddLocation}
							/>
							<ProtectedRoute
								exact
								path="/addcategory"
								component={AddCategory}
							/>
							<ProtectedRoute exact path="/editusers" component={Users} />
							<Redirect to="/" />
						</Switch>
					</div>
					<D2HFooter />
				</Router>
			</LocationProvider>
		</AuthProvider>
	);
}

export default App;
