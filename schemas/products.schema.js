const { ObjectId } = require("bson");
const mongoose = require("mongoose");

// products

// No
// password
// productName
// thumbnailUrl
// category
// price
// count 0-SOLD_OUT  FOR_SALE  등록시 FOR_SALE
// date  수정했을 때도 업데이트
// productComments

// 따로 id값 부여안해도 자동으로 부여 _id:ObjectId("asdasdasdasdasd")
const productsSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productCount: {
    type: Number,
    required: true,
  },
  //   productStatus: {},
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
