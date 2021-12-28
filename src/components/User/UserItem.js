import React from "react";
import { Button } from "react-bootstrap";

function UserItem({ user, onDetail }) {
	const { admin, name, email, _id, phone } = user;

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
			<div className="col-10 mx-auto col-lg-2">
				<Button
					onClick={() => {
						onDetail(_id.toString());
					}}
				>
					<i className="fas fa-edit"></i>
				</Button>
			</div>
		</div>
	);
}

export default UserItem;
