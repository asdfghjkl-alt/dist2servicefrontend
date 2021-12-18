import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { LocationContext } from "../../location-context";
import { Form, Button } from "react-bootstrap";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { AuthContext } from "../../auth-context";
import LocationItem from "../Location/LocationItem";
import LocationEditItem from "../Location/LocationEditItem";

const initLocation = {
	// Sydney CBD
	lat: -33.882938,
	lng: 151.200509,
};

const libraries = ["places"];

function AddLocation() {
	const [newLocation, setNewLocation] = useState({
		address: "",
		lat: 0,
		lng: 0,
		english: "",
		category: "",
		chinese: "",
		phone: "",
		webpage: "",
		desc: "",
		chinesedesc: "",
	});

	const [locationId, setLocationId] = useState("");

	const onLoadAddress = (ref) => setSearchBox(ref);
	const [searchBox, setSearchBox] = useState(null);
	const [mapBounds, setMapBounds] = useState(null);
	const [address, setAddress] = useState("");
	const [options, setOptions] = useState([]);

	const auth = useContext(AuthContext);
	const context = useContext(LocationContext);

	const searchForData = useCallback(async () => {
		try {
			setMapBounds({
				east: initLocation.lng + 0.14,
				north: initLocation.lat + 0.14,
				south: initLocation.lat - 0.14,
				west: initLocation.lng - 0.14,
			});
			let resExs = await axios.get(
				process.env.REACT_APP_BACKEND_URL + "category/"
			);
			setOptions(resExs.data);
			setNewLocation((prevEx) => {
				return {
					...prevEx,
					category: resExs.data[0]["title"],
				};
			});
			console.log(resExs.data);
		} catch (error) {
			console.error(error);
		}
	}, []);

	const onDetail = (productid) => {
		setLocationId(productid);
	};

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	useEffect(() => {
		searchForData();
	}, [searchForData]);

	function handleChange(event) {
		const { name, value } = event.target;
		setNewLocation((prevEx) => {
			return {
				...prevEx,
				[name]: value,
			};
		});
	}

	function handleAuto(event) {
		setAddress(event.target.value);
	}

	const onPlaceChanged = () => {
		if (searchBox !== null) {
			console.log(searchBox);
			const _place = searchBox.getPlace();
			// const _geo = searchBox.getPlace().geometry.location;
			setNewLocation((prevEx) => {
				return {
					...prevEx,
					lat: _place.geometry.location.lat(),
					lng: _place.geometry.location.lng(),
					address: _place.formatted_address,
				};
			});
			setAddress(_place.formatted_address);
		} else {
			console.log("Autocomplete is not loaded yet!");
		}
	};

	let history = useHistory();
	async function onSubmit(event) {
		event.preventDefault();

		try {
			await axios.post(
				process.env.REACT_APP_BACKEND_URL + "locations/add",
				newLocation,
				{
					headers: { Authorization: "Bearer " + auth.token },
				}
			);
			context.searchForData();
			setNewLocation((prevEx) => {
				return {
					address: "",
					lat: 0,
					lng: 0,
					english: "",
					chinese: "",
					category: newLocation.category,
					phone: "",
					webpage: "",
					desc: "",
					chinesedesc: "",
				};
			});
			setAddress("");
			history.push("/addlocation");
		} catch (error) {
			console.error(error);
		}
	}

	return isLoaded ? (
		<div style={{ padding: "5% 1%" }}>
			<div>
				<h3>Add Location:</h3>
				<Form onSubmit={onSubmit} className="row">
					<Form.Group className="col-lg-3">
						<Form.Label>Address: </Form.Label>
						<Autocomplete
							fields={["geometry.location", "formatted_address"]}
							onPlaceChanged={onPlaceChanged}
							onLoad={onLoadAddress}
							bounds={mapBounds}
						>
							<div className="search-wrapper">
								<input
									type="text"
									value={address}
									onChange={handleAuto}
									placeholder={"🔍 Enter address to find Distance to Home"}
								/>
								<button
									className="close-icon"
									type="reset"
									onClick={() => setAddress("")}
								></button>
							</div>
						</Autocomplete>
					</Form.Group>
					<Form.Group className="col-lg-1">
						<Form.Label>English: </Form.Label>
						<Form.Control
							required
							type="text"
							name="english"
							value={newLocation.english}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group className="col-lg-1">
						<Form.Label>Chinese: </Form.Label>
						<Form.Control
							required
							type="text"
							name="chinese"
							value={newLocation.chinese}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group className="col-lg-1">
						<Form.Label>Category: </Form.Label>
						<select
							required
							name="category"
							value={newLocation.category}
							className="form-control"
							onChange={handleChange}
						>
							{options.map((option) => {
								return (
									<option value={option.title} key={option._id}>
										{option.title}
									</option>
								);
							})}
						</select>
					</Form.Group>
					<Form.Group className="col-lg-1">
						<Form.Label>Phone: </Form.Label>
						<Form.Control
							type="text"
							name="phone"
							value={newLocation.phone}
							onChange={handleChange}
							minLength="6"
							pattern="^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$"
						/>
					</Form.Group>
					<Form.Group className="col-lg-1">
						<Form.Label>Webpage: </Form.Label>
						<Form.Control
							required
							type="text"
							name="webpage"
							value={newLocation.webpage}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group className="col-lg-2">
						<Form.Label>Desc: </Form.Label>
						<Form.Control
							required
							type="text"
							name="desc"
							value={newLocation.desc}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group className="col-lg-1">
						<Form.Label>描述: </Form.Label>
						<Form.Control
							required
							type="text"
							name="chinesedesc"
							value={newLocation.chinesedesc}
							onChange={handleChange}
						/>
					</Form.Group>
					<div className="col-10 mx-auto col-lg-1">
						<Form.Label>Submit: </Form.Label>
						<Button type="submit">Submit</Button>
					</div>
				</Form>
			</div>
			{context.locations.map((location) => {
				if (location._id === locationId) {
					return (
						<LocationEditItem
							key={location._id}
							selectedLocation={location}
							onDetail={onDetail}
						/>
					);
				} else {
					return (
						<LocationItem
							key={location._id}
							location={location}
							onDetail={onDetail}
						/>
					);
				}
			})}
		</div>
	) : (
		<div className="spinner-border text-success" role="status">
			<span className="sr-only">Loading...</span>
		</div>
	);
}
export default AddLocation;
