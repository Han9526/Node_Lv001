const express = require("express");

const router = express.Router();

// CRUD
// 상품 created
const productsSchema = require("../schemas/products.schema");
router.post("/products", async (req, res) => {
  const {
    productId,
    Name,
    Password,
    productName,
    productPrice,
    productCount,
    productStatus,
    productComments,
    createdAt,
  } = req.body;
  const product = await productsSchema.find({ productId });
  if (product.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }

  const createdProduct = await productsSchema.create({
    productId,
    Name,
    Password,
    productName,
    productPrice,
    productCount,
    productStatus,
    productComments,
    createdAt,
  });

  res.json({ goods: createdProduct });
});


// R Read

// 상품 목록 조회
// [productName,productStatus,createdAt]
// - 상품명, 작성자명, 상품 상태, 작성 날짜 조회하기
// - 상품 목록은 작성 날짜createdAt **내림차순(최신순)** 정렬하기
//  객체리터럴의 중괄호는 괄호로감싸야 한다 why?
router.get("/products", async (req, res) => {
  // sort 1은 오름차순 -1은 내림차순
  // mongoose find임  SELECT *
  const productList = await productsSchema.find({}).sort({ createdAt: -1 });
  const list = productList.map((product) => ({
    productName: product.productName,
    productStatus: product.productStatus,
    createdAt: product.createdAt,
  }));

  res.send(list);
});

// 상품 detail 조회
// 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜 조회하기

router.get("/detail/:productId", async (req, res) => {
  const { productId } = req.params;

  // SELECT * WHERE "productId" === Number(productId)
  let result = await productsSchema.find({ productId: Number(productId) });
  const realresult = result.map((product) => ({
    productName: product.productName,
    productComments: product.productComments,
    productStatus: product.productStatus,
    createdAt: product.createdAt,
  }));

  res.status(200).json({ detail: realresult });
});

//  U Update
// 4. 상품 정보 수정 API
//     - 상품명, 작성 내용, 상품 상태, 비밀번호를 **request**에서 전달받기
//     - 수정할 상품과 비밀번호 일치 여부를 확인한 후, 동일할 때만 글이 **수정**되게 하기
//     - 선택한 상품이 존재하지 않을 경우, “상품 조회에 실패하였습니다." 메시지 반환하기
// 404 데이터x
// 401 권한x
// 400 요청x
// 402 예약됨?
router.put("/products/:productId",async(req,res)=>{
  const { productId } = req.params;
  const { productName, productComments, productStatus, password } = req.body;
  // id 존재하는지 체크
  const existId = await productsSchema.find({ productId });
  if(existId){
    if (password !== existId.password) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }else{
      await productsSchema.updateOne({ existId: Number(productId) }, { $set: { quantity } });
    }
  }
  else{
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
})
module.exports = router;
