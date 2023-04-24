import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { productContext, useProductContext } from "../contexts/ProductContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const theme = createTheme();
function AddProductPage() {
	const { addProduct, categories, getCategories } = useProductContext();
	const [category, setCategory] = useState("men");

	useEffect(() => {
		getCategories();
	}, []);

	function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		addProduct(data);
	}
	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography component="h1" variant="h5">
						Add product
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="title"
							label="Title"
							name="title"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="description"
							label="Description"
							id="description"
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							type="number"
							name="price"
							label="Price"
							id="price"
						/>
						<FormControl fullWidth>
							<InputLabel id="category-select-label">Category</InputLabel>
							<Select
								labelId="category-select-label"
								id="category-select"
								label="Category"
								name="category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							>
								{categories.map((item) => {
									return (
										<MenuItem key={item.slug} value={item.slug}>
											{item.title}
										</MenuItem>
									);
								})}
								{/* <MenuItem value={"men"}>Men</MenuItem>
								<MenuItem value={"women"}>Women</MenuItem> */}
							</Select>
						</FormControl>
						<TextField
							margin="normal"
							required
							fullWidth
							type="file"
							name="main_image"
							label="Image"
							id="image"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Add
						</Button>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default AddProductPage;
