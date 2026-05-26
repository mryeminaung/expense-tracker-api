import { config } from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

const categories = [
	{ name: "Uncategorized", type: "income" },
	{ name: "Food", type: "expense" },
	{ name: "Transport", type: "expense" },
	{ name: "Rent", type: "expense" },
	{ name: "Shopping", type: "expense" },
	{ name: "Salary", type: "income" },
	{ name: "Freelance", type: "income" },
];

config();

export const seedDefaultCategories = async (userId) => {
	try {
		// loop through each category and execute an Upsert
		const seedPromises = categories.map((cat) => {
			return Category.findOneAndUpdate(
				{
					user: userId,
					name: cat.name, // compound index criteria!
				},
				{
					// If it doesn't exist, insert the name, type, and attach the user ID
					$setOnInsert: {
						name: cat.name,
						type: cat.type,
						user: userId,
					},
				},
				{
					upsert: true, // creates it if missing, skips if it exists
					returnDocument: "after",
				},
			);
		});

		// Run all database operations in parallel
		await Promise.all(seedPromises);
		console.log(`Default categories seeded for User: ${userId}`);
	} catch (error) {
		console.error(
			`Failed to seed categories for User ${userId}:`,
			error.message,
		);
	}
};

// version 1
export const seedCategories = async () => {
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
