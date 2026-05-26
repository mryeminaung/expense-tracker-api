import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { seedDefaultCategories } from "../seed/categories.seed.js";

const createServiceError = (message, statusCode) => {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
};

export async function registerUser({ name, email, password }) {
	const alreadyExist = await User.findOne({ email });
	if (alreadyExist) {
		throw createServiceError("Email already exists!", 400);
	}

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);

	const newUser = new User({ name, email, password: hashPassword });
	await newUser.save();
	await seedDefaultCategories(newUser._id);

	return newUser;
}

export async function loginUser({ email, password }) {
	const user = await User.findOne({ email });
	if (!user) {
		throw createServiceError("Invalid Credentials", 400);
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw createServiceError("Invalid Credentials", 400);
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});

	return {
		token,
		user: { id: user._id, name: user.name, email: user.email },
	};
}
