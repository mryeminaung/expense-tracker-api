import express from "express";
import {
	createCategory,
	deleteCategoryById,
	getAllCategories,
	getCategorySummary,
	updateCategoryById,
} from "../controllers/categoryController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("", protectRoute, getAllCategories);
router.post("", protectRoute, createCategory);
router.put("/:id", protectRoute, updateCategoryById);
router.delete("/:id", protectRoute, deleteCategoryById);
router.get("/summary", protectRoute, getCategorySummary);

export default router;
