import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: String,
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  cardLast4: String,
  cartItems: [
    {
      id: String,
      title: String,
      image: String,
      price: Number,
      quantity: Number,
      category: String,
      color: String,
    },
  ],
  total: Number,
  paymentStatus: {
    type: String,
    enum: ["success", "failed"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Orders = mongoose.model("Orders", OrderSchema);
