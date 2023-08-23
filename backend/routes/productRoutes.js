import express from "express";
const router = express.Router();
import { getProducts, getFilteredProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview, getBestProducts } from "../controllers/productController.js";
import {protect, admin} from "../middleware/loginMiddleware.js";

//using the code from productController.js:
//get all products
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/best", getBestProducts); //best products

// get filtered products
router.get("/filtered", getFilteredProducts);

//get product by id
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

router.route("/:id/reviews").post(protect, createReview);

export default router;