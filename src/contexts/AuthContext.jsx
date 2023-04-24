import React, { createContext, useContext, useReducer } from "react";
import { ACTIONS, BASE_URL } from "../utils/consts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import $axios from "../utils/axios";

const authContext = createContext();

export function useAuthContext() {
	return useContext(authContext);
}

const initialState = {
	user: null,
};

function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.user:
			return { ...state, user: action.payload };

		default:
			return state;
	}
}

function AuthContext({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const navigate = useNavigate();

	async function register(credential) {
		try {
			await axios.post(`${BASE_URL}/auth/users/`, credential);
		} catch (error) {
			console.log(error);
		}
	}

	async function login(credentials) {
		try {
			const { data: tokens } = await axios.post(
				`${BASE_URL}/auth/jwt/create/`,
				credentials
			);
			localStorage.setItem("tokens", JSON.stringify(tokens));

			const { data } = await $axios.get(`${BASE_URL}/auth/users/me/`);

			dispatch({
				type: ACTIONS.user,
				payload: data,
			});
		} catch (error) {
			console.log(error);
		}
	}

	function logout() {
		localStorage.removeItem("tokens");
		dispatch({
			type: ACTIONS.user,
			payload: null,
		});
	}

	async function checkAuth() {
		try {
			const tokens = JSON.parse(localStorage.getItem("tokens"));
			if (tokens) {
				const { data } = await $axios.get(`${BASE_URL}/auth/users/me/`);

				dispatch({
					type: ACTIONS.user,
					payload: data,
				});
			} else {
				dispatch({
					type: ACTIONS.user,
					payload: null,
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function activateUser(uid, token) {
		try {
			await axios.post(`${BASE_URL}/auth/users/activation/`, {
				uid,
				token,
			});
			navigate("/auth");
		} catch (error) {
			console.log(error);
		}
	}

	const value = {
		user: state.user,
		register,
		login,
		activateUser,
		logout,
		checkAuth,
	};
	return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export default AuthContext;
