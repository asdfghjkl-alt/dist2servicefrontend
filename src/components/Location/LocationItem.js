import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../auth-context";
import { LocationContext } from "../../location-context";
import { useHistory } from "react-router-dom";

function LocationItem({ location, onDetail }) {
	const auth = useContext(AuthContext);
	const context = useContext(LocationContext);
	const history = useHistory();
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
	} = location;

	const onDelete = async (event) => {
		try {
			await axios.delete(
				process.env.REACT_APP_BACKEND_URL + "locations/" + _id.toString(),
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
		<div className="row my-1 text-capitalize">
			<div className="col-10 mx-auto col-lg-1">{address}</div>
			<div className="col-10 mx-auto col-lg-1">{english}</div>
			<div className="col-10 mx-auto col-lg-1">{chinese}</div>
			<div className="col-10 mx-auto col-lg-1">{category}</div>
			<div className="col-10 mx-auto col-lg-1">{phone}</div>
			<div className="col-10 mx-auto col-lg-1">{webpage}</div>
			<div className="col-10 mx-auto col-lg-1">{desc}</div>
			<div className="col-10 mx-auto col-lg-2">{chinesedesc}</div>
			<div className="col-10 mx-auto col-lg-1">
				<Button
					onClick={() => {
						onDetail(_id.toString());
					}}
				>
					<i className="fas fa-edit"></i>
				</Button>
			</div>
			<div className="col-10 mx-auto col-lg-1">
				<Button
					onClick={() => {
						onDelete(_id.toString());
					}}
				>
					<i className="fas fa-dumpster"></i>
				</Button>
			</div>
		</div>
	);
}

export default LocationItem;
