import { Button, Rating, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { markProductAsViewed } from "../utils/viewedProducts";


export function ProductsHighlights() {
  const { addToCart } = useCart();
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState();
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState("Default");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch the Product!", error);
      }
    };

    fetchProduct();
    if (id) markProductAsViewed(Number(id));
  }, [id]);

  const inrFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  });

  return (
    <section className="py-16 px-8">
      <div className="mx-auto container grid place-items-center grid-cols-1 md:grid-cols-2">
        <img src={product.image} alt={product.title} className="h-[36rem]" />
        <div>
          <Typography className="mb-4" variant="h3">
            {product.title}
          </Typography>
          <Typography variant="h4">
            {inrFormatter.format(product.price)}
          </Typography>
          <Typography className="!mt-2 text-base font-normal leading-[27px] !text-gray-500">
            {product.description}
          </Typography>
          <Typography variant="h5">{product.category}</Typography>

          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border mt-2 p-1"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <div className="my-8 mt-3 flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded border border-gray-900 bg-blue-600 cursor-pointer ${
                selectedColor === "Blue" ? "ring-2 ring-black" : ""
              }`}
              onClick={() => setSelectedColor("Blue")}
            ></div>
            <div
              className={`h-5 w-5 rounded border border-blue-gray-100 cursor-pointer ${
                selectedColor === "White" ? "ring-2 ring-black" : ""
              }`}
              onClick={() => setSelectedColor("White")}
            ></div>
            <div
              className={`h-5 w-5 rounded border border-blue-gray-100 bg-gray-900 cursor-pointer ${
                selectedColor === "Black" ? "ring-2 ring-black" : ""
              }`}
              onClick={() => setSelectedColor("Black")}
            ></div>
          </div>

          <div className="my-8 flex items-center gap-2">
            <Rating
              value={product.rating?.rate || 4}
              readOnly
              className="text-amber-500"
            />
            <Typography className="!text-sm font-bold !text-gray-700">
              {product.rating?.rate}/{product.rating?.count} reviews
            </Typography>
          </div>

          <div className="mb-4 flex w-full items-center gap-3 md:w-1/2 ">
            <Button
              variant="contained"
              className="w-40"
              onClick={() =>
                addToCart({ ...product, quantity, color: selectedColor })
              }
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsHighlights;
