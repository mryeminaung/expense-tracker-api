import express from "express";
import { login, register } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// testing protected route
router.get("/users", protectRoute, async (req, res) => {
	const allUsers = await User.find({}, { password: 0, updatedAt: 0 });
	res.json(req.headers);

	res.json({ message: "Get all users", data: allUsers });
});

export default router;
