import express from "express";
import {
	createTransaction,
	deleteTransaction,
	getAllTransactions,
	getTransaction,
	getTransactionsSummary,
	updateTransaction,
  getLatestTransactions,
} from "../controllers/transactionController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getAllTransactions);
router.post("/", createTransaction);
router.get("/sumary", getTransactionsSummary);
router.get("/latest", getLatestTransactions);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
