import * as categoryService from "../services/categoryService.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export async function getAllCategories(req, res) {
	try {
		const allCategories = await categoryService.getAllCategories(req.user.id);
		return successResponse(res, allCategories, "All categories");
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function createCategory(req, res) {
	try {
		const newCategory = await categoryService.createCategory({
			...req.body,
			userId: req.user.id,
		});
		return successResponse(res, newCategory, "Category created", 201);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function updateCategoryById(req, res) {
	try {
		const updatedCategory = await categoryService.updateCategoryById({
			id: req.params.id,
			...req.body,
			userId: req.user.id,
		});
		return successResponse(res, updatedCategory, "Category updated");
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function deleteCategoryById(req, res) {
	try {
		const deletedCategory = await categoryService.deleteCategoryById({
			id: req.params.id,
			userId: req.user.id,
		});
		return successResponse(res, deletedCategory, "Category deleted");
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function getCategorySummary(req, res) {
	try {
		const aggregatedResults = await categoryService.getCategorySummary(
			req.user.id,
		);
		return successResponse(res, aggregatedResults, "Category summary");
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}
