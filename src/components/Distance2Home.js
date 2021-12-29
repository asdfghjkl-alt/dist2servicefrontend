import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import {
	GoogleMap,
	useLoadScript,
	Marker,
	InfoWindow,
	Circle,
	Autocomplete,
} from "@react-google-maps/api";
import "./Distance2Home.css";
import { LocationContext } from "../location-context";

// const options = {
//   zoomControlOptions: {
//     position: window.google.maps.ControlPosition.RIGHT_CENTER, // ,
//     // ...otherOptions
//   },
// };
const libraries = ["places"];
const localStorage_homeAddr = "distance2homeAddress";
const localStorage_homeAddrStr = "distance2homeAddrStr";
const initLocation = {
	// Sydney CBD
	lat: -33.882938,
	lng: 151.200509,
};

export default function Distance2Home({
	cRadius,
	category,
	selectedMarker,
	setSelectedMarker,
}) {
	const exampleMapStyles = [
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
	];

	const locContext = useContext(LocationContext);

	const setHomeAddress = locContext.setHomeAddress;

	// refresh my Position when necessary
	const [mapCenter, setMapCenter] = useState(
		JSON.parse(localStorage.getItem(localStorage_homeAddr)) || initLocation
	);
	const [mapZoom, setMapZoom] = useState(11);
	const [mapBounds, setMapBounds] = useState(null);
	const [myPosition, setMyPosition] = useState(null);
	const [homeAddrStr, setHomeAddrStr] = useState(
		JSON.parse(localStorage.getItem(localStorage_homeAddrStr)) || null
	);
	const [markers, setMarkers] = useState([]);
	const [distanceToHome, setDistanceToHome] = useState(null);

	const refreshMyPosition = useCallback(async () => {
		navigator.geolocation.getCurrentPosition((gotPosition) => {
			const _myPos = {
				lat: gotPosition.coords.latitude,
				lng: gotPosition.coords.longitude,
			};
			setMyPosition(_myPos);

			if (locContext.homeAddress != null) {
				const _dist = haversine_distance(_myPos, locContext.homeAddress);
				const _distColor = _dist * 1000 > cRadius ? "red" : "green";
				setDistanceToHome({
					distance: _dist,
					distColor: _distColor,
				});
			}
		});
	}, [cRadius, locContext.homeAddress]);

	const searchForData = useCallback(async () => {
		try {
			let resExs = await axios.get(
				process.env.REACT_APP_BACKEND_URL + "locations/"
			);
			setMarkers(resExs.data);
			const interval = setInterval(async () => {
				refreshMyPosition();
			}, 20 * 1000);
			return () => {
				clearInterval(interval);
			};
		} catch (error) {
			console.error(error);
		}
	}, [refreshMyPosition]);

	useEffect(() => {
		searchForData();
	}, [searchForData, refreshMyPosition]);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});
	// const [circleRadius, setCircleRadius] = useState(5000);

	useEffect(() => {
		// display my Positon when web starts
		function handleGotPosition(gotPosition) {
			const _myPos = {
				lat: gotPosition.coords.latitude,
				lng: gotPosition.coords.longitude,
			};
			setMyPosition(_myPos);

			if (locContext.homeAddress == null) {
				// if user hasn't entered home address, map is centered at _myPos, also setMapBounds around _myPos
				setMapCenter(_myPos);
				setMapBounds({
					// a degree in latitude is 111km
					// a degree in longitude is 85km at 40deg latitude
					// so this bounds to about 11km E,N,S,W
					east: _myPos.lng + 0.14,
					north: _myPos.lat + 0.1,
					south: _myPos.lat - 0.1,
					west: _myPos.lng - 0.14,
				});
			} else {
				// if home address exists, calculate my distance to home and display results
				const _dist = haversine_distance(_myPos, locContext.homeAddress);
				const _distColor = _dist * 1000 > cRadius ? "red" : "green";
				setDistanceToHome({
					distance: _dist,
					distColor: _distColor,
				});
			}
		}

		navigator.geolocation.getCurrentPosition(handleGotPosition);
	}, [cRadius, locContext.homeAddress]);

	useEffect(() => {
		// auto set map zoom level according to Radius setting
		if (cRadius >= 10000) {
			setMapZoom(11);
		} else if (cRadius >= 5000) {
			setMapZoom(12);
		} else if (cRadius >= 2000) {
			setMapZoom(13);
		} else {
			setMapZoom(14);
		}
	}, [cRadius]);

	useEffect(() => {
		// initially when there is no host position or locContext.homeAddress, setMapBounds to initial  mapCenter = initLocation (Sydney CBD)
		// when user entered locContext.homeAddress as new mapCenter, setMapBounds around the new mapCenter
		setMapBounds({
			// a degree in latitude is 111km
			// a degree in longitude is 85km at 40deg latitude
			// so this bounds to about 11km E,N,S,W
			east: mapCenter.lng + 0.14,
			north: mapCenter.lat + 0.1,
			south: mapCenter.lat - 0.1,
			west: mapCenter.lng - 0.14,
		});
	}, [mapCenter]);

	// Search Box:
	const [searchBox, setSearchBox] = useState(null);
	const onLoadAddress = (ref) => setSearchBox(ref);
	const onPlaceChanged = () => {
		if (searchBox !== null) {
			const _place = searchBox.getPlace();
			// const _geo = searchBox.getPlace().geometry.location;
			const _homePos = {
				lat: _place.geometry.location.lat(),
				lng: _place.geometry.location.lng(),
			};
			setHomeAddress(_homePos);
			setMapCenter(_homePos);
			localStorage.setItem(localStorage_homeAddr, JSON.stringify(_homePos));
			setHomeAddrStr(_place.formatted_address);
			localStorage.setItem(
				localStorage_homeAddrStr,
				JSON.stringify(_place.formatted_address)
			);

			if (myPosition) {
				const _dist = haversine_distance(myPosition, _homePos);
				const _distColor = _dist * 1000 > cRadius ? "red" : "green";
				setDistanceToHome({
					distance: _dist,
					distColor: _distColor,
				});
			}
		} else {
			console.log("Autocomplete is not loaded yet!");
		}
	};

	function haversine_distance(pos1, pos2) {
		// calculate the distance between two pos1 and pos2
		// var R = 3958.8; // Radius of the Earth in miles
		let R = 6371.071; // Radius of the Earth in kilometers
		var rlat1 = pos1.lat * (Math.PI / 180); // Convert degrees to radians
		var rlat2 = pos2.lat * (Math.PI / 180); // Convert degrees to radians
		var difflat = rlat2 - rlat1; // Radian difference (latitudes)
		var difflon = (pos2.lng - pos1.lng) * (Math.PI / 180); // Radian difference (longitudes)
		var d =
			2 *
			R *
			Math.asin(
				Math.sqrt(
					Math.sin(difflat / 2) * Math.sin(difflat / 2) +
						Math.cos(rlat1) *
							Math.cos(rlat2) *
							Math.sin(difflon / 2) *
							Math.sin(difflon / 2)
				)
			);
		return d;
	}

	// function handleSelect(event) {
	//   setCircleRadius(Number(event.target.value));
	// }

	const renderMap = () => {
		// wrapping to a function is useful in case you want to access 'window.google'
		// to eg. setup options or create latLng object, it won't be available otherwise
		// feel free to render directly if you don't need that
		// const onLoad = useCallback(function onLoad(mapInstance) {
		//   // do something with map Instance
		// });

		return (
			<GoogleMap
				mapContainerClassName="d2hMapClass"
				zoom={mapZoom}
				center={mapCenter}
				options={{
					disableDefaultUI: true,
					zoomControl: true,
					styles: exampleMapStyles,
				}}
			>
				<Autocomplete
					onLoad={onLoadAddress}
					onPlaceChanged={onPlaceChanged}
					fields={["geometry.location", "formatted_address"]}
					// restrictions={{ country: 'au' }}
					bounds={mapBounds}
				>
					<div className="search-wrapper">
						<form>
							<input
								type="text"
								className="search-box"
								placeholder={
									homeAddrStr || "🔍 Enter address to find Distance to Home"
								}
							/>
							<button className="close-icon" type="reset"></button>
						</form>
					</div>
				</Autocomplete>
				<button onClick={() => setHomeAddress(null)}>Delete</button>
				{locContext.homeAddress && homeAddrStr && (
					<Marker
						position={locContext.homeAddress}
						title={
							homeAddrStr.split(",")[0] +
							"\n" +
							homeAddrStr.split(",")[1] +
							"\n" +
							homeAddrStr.split(",")[2]
						}
						icon={{
							url: "img/icons8-home-64-orange.png",
							// size: { width: 30, height: 30 },
							// // origin: { width: 0, height: 0 },
							anchor: { x: 32, y: 32 },
							// scaledSize: { width: 50, height: 50 },
							labelOrigin: { x: 32, y: 68 },
						}}
						label={{
							text: homeAddrStr,
							color: "brown",
							// fontWeight: 'bold',
						}}
					>
						<Circle
							center={locContext.homeAddress}
							// center={myPosition}
							options={{
								strokeColor: "red",
								strokeOpacity: 0.8,
								strokeWeight: 2,
								fillColor: "#58D68D",
								fillOpacity: 0.35,
								clickable: false,
								draggable: false,
								editable: false,
								visible: true,
								radius: cRadius,
								zIndex: 1,
							}}
						/>
					</Marker>
				)}
				{markers.map((marker) => {
					if (marker.category === category) {
						return (
							<Marker
								position={marker}
								key={marker._id}
								zIndex={1}
								icon={{
									url: "img/marker-icon.png",
									anchor: { x: 32, y: 32 },
									labelOrigin: { x: 20, y: 50 },
								}}
								onClick={() => setSelectedMarker(marker)}
							></Marker>
						);
					}
				})}
				{myPosition && (
					<Marker
						position={myPosition}
						title="you are here"
						icon={
							distanceToHome && distanceToHome.distColor === "green"
								? {
										url: "img/icons8-walking-50-green.png",
										anchor: { x: 25, y: 25 },
								  }
								: {
										url: "img/icons8-walking-50-red.png",
										anchor: { x: 25, y: 25 },
								  }
						}
						zIndex={1}
					/>
				)}
				{selectedMarker ? (
					<InfoWindow
						position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
						key={selectedMarker._id}
						onCloseClick={() => {
							setSelectedMarker(null);
						}}
					>
						<div>
							<h3 className="title">{selectedMarker.english}</h3>
							<p>{selectedMarker.chinese}</p>
							<p href={selectedMarker.webpage}>
								<a
									href={selectedMarker.webpage}
									target="_blank"
									rel="noreferrer"
								>
									{selectedMarker.webpage}
								</a>
							</p>
							<p>{selectedMarker.phone}</p>
							<p>{selectedMarker.desc}</p>
							<p>{selectedMarker.chinesedesc}</p>
							<p>{selectedMarker.address}</p>
						</div>
					</InfoWindow>
				) : null}
			</GoogleMap>
		);
	};

	if (loadError) {
		return <div>Map cannot be loaded right now, sorry.</div>;
	}

	return isLoaded ? (
		renderMap()
	) : (
		<div className="spinner-border text-success" role="status">
			<span className="sr-only">Loading...</span>
		</div>
	);
}
