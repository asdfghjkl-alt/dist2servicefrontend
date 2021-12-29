import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";
const LocationContext = React.createContext();

function LocationProvider(props) {
	const auth = useContext(AuthContext);
	const [locations, setLocations] = useState([]);
	const [homeAddress, setHomeAddress] = useState(
		JSON.parse(localStorage.getItem("distance2homeAddress")) || null
	);

	const searchForData = useCallback(async () => {
		try {
			let resExs = await axios.get(
				process.env.REACT_APP_BACKEND_URL + "locations"
			);
			setLocations(resExs.data);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		searchForData();
	}, [auth.login, auth.token, auth.isLoggedIn, searchForData]);

	return (
		<LocationContext.Provider
			value={{
				locations: locations,
				searchForData: searchForData,
				homeAddress: homeAddress,
				setHomeAddress: setHomeAddress,
			}}
		>
			{props.children}
		</LocationContext.Provider>
	);
}

var LocationConsumer = LocationContext.Consumer;

export { LocationProvider, LocationConsumer, LocationContext };
