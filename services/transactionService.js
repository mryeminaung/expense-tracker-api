import mongoose from "mongoose";
import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";

const createServiceError = (message, statusCode) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

const ensureCategoryBelongsToUser = async (categoryId, userId) => {
	const category = await Category.findOne({ _id: categoryId, user: userId });

	if (!category) {
		throw createServiceError("Category not found", 404);
	}

	return category;
};

export async function getAllTransactions(userId) {
	return Transaction.find({ user: userId }).populate([
		{ path: "category", select: "name type" },
		{ path: "user", select: "name email" },
	]);
}

export async function createTransaction({
	title,
	amount,
	note,
	category,
	date,
	userId,
}) {
	await ensureCategoryBelongsToUser(category, userId);

	const newTransaction = new Transaction({
		title,
		amount,
		note,
		category,
		date,
		user: userId,
	});

	await newTransaction.save();
	return newTransaction;
}

export async function getLatestTransactions(userId) {
	return Transaction.find({ user: userId })
		.sort({ createdAt: -1 })
		.limit(5)
		.populate([{ path: "category", select: "name type" }]);
}

export async function getTransactionsSummary(userId) {
	// Convert the string user ID from req.user.id into a MongoDB ObjectId
	const objectId = new mongoose.Types.ObjectId(userId);

	const stats = await Transaction.aggregate([
		// Match only the logged-in user's transactions
		{
			$match: { user: objectId },
		},

		// Look up (Join) Category to read its 'type' and 'name'
		{
			$lookup: {
				// The name of the collection
				from: "categories",
				// The field inside Transaction schema
				localField: "category",
				// The field inside Category schema
				foreignField: "_id",
				// Output array field name
				as: "categoryDetails",
			},
		},

		// Flatten the categoryDetails array into a flat object
		{
			$unwind: "$categoryDetails",
		},

		// Split the assembly line into 3 parallel lanes
		{
			$facet: {
				// Calculate Total Income, Total Expense, and Balance
				financialSummary: [
					{
						$group: {
							_id: null,
							// Group everything together into a single object
							totalIncome: {
								$sum: {
									$cond: [
										{ $eq: ["$categoryDetails.type", "income"] },
										"$amount",
										0,
									],
								},
							},
							totalExpense: {
								$sum: {
									$cond: [
										{ $eq: ["$categoryDetails.type", "expense"] },
										"$amount",
										0,
									],
								},
							},
						},
					},
					{
						$project: {
							_id: 0,
							totalIncome: 1,
							totalExpense: 1,
							// Math: Income - Expense
							balance: { $subtract: ["$totalIncome", "$totalExpense"] },
						},
					},
				],

				// Group by Category for Pie/Donut Charts
				categoryBreakdown: [
					{
						// Group by the actual text name of the category
						$group: {
							_id: "$categoryDetails.name",
							total: { $sum: "$amount" },
							type: { $first: "$categoryDetails.type" },
						},
					},
					{
						$project: {
							_id: 0,
							categoryName: "$_id",
							total: 1,
							type: 1,
						},
					},
					{ $sort: { total: -1 } },
				],

				// Group by Month for Bar/Line Charts
				monthlySummary: [
					{
						$group: {
							_id: {
								// Extract YYYY-MM format from the date field
								$dateToString: { format: "%Y-%m", date: "$date" },
							},
							income: {
								$sum: {
									$cond: [
										{ $eq: ["$categoryDetails.type", "income"] },
										"$amount",
										0,
									],
								},
							},
							expense: {
								$sum: {
									$cond: [
										{ $eq: ["$categoryDetails.type", "expense"] },
										"$amount",
										0,
									],
								},
							},
						},
					},
					{
						$project: {
							_id: 0,
							month: "$_id",
							income: 1,
							expense: 1,
						},
					},
					{ $sort: { month: 1 } }, // Chronological order (Jan, Feb, Mar...)
				],
			},
		},
	]);

	// Clean up the MongoDB output array wrapping
	const result = stats[0] || {};

	// Fallback defaults if the user has absolutely no transactions yet
	return {
		summary: result.financialSummary?.[0] || {
			totalIncome: 0,
			totalExpense: 0,
			balance: 0,
		},
		categoryBreakdown: result.categoryBreakdown || [],
		monthlySummary: result.monthlySummary || [],
	};
}

export async function getTransactionById({ id, userId }) {
	const transaction = await Transaction.findOne({
		_id: id,
		user: userId,
	}).populate([
		{ path: "category", select: "name type" },
		{ path: "user", select: "name email" },
	]);

	if (!transaction) {
		throw createServiceError("Transaction not found", 404);
	}

	return transaction;
}

export async function updateTransactionById({
	id,
	userId,
	title,
	amount,
	note,
	category,
	date,
}) {
	if (category) {
		await ensureCategoryBelongsToUser(category, userId);
	}

	const updatedTransaction = await Transaction.findOneAndUpdate(
		{ _id: id, user: userId },
		{ title, amount, note, category, date },
		{ returnDocument: "after", runValidators: true },
	);

	if (!updatedTransaction) {
		throw createServiceError("Transaction not found", 404);
	}

	return updatedTransaction;
}

export async function deleteTransactionById({ id, userId }) {
	const deletedTransaction = await Transaction.findOneAndDelete({
		_id: id,
		user: userId,
	});

	if (!deletedTransaction) {
		throw createServiceError("Transaction not found", 404);
	}

	return deletedTransaction;
}
