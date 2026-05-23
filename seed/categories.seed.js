import { config } from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

const categories = [
	{ name: "Food", type: "expense" },
	{ name: "Transport", type: "expense" },
	{ name: "Rent", type: "expense" },
	{ name: "Shopping", type: "expense" },
	{ name: "Salary", type: "income" },
	{ name: "Freelance", type: "income" },
];

config();

const seedCategories = async () => {
	await connectDB();

	try {
		await Category.bulkWrite(
			categories.map((cat) => ({
				updateOne: {
					filter: { name: cat.name },
					update: { $set: cat },
					upsert: true,
				},
			})),
		);

		console.log("Categories are seeded successfully");

		process.exit();
	} catch (error) {
		console.log("Seeding error:", error);
		process.exit(1);
	}
};

seedCategories();
