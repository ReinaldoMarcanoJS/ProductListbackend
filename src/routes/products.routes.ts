import express, { Router } from "express";
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/products/products.controller";
import { productValidation } from "../middlewares/products/productValidation";
const router: Router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", productValidation , createProduct);
router.put("/:id", productValidation , updateProduct);
router.delete("/:id", deleteProduct);

export default router;
