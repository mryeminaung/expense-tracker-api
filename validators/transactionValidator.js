import z from "zod";

export const createTransactionSchema = z.object({
	body: z.object({
		title: z.string().min(1, "Title is required"),
		amount: z.number({ invalid_type_error: "Amount must be a number" }),
		note: z.string().optional(),
		category: z
			.string()
			.min(1, "Category is required")
			.regex(/^[a-fA-F0-9]{24}$/, "Category ID must be a valid ObjectId"),
		date: z.string().refine((date) => !isNaN(Date.parse(date)), {
			message: "Invalid date format (eg. YY-MM-DD)",
		}),
	}),
});

export const updateTransactionSchema = z.object({
	body: z.object({
		title: z.string().min(1, "Title is required").optional(),
		amount: z
			.number({ invalid_type_error: "Amount must be a number" })
			.optional(),
		note: z.string().optional(),
		category: z
			.string()
			.min(1, "Category is required")
			.regex(/^[a-fA-F0-9]{24}$/, "Category ID must be a valid ObjectId")
			.optional(),
		date: z
			.string()
			.refine((date) => !isNaN(Date.parse(date)), {
				message: "Invalid date format (eg. YY-MM-DD)",
			})
			.optional(),
	}),
	params: z.object({
		id: z
			.string()
			.regex(/^[a-fA-F0-9]{24}$/, "Transaction ID must be a valid ObjectId"),
	}),
});

export const getTransactionSchema = z.object({
	params: z.object({
		id: z
			.string()
			.trim()
			.regex(/^[a-fA-F0-9]{24}$/, "Transaction ID must be a valid ObjectId"),
	}),
});

export const deleteTransactionSchema = z.object({
	params: z.object({
		id: z
			.string()
			.trim()
			.regex(/^[a-fA-F0-9]{24}$/, "Transaction ID must be a valid ObjectId"),
	}),
});
