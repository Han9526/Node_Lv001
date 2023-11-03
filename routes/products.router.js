const express = require("express");

const router = express.Router();

const products = [
  {
    productId: 1,
    Name: "승준",
    Password: "1111",
    productName: "펩시뚱캔",
    productPrice: 1000,
    productCount: 3,

    productComments: "제로콜라입니다",
    createdAt: Date.now(),
  },
];
// 상품 목록 조회
router.get("/products", (req, res) => {
  res.json({ products: products });
});
module.exports = router;
