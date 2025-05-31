import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function OrderTracking1() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://esaleone-1.onrender.com/api/orders/fetch-order",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = res.data;
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order, index) => (
          <Card key={index} sx={{ mb: 4 }}>
            <CardContent>
              {/* Order Header */}
              <Typography variant="h6" gutterBottom>
                Order #{order.orderId}
              </Typography>

              <Typography variant="body1" gutterBottom>
                Thank you, <strong>{order.fullName}</strong>! 🎉
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {order.email} | {order.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {order.address}, {order.city}, {order.state} - {order.zip}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Items */}
              {order.cartItems?.map((item, idx) => (
                <Grid
                  container
                  justifyContent="space-between"
                  key={idx}
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={6}>
                    <Typography>{item.title}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>x {item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Grid>
                </Grid>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Total and Status */}
              <Typography>
                <strong>Total:</strong> {formatCurrency(order.total)}
              </Typography>
              <Typography
                sx={{ mt: 1 }}
                color={order.paymentStatus === "success" ? "green" : "red"}
              >
                Payment Status: {order.paymentStatus}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </Box>
  );
}

export default OrderTracking1;
