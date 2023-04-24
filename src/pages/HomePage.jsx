import React, { useEffect, useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Pagination,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import { BASE_URL } from "../utils/consts";
import { Link, useSearchParams } from "react-router-dom";

function HomePage() {
	const {
		products,
		getProducts,
		deleteProduct,
		categories,
		getCategories,
		pageTotalCount,
	} = useProductContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");
	const [category, setCategory] = useState(
		searchParams.get("category__slug") || "all"
	);
	const [page, setPage] = useState(+searchParams.get("page") || 1);

	useEffect(() => {
		getCategories();
	}, []);

	useEffect(() => {
		getProducts();
	}, [searchParams]);

	useEffect(() => {
		if (category === "all") {
			setSearchParams({
				search: searchVal,
				page: 1,
			});
		} else {
			setSearchParams({
				search: searchVal,
				category__slug: category,
				page: 1,
			});
		}
		setPage(1);
	}, [searchVal, category]);

	useEffect(() => {
		if (category === "all") {
			setSearchParams({
				page: page,
				search: searchVal,
			});
		} else {
			setSearchParams({
				page: page,
				search: searchVal,
				category__slug: category,
			});
		}
	}, [page]);

	return (
		<Container>
			<TextField
				value={searchVal}
				onChange={(e) => setSearchVal(e.target.value)}
				variant="outlined"
				label="Search"
			/>
			<FormControl>
				<FormLabel id="demo-radio-buttons-group-label">Category</FormLabel>
				<RadioGroup
					aria-labelledby="demo-radio-buttons-group-label"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					name="radio-buttons-group"
				>
					<FormControlLabel value="all" control={<Radio />} label="All" />
					{categories.map((item) => {
						return (
							<FormControlLabel
								key={item.slug}
								value={item.slug}
								control={<Radio />}
								label={item.title}
							/>
						);
					})}
				</RadioGroup>
			</FormControl>
			<Grid container spacing={2}>
				{products.map((item) => {
					return (
						<Grid key={item.slug} item xs={12} sm={6} md={4}>
							<Card sx={{ maxWidth: 345 }}>
								<CardMedia
									component="img"
									alt="green iguana"
									height="300"
									image={`${BASE_URL}${item.main_image}`}
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{item.title}
									</Typography>
									<Typography variant="h6" color="text">
										${item.price}
									</Typography>
								</CardContent>
								<CardActions>
									<Button
										onClick={() => deleteProduct(item.slug)}
										color="error"
										size="small"
									>
										Delete
									</Button>
									<Button
										component={Link}
										to={`/edit/${item.slug}`}
										size="small"
									>
										Edit
									</Button>
								</CardActions>
							</Card>
						</Grid>
					);
				})}
			</Grid>
			<Pagination
				page={page}
				onChange={(e, value) => setPage(value)}
				count={pageTotalCount}
			/>
		</Container>
	);
}

export default HomePage;
