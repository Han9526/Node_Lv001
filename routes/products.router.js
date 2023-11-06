const express = require("express");

const router = express.Router();

// CRUD

// C created
const productsSchema = require("../schemas/products.schema");
router.post("/product", async (req, res) => {
  const { name, password, productName, productComments, productquantity } =
    req.body;
  if (
    name === "" ||
    password === "" ||
    productName === "" ||
    productComments === ""
  ) {
    return res.status(400).json({ error: "값을 입력하시오" });
  }
  // mongoose sort 1은 오름차순 -1은 내림차순
  // mongoose find임  SELECT *
  const productList = await productsSchema.find({}).sort({ productId: -1 });
  try {
    const createdProduct = await productsSchema.create({
      productId: productList[0].productId + 1,
      name,
      password,
      productName,
      productComments,
      productquantity,
    });

    res.json({ Product: createdProduct });
  } catch (error) {
    res.status(503).json({ error: "데이터베이스를 확인하십시오" });
  }
});
// C created

// R Read

// 상품 목록 조회
router.get("/products", async (req, res) => {
  const productList = await productsSchema.find({}).sort({ createdAt: -1 });

  const list = productList.map((product) => ({
    productId: product.productId,
    productName: product.productName,
    productStatus: product.productStatus,
    createdAt: product.createdAt,
  }));

  res.send({ List: list });
});

// 상품 detail 조회
// 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜 조회하기
router.get("/products/detail/", (req, res) => {
  return res
    .status(400)
    .json({ message: "잘못된 접근입니다 ProductId를 입력하시오" });
});
router.get("/products/detail/:productId", async (req, res) => {
  const { productId } = req.params;

  // SELECT * WHERE "productId" === Number(productId)
  let result = await productsSchema.find({ productId: Number(productId) });
  if (result.length === 0) {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
  const realresult = result.map((product) => ({
    productName: product.productName,
    productComments: product.productComments,
    productquantity: product.productquantity,
    productStatus: product.productStatus,
    createdAt: product.createdAt,
  }));

  res.status(200).json({ detail: realresult });
});
// R Read

//  U Update
router.patch("/product/", (req, res) => {
  return res
    .status(400)
    .json({ message: "잘못된 접근입니다 ProductId를 입력하시오" });
});
router.patch("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const { productName, productComments, password, productquantity } = req.body;
  if (
    password === "" ||
    productName === "" ||
    productComments === "" ||
    productquantity === undefined
  ) {
    return res.status(400).json({ error: "값을 입력하시오" });
  }
  const existId = await productsSchema.find({ productId });
  if (existId.length) {
    if (String(password) !== existId[0].password) {
      return res.status(401).json({ message: "비밀번호 확인요망" });
    } else {
      await productsSchema.updateOne(
        { productId: productId },
        {
          $set: {
            productName: productName,
            productComments: productComments,
            productquantity: productquantity,
            productStatus: productquantity === 0 ? "SOLD_OUT" : "FOR_SALE",
            createdAt: new Date(),
          },
        }
      );
      return res
        .status(200)
        .json({ message: "상품 업데이트에 성공하였습니다." });
    }
  } else {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
});
//  U Update

// D delete
router.delete("/product/", (req, res) => {
  return res
    .status(400)
    .json({ message: "잘못된 접근입니다 ProductId를 입력하시오" });
});
router.delete("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;
  const product = await productsSchema.find({ productId });

  if (product.length) {
    if (String(password) === product[0].password) {
      await productsSchema.deleteOne({ productId });
      return res.status(200).json({ message: "상품이 삭제되었습니다." });
    } else {
      return res.status(401).json({ message: "비밀번호 확인요망." });
    }
  } else {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
});
// D delete

module.exports = router;
