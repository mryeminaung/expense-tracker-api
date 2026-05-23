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

router.use(protectRoute);

router.get("", getAllCategories);
router.post("", createCategory);
router.get("/summary", getCategorySummary);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategoryById);

export default router;
