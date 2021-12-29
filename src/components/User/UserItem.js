import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../auth-context";
import { LocationContext } from "../../location-context";
import { useHistory } from "react-router-dom";

function UserItem({ user, onDetail }) {
	const auth = useContext(AuthContext);
	const context = useContext(LocationContext);
	const { admin, name, email, _id, phone } = user;
	const history = useHistory();

	const deleteUser = async () => {
		try {
			await axios.delete(
				process.env.REACT_APP_BACKEND_URL + "users/delete/" + _id.toString(),
				{
					headers: { Authorization: "Bearer " + auth.token },
				}
			);
			context.searchForData();
			history.push("/editusers");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="row my-1">
			<div className="col-lg-2">
				<input type="checkbox" disabled={true} checked={admin} />
			</div>
			<div className="col-10 mx-auto col-lg-3">
				<span className="d-lg-none">name : </span>
				{name}
			</div>
			<div className="col-10 mx-auto col-lg-3">
				<span className="d-lg-none">email : </span>
				{email}
			</div>
			<div className="col-10 mx-auto col-lg-2">
				<span className="d-lg-none">phone : </span>
				{phone}
			</div>
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
						deleteUser();
					}}
				>
					<i className="fas fa-dumpster"></i>
				</Button>
			</div>
		</div>
	);
}

export default UserItem;
