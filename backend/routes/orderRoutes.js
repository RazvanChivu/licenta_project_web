import express from "express";
const router = express.Router();
import { protect, admin } from "../middleware/loginMiddleware.js";
import { addOrderProducts,
  getUserOrders,
  getOrderById,
  updateOrderPaid,
  updateOrderDelivered,
  getOrders, } from "../controllers/orderController.js";


router.route("/").post(protect, addOrderProducts).get(protect, admin, getOrders);
router.route("/my-orders").get(protect, getUserOrders);
router.route("/:id").get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderDelivered);

export default router;