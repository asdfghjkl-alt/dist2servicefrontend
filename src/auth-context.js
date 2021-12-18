import React, { useState, useCallback, useEffect, createContext } from "react";
import axios from "axios";
const AuthContext = createContext();

let logoutTimer;

function AuthProvider(props) {
	const [token, setToken] = useState(null);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();
	const [userId, setUserId] = useState("");
	const [admin, setAdmin] = useState(false);

	const login = useCallback(async (uid, token, expirationDate) => {
		setToken(token);
		setUserId(uid);
		const tokenExpirationDate =
			expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		if (token) {
			const user = await axios.get(
				process.env.REACT_APP_BACKEND_URL + "users",
				{
					headers: { Authorization: "Bearer " + token },
				}
			);

			if (user.data.admin === true) {
				setAdmin(true);
				localStorage.setItem(
					"userData",
					JSON.stringify({
						admin: true,
						userId: uid,
						token: token,
						expiration: tokenExpirationDate.toISOString(),
					})
				);
			} else {
				localStorage.setItem(
					"userData",
					JSON.stringify({
						userId: uid,
						token: token,
						expiration: tokenExpirationDate.toISOString(),
					})
				);
			}
		}
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		localStorage.removeItem("userData");
		setAdmin(false);
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem("userData"));
		if (
			storedData &&
			storedData.token &&
			new Date(storedData.expiration) > new Date()
		) {
			login(
				storedData.userId,
				storedData.token,
				new Date(storedData.expiration)
			);
		} else {
			logout();
		}
	}, [login, logout]);

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				admin: admin,
				userId: userId,
				login: login,
				logout: logout,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}

var AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer, AuthContext };
