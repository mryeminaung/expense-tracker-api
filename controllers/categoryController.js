import Category from "../models/Category.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export async function getAllCategories(req, res) {
	try {
		const allCategories = await Category.find({}, { name: 1, type: 1 });
		return successResponse(res, allCategories, "All categories");
	} catch (error) {
		return errorResponse(res, error.message, "Error fetching categories", 500);
	}
}

export async function createCategory(req, res) {
	try {
		const { name, type } = req.body;

		const newCategory = new Category({ name, type });
		await newCategory.save();
		return successResponse(res, newCategory, "Category created", 201);
	} catch (error) {
		return errorResponse(res, error.message, "Error creating category", 500);
	}
}

export async function updateCategoryById(req, res) {
	try {
		const { id } = req.params;
		const { name, type } = req.body;
		const updatedCategory = await Category.findByIdAndUpdate(
			id,
			{ name, type },
			{ returnDocument: "after" },
		);
		if (!updatedCategory) {
			return errorResponse(res, null, "Category not found", 404);
		}
		return successResponse(res, updatedCategory, "Category updated");
	} catch (error) {
		return errorResponse(res, error.message, "Error updating category", 500);
	}
}

export async function deleteCategoryById(req, res) {
	try {
		const { id } = req.params;
		const deletedCategory = await Category.findByIdAndDelete(id);
		if (!deletedCategory) {
			return errorResponse(
				res,
				null,
				"Already deleted or does not exist!",
				404,
			);
		}
		return successResponse(res, deletedCategory, "Category deleted");
	} catch (error) {
		return errorResponse(res, error.message, "Error deleting category", 500);
	}
}

export async function getCategorySummary(req, res) {
	try {
		const aggregatedResults = await Category.aggregate([
			{
				$group: {
					_id: "$type",
					count: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					type: "$_id",
					count: 1,
				},
			},
		]);
		return successResponse(res, aggregatedResults, "Category summary");
	} catch (error) {
		return errorResponse(
			res,
			error.message,
			"Error fetching category summary",
			500,
		);
	}
}
