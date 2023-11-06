const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productquantity: {
    type: Number,
    required: true,
    default: 1,
  },
  productStatus: {
    type: String,
    required: true,
    default: "FOR_SALE",
  },
  productComments: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Products", productsSchema);
