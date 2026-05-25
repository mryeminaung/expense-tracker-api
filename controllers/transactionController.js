import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export async function getAllTransactions(req, res) {
	try {
		// transactions for the authenticated user only
		const transactions = await Transaction.find({ user: req.user.id }).populate(
			[
				{ path: "category", select: "name type" },
				{ path: "user", select: "name email" },
			],
		);
		return successResponse(
			res,
			transactions,
			"Transactions fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
}

export async function createTransaction(req, res) {
	try {
		const { title, amount, note, category, date } = req.body;
		const newTransaction = new Transaction({
			title,
			amount,
			note,
			category,
			date,
			// pass the authenticated user's ID to associate the transaction with the user from the auth middleware
			user: req.user.id,
		});
		await newTransaction.save();

		return successResponse(
			res,
			newTransaction,
			"Transaction created successfully!",
			201,
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
}

export async function getLatestTransactions(req, res) {
	try {
		const transactions = await Transaction.find({ user: req.user.id })
			.sort({ createdAt: -1 })
			.limit(5)
			.populate([{ path: "category", select: "name type" }]);
		return successResponse(
			res,
			transactions,
			"Latest transactions fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
}

export async function getTransactionsSummary(req, res) {
	try {
		// Convert the string user ID from req.user.id into a MongoDB ObjectId
		const userId = new mongoose.Types.ObjectId(req.user.id);

		const stats = await Transaction.aggregate([
			// Match only the logged-in user's transactions
			{
				$match: { user: userId },
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
								_id: null, // Group everything together into a single object
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
								balance: { $subtract: ["$totalIncome", "$totalExpense"] }, // Math: Income - Expense
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
						// Highest spending/earning category first
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
		const result = stats[0];

		// Fallback defaults if the user has absolutely no transactions yet
		const finalResponse = {
			summary: result.financialSummary[0] || {
				totalIncome: 0,
				totalExpense: 0,
				balance: 0,
			},
			categoryBreakdown: result.categoryBreakdown || [],
			monthlySummary: result.monthlySummary || [],
		};

		return successResponse(
			res,
			finalResponse,
			"Transaction summary fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
}

export async function getTransaction(req, res) {
	try {
		const { id } = req.params;
		const transaction = await Transaction.findById(id).populate([
			{ path: "category", select: "name type" },
			{ path: "user", select: "name email" },
		]);
		if (!transaction) {
			return errorResponse(res, null, "Transaction not found", 404);
		}
		return successResponse(
			res,
			transaction,
			"Transaction fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
}

export async function updateTransaction(req, res) {
	try {
		const { id } = req.params;
		const { title, amount, note, category, date } = req.body;

		const updatedTransaction = await Transaction.findByIdAndUpdate(
			id,
			{ title, amount, note, category, date },
			{ returnDocument: "after" },
		);
		if (!updatedTransaction) {
			return errorResponse(res, null, "Transaction not found", 404);
		}
		return successResponse(
			res,
			updatedTransaction,
			"Transaction updated successfully!",
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
}

export async function deleteTransaction(req, res) {
	try {
		const { id } = req.params;
		const deletedTransaction = await Transaction.findByIdAndDelete(id);
		if (!deletedTransaction) {
			return errorResponse(res, null, "Transaction not found", 404);
		}
		return successResponse(
			res,
			deletedTransaction,
			"Transaction deleted successfully!",
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
}
