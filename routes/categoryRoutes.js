import express from "express";
import {
	createCategory,
	deleteCategoryById,
	getAllCategories,
	getCategorySummary,
	updateCategoryById,
} from "../controllers/categoryController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
	createCategorySchema,
	deleteCategorySchema,
	updateCategorySchema,
} from "../validators/categoryValidator.js";

const categoryRouter = express.Router();

categoryRouter.use(protectRoute);

categoryRouter.get("", getAllCategories);
categoryRouter.post("", validate(createCategorySchema), createCategory);
categoryRouter.get("/summary", getCategorySummary);
categoryRouter.put("/:id", validate(updateCategorySchema), updateCategoryById);
categoryRouter.delete(
	"/:id",
	validate(deleteCategorySchema),
	deleteCategoryById,
);

export default categoryRouter;
