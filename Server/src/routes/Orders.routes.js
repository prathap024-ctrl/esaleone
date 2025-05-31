import express from "express";
import { Orders } from "../models/Orders.models.js";

const router = express.Router();

// Utility to generate random order ID
function generateOrderId() {
  return "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ✅ POST: Save a new order
router.post("/new-order", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      cardNumber,
      cartItems,
      paymentStatus,
      total,
    } = req.body;
    console.log("🟡 Request Body:", req.body); // Add this

    const cardLast4 =
      cardNumber && cardNumber.slice ? cardNumber.slice(-4) : "XXXX";

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    const newOrder = new Orders({
      orderId: generateOrderId(),
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      cardLast4,
      cartItems,
      paymentStatus,
      total,
    });
    console.log("🟢 New Order:", newOrder); // Add this

    await newOrder.save();
    const allOrders = await Orders.find();
    console.log("🧾 All Orders:", allOrders);

    console.log("✅ Order saved:", newOrder);
    res
      .status(201)
      .json({ message: "Order saved successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Order save error:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// ✅ GET: Fetch all orders
router.get("/fetch-order", async (req, res) => {
  try {
    const orders = await Orders.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ GET: Fetch order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Fetch order by ID error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
