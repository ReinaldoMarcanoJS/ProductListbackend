import express, { Router } from "express";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/products/products.controller";
import { productValidation } from "../middlewares/products/productValidation";
import { verifyToken } from "../middlewares/verify/verifyToken";
const router: Router = express.Router();

router.post("/",verifyToken, getProducts);
router.get("/:id", getProduct);
router.post("/add", productValidation , createProduct);
router.put("/:id", productValidation , updateProduct);
router.delete("/:id", deleteProduct);
 
export default router;
