import express from "express";
import {
	createCategory,
	deleteCategoryById,
	getAllCategories,
	getCategorySummary,
	updateCategoryById,
} from "../controllers/categoryController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.use(protectRoute);

categoryRouter.get("", getAllCategories);
categoryRouter.post("", createCategory);
categoryRouter.get("/summary", getCategorySummary);
categoryRouter.put("/:id", updateCategoryById);
categoryRouter.delete("/:id", deleteCategoryById);

export default categoryRouter;
