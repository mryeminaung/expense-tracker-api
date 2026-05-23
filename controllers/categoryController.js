import Category from "../models/Category.js";

export async function getAllCategories(req, res) {
	try {
		const allCategories = await Category.find({}, { name: 1, type: 1 });
		res.json({ message: "All categories", data: allCategories });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching categories", error: error.message });
	}
}

export async function createCategory(req, res) {
	try {
		const { name, type } = req.body;

		const newCategory = new Category({ name, type });
		await newCategory.save();
		res.status(201).json({ message: "Category created", data: newCategory });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error creating category", error: error.message });
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
			return res.status(404).json({ message: "Category not found" });
		}
		res.json({ message: "Category updated", data: updatedCategory });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating category", error: error.message });
	}
}

export async function deleteCategoryById(req, res) {
	try {
		const { id } = req.params;
		const deletedCategory = await Category.findByIdAndDelete(id);
		if (!deletedCategory) {
			return res
				.status(404)
				.json({ message: "Already deleted or does not exist!" });
		}
		res.json({ message: "Category deleted", data: deletedCategory });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting category", error: error.message });
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
		res.json({ message: "Category summary", data: aggregatedResults });
	} catch (error) {
		res.status(500).json({
			message: "Error fetching category summary",
			error: error.message,
		});
	}
}
