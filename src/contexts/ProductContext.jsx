import React, { createContext, useContext, useReducer } from "react";
import { ACTIONS, BASE_URL } from "../utils/consts";
import $axios from "../utils/axios";

export const productContext = createContext();

export function useProductContext() {
	return useContext(productContext);
}

const initState = {
	products: [],
	oneProduct: null,
	categories: [],
	pageTotalCount: 1,
};

function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.products:
			return { ...state, products: action.payload };
		case ACTIONS.categories:
			return { ...state, categories: action.payload };
		case ACTIONS.oneProduct:
			return { ...state, oneProduct: action.payload };
		case ACTIONS.pageTotalCount:
			return { ...state, pageTotalCount: action.payload };
		default:
			return state;
	}
}

function ProductContext({ children }) {
	const [state, dispatch] = useReducer(reducer, initState);

	async function getProducts() {
		try {
			const { data } = await $axios.get(
				`${BASE_URL}/product/${window.location.search}`
			);
			console.log(data);
			dispatch({
				type: ACTIONS.pageTotalCount,
				payload: Math.ceil(data.count / 3),
			});
			dispatch({
				type: ACTIONS.products,
				payload: data.results,
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function getOneProduct(slug) {
		try {
			const { data } = await $axios.get(`${BASE_URL}/product/${slug}/`);
			dispatch({
				type: ACTIONS.oneProduct,
				payload: data,
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function addProduct(newProd) {
		try {
			await $axios.post(`${BASE_URL}/product/`, newProd);
			getProducts();
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteProduct(slug) {
		try {
			await $axios.delete(`${BASE_URL}/product/${slug}/`);
			getProducts();
		} catch (error) {
			console.log(error);
		}
	}

	async function editProduct(slug, prodEdit) {
		try {
			await $axios.patch(`${BASE_URL}/product/${slug}/`, prodEdit);
			getProducts();
		} catch (error) {
			console.log(error);
		}
	}

	async function getCategories() {
		try {
			const { data } = await $axios.get(`${BASE_URL}/category/`);
			dispatch({
				type: ACTIONS.categories,
				payload: data.results,
			});
		} catch (error) {
			console.log(error);
		}
	}

	const value = {
		products: state.products,
		oneProduct: state.oneProduct,
		categories: state.categories,
		pageTotalCount: state.pageTotalCount,
		getProducts,
		getOneProduct,
		addProduct,
		getCategories,
		deleteProduct,
		editProduct,
	};

	return (
		<productContext.Provider value={value}>{children}</productContext.Provider>
	);
}

export default ProductContext;
