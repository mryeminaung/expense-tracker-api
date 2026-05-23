import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res) {
	try {
		const { name, email, password } = req.body;

		const alreadyExist = await User.findOne({ email });
		if (alreadyExist) {
			return res.status(400).json({ message: "Email already exists!" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		if (hashPassword) {
			const newUser = new User({ name, email, password: hashPassword });
			await newUser.save();
			res.json({ message: "Registered successful!", data: newUser });
		}
		
	} catch (err) {
		res.status(500).json({ message: "Server Error", message: err.message });
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Invalid Credentials" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: "Invalid Credentials" });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		res.json({
			token: token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
			message: "Login successful!",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
