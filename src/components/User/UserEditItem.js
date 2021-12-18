import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../auth-context";
import axios from "axios";
import { LocationContext } from "../../location-context";

function UserItem({ user, onDetail }) {
	const context = useContext(LocationContext);
	const auth = useContext(AuthContext);
	const { admin, _id, email, name, phone } = user;

	const [users, setUser] = useState({
		admin: admin,
		phone: phone,
	});

	const handleCheck = () => {
		setUser((prevEx) => {
			return {
				...prevEx,
				admin: !users.admin,
			};
		});
	};

	function handleChange(event) {
		const { name, value } = event.target;
		setUser((prevEx) => {
			return {
				...prevEx,
				[name]: value,
			};
		});
	}

	const history = useHistory();

	const onSave = async (event) => {
		try {
			event.preventDefault();
			await axios.patch(
				process.env.REACT_APP_BACKEND_URL + "users/edit/" + _id.toString(),
				users,
				{
					headers: { Authorization: "Bearer " + auth.token },
				}
			);
			onDetail("");
			context.searchForData();
			history.push("/editusers");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Form className="row my-1" onSubmit={onSave}>
			<Form.Group className="col-10 mx-auto col-lg-2">
				<Form.Control
					type="checkbox"
					name="admin"
					value={users.admin}
					checked={users.admin}
					onChange={handleCheck}
				/>
			</Form.Group>
			<div className="col-10 mx-auto col-lg-2">
				<span className="d-lg-none">name : </span>
				{name}
			</div>
			<div className="col-10 mx-auto col-lg-2">
				<span className="d-lg-none">email : </span>
				{email}
			</div>
			<Form.Group className="col-lg-2">
				<Form.Label>Phone: </Form.Label>
				<Form.Control
					required
					type="text"
					name="phone"
					value={users.phone}
					onChange={handleChange}
				/>
			</Form.Group>
			<div className="col-10 mx-auto col-lg-1">
				<Button type="submit">
					<i className="fas fa-save"></i>
				</Button>
			</div>
		</Form>
	);
}

export default UserItem;
