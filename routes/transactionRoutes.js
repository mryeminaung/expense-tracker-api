import express from "express";
import {
	createTransaction,
	deleteTransaction,
	getAllTransactions,
	getLatestTransactions,
	getTransaction,
	getTransactionsSummary,
	updateTransaction,
} from "../controllers/transactionController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const transactionRouter = express.Router();

transactionRouter.use(protectRoute);

transactionRouter.get("/", getAllTransactions);
transactionRouter.post("/", createTransaction);
transactionRouter.get("/sumary", getTransactionsSummary);
transactionRouter.get("/latest", getLatestTransactions);
transactionRouter.get("/:id", getTransaction);
transactionRouter.put("/:id", updateTransaction);
transactionRouter.delete("/:id", deleteTransaction);

export default transactionRouter;
