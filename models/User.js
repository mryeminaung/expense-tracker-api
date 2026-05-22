import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

// [Pre-Save Hook]: convert password to Hash (Encrypt) before saving into database
// userSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) return next();

// 	const salt = await bcrypt.genSalt(10);
// 	this.password = await bcrypt.hash(this.password, salt);
// 	next();
// });

export default mongoose.model("User", userSchema);
