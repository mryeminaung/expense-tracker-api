import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
