import React, { useContext, useState, useCallback, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../auth-context";
import { LocationContext } from "../../location-context";
import { useHistory } from "react-router-dom";

function LocationEditItem({ selectedLocation, onDetail }) {
	const {
		_id,
		address,
		english,
		chinese,
		category,
		phone,
		webpage,
		desc,
		chinesedesc,
	} = selectedLocation;

	const [location, setLocation] = useState({
		english: english,
		chinese: chinese,
		category: category,
		phone: phone,
		webpage: webpage,
		chinesedesc: chinesedesc,
		desc: desc,
	});
	const [options, setOptions] = useState([]);

	const history = useHistory();

	const auth = useContext(AuthContext);
	const context = useContext(LocationContext);

	const searchForData = useCallback(async () => {
		try {
			let resExs = await axios.get(
				process.env.REACT_APP_BACKEND_URL + "category/"
			);
			setOptions(resExs.data);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		searchForData();
	}, [searchForData]);

	function handleChange(event) {
		const { name, value } = event.target;
		setLocation((prevEx) => {
			return {
				...prevEx,
				[name]: value,
			};
		});
	}

	const onSave = async (event) => {
		try {
			event.preventDefault();
			await axios.patch(
				process.env.REACT_APP_BACKEND_URL +
					"locations/updatelocation/" +
					_id.toString(),
				location,
				{
					headers: { Authorization: "Bearer " + auth.token },
				}
			);
			context.searchForData();
			history.push("/addlocation");
			onDetail("");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Form className="row my-1 text-capitalize" onSubmit={onSave}>
			<div className="col-10 mx-auto col-lg-1">
				<span className="d-lg-none">address : </span>
				{address}
			</div>
			<Form.Group className="col-10 mx-auto col-lg-1">
				<Form.Label>English: </Form.Label>
				<Form.Control
					required
					type="text"
					name="english"
					value={location.english}
					onChange={handleChange}
				/>
			</Form.Group>
			<Form.Group className="col-10 mx-auto col-lg-1">
				<Form.Label>Chinese: </Form.Label>
				<Form.Control
					required
					type="text"
					name="chinese"
					value={location.chinese}
					onChange={handleChange}
				/>
			</Form.Group>
			<Form.Group className="col-lg-1">
				<Form.Label>Category: </Form.Label>
				<select
					required
					name="category"
					value={location.category}
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
					value={location.phone}
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
					value={location.webpage}
					onChange={handleChange}
				/>
			</Form.Group>
			<Form.Group className="col-lg-2">
				<Form.Label>Desc: </Form.Label>
				<Form.Control
					required
					type="text"
					name="desc"
					value={location.desc}
					onChange={handleChange}
				/>
			</Form.Group>
			<Form.Group className="col-lg-1">
				<Form.Label>描述: </Form.Label>
				<Form.Control
					required
					type="text"
					name="chinesedesc"
					value={location.chinesedesc}
					onChange={handleChange}
				/>
			</Form.Group>
			<div className="col-10 mx-auto col-lg-1">
				<Form.Label>Submit: </Form.Label>
				<Button type="submit">
					<i className="fas fa-save" onClick={onSave}></i>
				</Button>
			</div>
		</Form>
	);
}

export default LocationEditItem;
