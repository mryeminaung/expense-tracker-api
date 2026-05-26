import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			required: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
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
