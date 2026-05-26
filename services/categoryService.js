import mongoose from "mongoose";
import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";

const createServiceError = (message, statusCode) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

export async function getAllCategories(userId) {
	return Category.find({ user: userId }, { name: 1, type: 1 });
}

export async function createCategory({ name, type, userId }) {
	const trimmedName = name.trim();
	const existingCategory = await Category.findOne({
		name: trimmedName,
		user: userId,
	});

	if (existingCategory) {
		throw createServiceError(
			`You already have a category named "${trimmedName}"`,
			400,
		);
	}

	const newCategory = new Category({ name: trimmedName, type, user: userId });
	await newCategory.save();

	return newCategory;
}

export async function updateCategoryById({ id, name, type, userId }) {
	const updateFields = {};

	if (name !== undefined) {
		updateFields.name = name.trim();
	}

	if (type !== undefined) {
		updateFields.type = type;
	}

	if (Object.keys(updateFields).length === 0) {
		throw createServiceError("No updates provided", 400);
	}

	if (updateFields.name) {
		const duplicateCategory = await Category.findOne({
			_id: { $ne: id },
			name: updateFields.name,
			user: userId,
		});

		if (duplicateCategory) {
			throw createServiceError(
				`You already have a category named "${updateFields.name}"`,
				400,
			);
		}
	}

	const updatedCategory = await Category.findOneAndUpdate(
		{ _id: id, user: userId },
		{ $set: updateFields },
		{ returnDocument: "after", runValidators: true },
	);

	if (!updatedCategory) {
		throw createServiceError("Category not found", 404);
	}

	return updatedCategory;
}

export async function deleteCategoryById({ id, userId }) {
	const categoryToDelete = await Category.findOne({ _id: id, user: userId });

	if (!categoryToDelete) {
		throw createServiceError("Category not found", 404);
	}

	const fallbackCategory = await Category.findOne({
		name: "Uncategorized",
		type: categoryToDelete.type,
		user: userId,
	});

	if (!fallbackCategory) {
		throw createServiceError("Fallback category not found", 404);
	}

	await Transaction.updateMany(
		{ category: id, user: userId },
		{ category: fallbackCategory._id },
	);

	await Category.deleteOne({ _id: id, user: userId });

	return categoryToDelete;
}

export async function getCategorySummary(userId) {
	const userObjectId = new mongoose.Types.ObjectId(userId);

	return Category.aggregate([
		{
			$match: { user: userObjectId },
		},
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
}
