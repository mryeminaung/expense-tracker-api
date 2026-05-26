import * as transactionService from "../services/transactionService.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export async function getAllTransactions(req, res) {
	try {
		const transactions = await transactionService.getAllTransactions(
			req.user.id,
		);
		return successResponse(
			res,
			transactions,
			"Transactions fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function createTransaction(req, res) {
	try {
		const newTransaction = await transactionService.createTransaction({
			...req.body,
			userId: req.user.id,
		});

		return successResponse(
			res,
			newTransaction,
			"Transaction created successfully!",
			201,
		);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function getLatestTransactions(req, res) {
	try {
		const transactions = await transactionService.getLatestTransactions(
			req.user.id,
		);
		return successResponse(
			res,
			transactions,
			"Latest transactions fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function getTransactionsSummary(req, res) {
	try {
		const finalResponse = await transactionService.getTransactionsSummary(
			req.user.id,
		);
		return successResponse(
			res,
			finalResponse,
			"Transaction summary fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function getTransaction(req, res) {
	try {
		const transaction = await transactionService.getTransactionById({
			id: req.params.id,
			userId: req.user.id,
		});
		return successResponse(
			res,
			transaction,
			"Transaction fetched successfully!",
		);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function updateTransaction(req, res) {
	try {
		const updatedTransaction = await transactionService.updateTransactionById({
			id: req.params.id,
			userId: req.user.id,
			...req.body,
		});
		return successResponse(
			res,
			updatedTransaction,
			"Transaction updated successfully!",
		);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}

export async function deleteTransaction(req, res) {
	try {
		const deletedTransaction = await transactionService.deleteTransactionById({
			id: req.params.id,
			userId: req.user.id,
		});
		return successResponse(
			res,
			deletedTransaction,
			"Transaction deleted successfully!",
		);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
}
