import React, { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../../auth-context";

function AddCategory() {
	const [newCategory, setNewCategory] = useState({
		title: "",
	});
	const [options, setOptions] = useState([]);

	const auth = useContext(AuthContext);

	function handleChange(event) {
		const { name, value } = event.target;
		setNewCategory((prevEx) => {
			return {
				...prevEx,
				[name]: value,
			};
		});
	}
	let history = useHistory();
	async function onSubmit(event) {
		event.preventDefault();

		try {
			await axios.post(
				process.env.REACT_APP_BACKEND_URL + "category/add",
				newCategory,
				{
					headers: { Authorization: "Bearer " + auth.token },
				}
			);
			setNewCategory((prevEx) => {
				return {
					title: "",
				};
			});
			history.push("/addcategory");
			searchForData();
		} catch (error) {
			console.error(error);
		}
	}

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

	return (
		<div style={{ padding: "5% 1%" }}>
			<div>
				<h3>Add Category:</h3>
				<Form onSubmit={onSubmit} className="row">
					<Form.Group className="col-lg-6">
						<Form.Label>Title: </Form.Label>
						<Form.Control
							type="text"
							name="title"
							value={newCategory.title}
							onChange={handleChange}
						/>
					</Form.Group>
					<div className="form-group col-lg-1">
						<Form.Label>Submit: </Form.Label>
						<input
							type="submit"
							value="Submit"
							className="btn btn-primary form-control"
						/>
					</div>
				</Form>
			</div>
			<h1>Categories:</h1>
			{options.map((option) => {
				return (
					<div className="row my-1 text-capitalize" key={option._id}>
						<div className="col-10 mx-auto col-lg-12">{option.title}</div>
					</div>
				);
			})}
		</div>
	);
}
export default AddCategory;
