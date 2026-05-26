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
import { validate } from "../middleware/validationMiddleware.js";
import {
	createTransactionSchema,
	deleteTransactionSchema,
	getTransactionSchema,
	updateTransactionSchema,
} from "../validators/transactionValidator.js";

const transactionRouter = express.Router();

transactionRouter.use(protectRoute);

transactionRouter.get("/", getAllTransactions);
transactionRouter.post(
	"/",
	validate(createTransactionSchema),
	createTransaction,
);
transactionRouter.get("/summary", getTransactionsSummary);
transactionRouter.get("/latest", getLatestTransactions);
transactionRouter.get("/:id", validate(getTransactionSchema), getTransaction);
transactionRouter.put(
	"/:id",
	validate(updateTransactionSchema),
	updateTransaction,
);
transactionRouter.delete(
	"/:id",
	validate(deleteTransactionSchema),
	deleteTransaction,
);

export default transactionRouter;
