import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  Box,
  Divider,
} from "@mui/material";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Checkout1 = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 30;
  const tax = 35;
  const total = subtotal + shipping + tax;

  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const handlePayment = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;
    const expiryDate = new Date(
      `20${expiry.slice(3)}-${expiry.slice(0, 2)}-01`
    );
    const isFutureDate = expiryDate > new Date();

    if (
      !emailRegex.test(email) ||
      !phoneRegex.test(phone) ||
      !cardRegex.test(cardNumber) ||
      !cvvRegex.test(cvv) ||
      !isFutureDate
    ) {
      toast.error("Please enter valid payment and personal details.");
      return;
    }

    const isSuccess = Math.random() < 0.7;
    const paymentStatus = isSuccess ? "success" : "failed";

    const orderData = {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      cardNumber,
      cartItems,
      total,
      paymentStatus, // <-- Send to backend
    };

    try {
      const res = await axios.post(
        "https://esaleone-1.onrender.com/api/orders/new-order",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        if (isSuccess) {
          clearCart();
          toast.success("Payment successful!");
          setTimeout(() => navigate("/payment?status=success"), 2000);
        } else {
          toast.error("Payment failed!");
          setTimeout(() => navigate("/payment?status=failure"), 2000);
        }
      } else {
        toast.error(res.data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  function truncateText(text, maxLength = 24) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Grid container size={{ xs: 2, sm: 4, md: 4 }}>
        <div className="w-full flex flex-col justify-around">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.{navigate("/")}</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b py-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover"
                />
                <div className="ml-4 flex-1">
                  <h2 className="font-semibold">{truncateText(item.title)}</h2>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-sm text-gray-600">{item.color}</p>
                  <p className="text-sm font-medium">
                    {inrFormatter.format(item.price)} × {item.quantity}
                  </p>

                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="border mt-2"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="w-full bg-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <p>Subtotal: {inrFormatter.format(subtotal)}</p>
            <p>Shipping: {inrFormatter.format(shipping)}</p>
            <p>Tax: {inrFormatter.format(tax)}</p>
            <hr className="my-2" />
            <p className="font-bold text-lg">
              Total: {inrFormatter.format(total)}
            </p>
          </div>
        </div>

        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" my={2}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ mx: 2, color: "gray" }}>
                Pay with card
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City"
                  fullWidth
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="State"
                  fullWidth
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Zip Code"
                  fullWidth
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  fullWidth
                  placeholder="0000123456789999"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="MM/YY"
                  fullWidth
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  fullWidth
                  placeholder="CVC"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ mt: 4 }}
              onClick={handlePayment}
            >
              Pay {inrFormatter.format(total)}
            </Button>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Box>
  );
};

export default Checkout1;
