import { z } from "zod";

export const registerSchema = z
	.object({
		body: z.object({
			name: z
				.string()
				.trim()
				.min(1, "Name is required")
				.max(50, "Name cannot exceed 50 characters"),

			email: z
				.string()
				.trim()
				.min(1, "Email is required")
				.email("Invalid email format"),

			password: z
				.string()
				.trim()
				.min(1, "Password is required")
				.min(6, "Password must be at least 6 characters long")
				.max(100, "Password is too long"),

			confirmPassword: z
				.string()
				.trim()
				.min(1, "Confirm password is required")
				.min(6, "Password must be at least 6 characters long")
				.max(100, "Password is too long"),
		}),
	})
	.refine((data) => data.body.password === data.body.confirmPassword, {
		message: "Passwords do not match",
		path: ["body", "confirmPassword"],
	});

export const loginSchema = z.object({
	body: z.object({
		email: z
			.string()
			.trim()
			.min(1, "Email is required")
			.email("Invalid email format"),
		password: z.string().trim().min(1, "Password is required"),
	}),
});
