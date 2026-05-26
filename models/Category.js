import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Category name is required"],
			trim: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["income", "expense"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

// Make the combination of user AND name unique together!
categorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
