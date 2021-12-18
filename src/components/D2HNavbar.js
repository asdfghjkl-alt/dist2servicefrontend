import React, { useContext, useEffect, useCallback, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap/";
import { AuthContext } from "../auth-context";
import axios from "axios";

export default function D2HNavbar({
	setCategory,
	setRadius,
	setSelectedMarker,
	localStorage_myRadius,
	localStorage_myCategory,
}) {
	const auth = useContext(AuthContext);
	const [categories, setCategories] = useState([]);

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
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		searchForData();
	}, [searchForData]);

	return (
		<Navbar
			collapseOnSelect
			className="py-0"
			expand="md"
			bg="success"
			variant="dark"
			sticky="top"
		>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Brand href="/">
				<small style={{ color: "#dc3545" }}>
					{localStorage.getItem(localStorage_myRadius) || 5}km
				</small>
				<img
					src="/logo-distance2home.png"
					title="Distance2Home"
					// width='20'
					height="20"
					className="d-inline-block align-top"
					alt="distance2home logo"
				/>
				<small>findCentres</small>
			</Navbar.Brand>

			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav
					className="me-auto my-2 my-lg-0"
					style={{ maxHeight: "100px" }}
					navbarScroll
				>
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
			</Navbar.Collapse>

			<Nav>
				{auth.admin && (
					<React.Fragment>
						<Nav.Link
							className="py-0"
							href="/addlocation"
							style={{ color: "white" }}
						>
							<b>Add a Location</b>
						</Nav.Link>
						<Nav.Link
							className="py-0"
							href="/addcategory"
							style={{ color: "white" }}
						>
							<b>Add a Category</b>
						</Nav.Link>
						<Nav.Link
							className="py-0"
							href="/editusers"
							style={{ color: "white" }}
						>
							<b>Edit Users</b>
						</Nav.Link>
					</React.Fragment>
				)}
				{!auth.isLoggedIn && (
					<React.Fragment>
						<Nav.Link className="py-0" href="/login" style={{ color: "white" }}>
							<b>Login</b>
						</Nav.Link>
						<Nav.Link
							className="py-0"
							href="/signup"
							style={{ color: "white" }}
						>
							<b>Signup</b>
						</Nav.Link>
					</React.Fragment>
				)}
				{auth.isLoggedIn && (
					<Nav.Link
						className="py-0"
						to="/"
						onClick={auth.logout}
						style={{ color: "white" }}
					>
						<b>Logout</b>
					</Nav.Link>
				)}
			</Nav>
		</Navbar>
	);
}
