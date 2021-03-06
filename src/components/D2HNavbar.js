import React, { useContext, useEffect, useCallback, useState } from "react";
import {
	Navbar,
	Nav,
	NavDropdown,
	Container,
	Offcanvas,
	Accordion,
} from "react-bootstrap/";
import { AuthContext } from "../auth-context";
import axios from "axios";
import { LocationContext } from "../location-context";

export default function D2HNavbar({
	setCategory,
	setRadius,
	setSelectedMarker,
	localStorage_myRadius,
	localStorage_myCategory,
}) {
	const locContext = useContext(LocationContext);
	const auth = useContext(AuthContext);
	const [categories, setCategories] = useState([]);
	const [markers, setMarkers] = useState([]);

	function onSelectRadius(_selectedKey) {
		localStorage.setItem(localStorage_myRadius, _selectedKey);
		setRadius(_selectedKey);
	}

	function onSelectCategory(_selectedKey) {
		localStorage.setItem(localStorage_myCategory, _selectedKey);
		setCategory(_selectedKey);
		setSelectedMarker(null);
	}

	const searchForData = useCallback(async () => {
		try {
			let resExs = await axios.get(
				process.env.REACT_APP_BACKEND_URL + "category/"
			);
			setCategories(resExs.data);
			resExs = await axios.get(
				process.env.REACT_APP_BACKEND_URL + "locations/"
			);
			setMarkers(resExs.data);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		searchForData();
	}, [searchForData]);

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

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

	return (
		<Navbar collapseOnSelect expand="lg" bg="success" variant="dark">
			<Container>
				<Navbar.Brand href="/">
					<small style={{ color: "#dc3545" }}>
						{localStorage.getItem(localStorage_myRadius) || 5}km
					</small>
					<img
						src="/logo-distance2home.png"
						title="Distance2Home"
						height="20"
						className="d-inline-block align-top"
						alt="distance2home logo"
					/>
					<small>findAService</small>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link onClick={handleShow}>Distance</Nav.Link>
						<NavDropdown
							title="Radius"
							id="basic-nav-dropdown"
							className="py-0"
							onSelect={(selectedKey) => onSelectRadius(selectedKey)}
						>
							<NavDropdown.Item className="py-0" eventKey="60">
								60km
							</NavDropdown.Item>
							<NavDropdown.Item className="py-0" eventKey="30">
								30km
							</NavDropdown.Item>
							<NavDropdown.Item className="py-0" eventKey="10">
								10km
							</NavDropdown.Item>
							<NavDropdown.Item className="py-0" eventKey="5">
								5km
							</NavDropdown.Item>
							<NavDropdown.Item className="py-0" eventKey="3">
								3km
							</NavDropdown.Item>
							<NavDropdown.Item className="py-0" eventKey="1">
								1km
							</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown
							title="Category"
							id="basic-nav-dropdown"
							className="py-0"
							onSelect={(selectedKey) => onSelectCategory(selectedKey)}
						>
							{categories.map((category) => {
								return (
									<NavDropdown.Item
										className="py-0"
										eventKey={category.title}
										key={category._id}
									>
										{category.title}
									</NavDropdown.Item>
								);
							})}
						</NavDropdown>
					</Nav>

					<Nav className="ml-auto">
						{auth.admin && (
							<React.Fragment>
								<Nav.Link href="/addlocation">
									<b>Add a Location</b>
								</Nav.Link>
								<Nav.Link href="/addcategory">
									<b>Add a Category</b>
								</Nav.Link>
								<Nav.Link href="/editusers">
									<b>Edit Users</b>
								</Nav.Link>
							</React.Fragment>
						)}
						{!auth.isLoggedIn && (
							<React.Fragment>
								<Nav.Link href="/login">
									<b>Login</b>
								</Nav.Link>
								<Nav.Link href="/signup">
									<b>Signup</b>
								</Nav.Link>
							</React.Fragment>
						)}
						{auth.isLoggedIn && (
							<Nav.Link to="/" onClick={auth.logout}>
								<b>Logout</b>
							</Nav.Link>
						)}
					</Nav>
				</Navbar.Collapse>
				<Offcanvas show={show} onHide={handleClose}>
					<Offcanvas.Header closeButton>
						<Offcanvas.Title>Markers</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						<Accordion>
							{markers.map((marker) => {
								return (
									<Accordion.Item eventKey={marker._id}>
										<Accordion.Header>{marker.english}</Accordion.Header>
										<Accordion.Body>
											<p>{marker.chinese}</p>
											<p>{marker.category}</p>
											<p>{marker.phone}</p>
											<p>{marker.desc}</p>
											<a href={marker.webpage} target="_blank" rel="noreferrer">
												{marker.webpage}
											</a>
											<p>{marker.chinesedesc}</p>
											{locContext.homeAddress && (
												<p>
													{haversine_distance(
														locContext.homeAddress,
														marker
													).toFixed(2)}
													) km
												</p>
											)}
										</Accordion.Body>
									</Accordion.Item>
								);
							})}
						</Accordion>
					</Offcanvas.Body>
				</Offcanvas>
			</Container>
		</Navbar>
	);
}
