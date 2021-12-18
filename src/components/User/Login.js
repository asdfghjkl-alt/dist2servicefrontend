import React, { Fragment, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../auth-context";

const Login = () => {
	const auth = useContext(AuthContext);
	const history = useHistory();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { email, password } = formData;

	const onChange = (e) =>
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const responseData = await axios.post(
				process.env.REACT_APP_BACKEND_URL + "users/login",
				formData
			);
			auth.login(responseData.data.userId, responseData.data.token);
			history.push("/");
		} catch (err) {}
	};

	return (
		<Fragment>
			<div className="container">
				<h1 className="large text-primary">Sign In</h1>
				<p className="lead">
					<i className="fas fa-user" /> Sign Into Your Account
				</p>
				<form className="form" onSubmit={(e) => onSubmit(e)}>
					<div className="form-group">
						<input
							className="form-control"
							type="email"
							placeholder="Email Address"
							name="email"
							value={email}
							onChange={(e) => onChange(e)}
							required
						/>
					</div>
					<div className="form-group">
						<input
							className="form-control"
							type="password"
							placeholder="Password"
							name="password"
							value={password}
							onChange={(e) => onChange(e)}
							minLength="6"
						/>
					</div>
					<input type="submit" className="btn btn-primary" value="Login" />
				</form>
			</div>
		</Fragment>
	);
};

export default Login;
