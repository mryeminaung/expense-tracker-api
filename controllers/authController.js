import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export async function register(req, res) {
	try {
		const { name, email, password } = req.body;

		const alreadyExist = await User.findOne({ email });
		if (alreadyExist) {
			return errorResponse(res, null, "Email already exists!", 400);
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		if (hashPassword) {
			const newUser = new User({ name, email, password: hashPassword });
			await newUser.save();
			return successResponse(res, newUser, "Registered successful!", 201);
		}
	} catch (err) {
		return errorResponse(res, err.message, "Server Error", 500);
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) return errorResponse(res, null, "Invalid Credentials", 400);

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return errorResponse(res, null, "Invalid Credentials", 400);

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		return successResponse(
			res,
			{
				token,
				user: { id: user._id, name: user.name, email: user.email },
			},
			"Login successful!",
			200,
		);
	} catch (error) {
		return errorResponse(res, error.message, "Server Error", 500);
	}
};
