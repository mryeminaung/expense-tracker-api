import { z } from "zod";

export const createCategorySchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(1, "Name is required")
			.max(50, "Name cannot exceed 50 characters"),
		type: z.enum(["income", "expense"], {
			error: () => ({
				message: "Type must be either 'income' or 'expense'",
			}),
		}),
	}),
});

export const updateCategorySchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(1, "Name is required")
			.max(50, "Name cannot exceed 50 characters")
			.optional(),
		type: z
			.enum(["income", "expense"], {
				error: () => ({ message: "Type must be either 'income' or 'expense'" }),
			})
			.optional(),
	}),
	params: z.object({
		id: z
			.string()
			.trim()
			.regex(/^[0-9a-fA-F]{24}$/, "ID must be a valid ObjectId"),
	}),
});

export const deleteCategorySchema = z.object({
	params: z.object({
		id: z
			.string()
			.trim()
			.regex(/^[0-9a-fA-F]{24}$/, "ID must be a valid ObjectId"),
	}),
});
