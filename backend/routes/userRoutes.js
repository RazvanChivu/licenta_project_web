import express from "express";
const router = express.Router();
import { loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  getUsers,
  updateUser,
  deleteUser } from '../controllers/userController.js';
import { protect, admin } from "../middleware/loginMiddleware.js"

//using the code from userController.js:
//if GET request then getUsers
//if POST request then registerUser
router.route("/").post(registerUser).get(protect, admin, getUsers);

//login user
router.route("/login").post(loginUser);
//logout user
router.route("/logout").post(logoutUser);

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/:id").delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser);

export default router;