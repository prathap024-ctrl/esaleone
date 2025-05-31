import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Grid } from "@mui/material";
import { useCart } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { getViewedProducts } from "../utils/viewedProducts";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [viewedProducts, setViewedProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://fakestoreapi.com/products");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch the Products!", error);
    }
  };
  useEffect(() => {
    fetchProducts();
    setViewedProducts(getViewedProducts());
  }, []);

  const inrFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });

  function truncateText(text, maxLength = 24) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="container py-10">
        <h2 className="text-5xl font-bold">Shop</h2>
      </div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 4, md: 12 }}
        direction="row"
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {products.map((product, idx) => (
          <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <Card
              sx={{ maxWidth: 500, maxHeight: 500 }}
              key={product.id}
              className="flex flex-col justify-between item-center font-bold"
            >
              <Link to={`/products/${product.id}`}>
                <CardMedia
                  component="img"
                  alt="Images"
                  sx={{ height: 300 }}
                  image={product.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h8" component="div">
                    {truncateText(product.title)}
                    {viewedProducts.includes(product.id) && (
                      <span className="ml-2 px-2 py-1 text-xs text-white bg-blue-500 rounded-full">
                        Recently Viewed
                      </span>
                    )}
                  </Typography>
                  <Typography variant="h7">
                    {inrFormatter.format(product.price)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {product.category}
                  </Typography>

                  <Typography variant="body3" sx={{ color: "text.primary" }}>
                    Rating: {product.rating?.rate} ({product.rating?.count}{" "}
                    reviews)
                  </Typography>
                </CardContent>
              </Link>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    addToCart(product), navigate("/checkout");
                  }}
                >
                  Buy Now
                </Button>
                <Button size="small" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsPage;
