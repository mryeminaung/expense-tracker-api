import { ZodError } from "zod";

export const validate = (schema) => async (req, res, next) => {
	try {
		// Execute validation against the provided schema
		await schema.parseAsync({
			body: req.body,
			query: req.query,
			params: req.params,
		});
		next();
	} catch (error) {
		// Normalize several possible error shapes into { success:false, errors: [{field,message}] }
		// 1) real ZodError
		// 2) objects with an `errors` array (Zod-like)
		// 3) Error whose `message` is a JSON-stringified errors array

		const extractFromErrObject = (errObj) => {
			// errObj can be a string or an object with { path, message }
			if (!errObj) return { field: null, message: "Invalid input" };
			if (typeof errObj === "string") return { field: null, message: errObj };

			const rawPath = Array.isArray(errObj.path) ? errObj.path : [];
			const pathParts =
				rawPath.length > 0 &&
				["body", "query", "params"].includes(String(rawPath[0]))
					? rawPath.slice(1)
					: rawPath;
			const fieldName = pathParts.length > 0 ? pathParts.join(".") : null;
			const message =
				errObj.message || (errObj.msg ? errObj.msg : JSON.stringify(errObj));
			return { field: fieldName, message };
		};

		// Case A: ZodError instance
		if (error instanceof ZodError && Array.isArray(error.errors)) {
			const formatted = error.errors.map(extractFromErrObject);
			return res.status(400).json({ success: false, errors: formatted });
		}

		// Case B: generic object with `errors` array
		if (error && Array.isArray(error.errors)) {
			try {
				const formatted = error.errors.map(extractFromErrObject);
				return res.status(400).json({ success: false, errors: formatted });
			} catch (e) {
				// fallthrough to next handlers
			}
		}

		// Case C: error.message may contain a JSON string representing errors
		if (error && typeof error.message === "string") {
			try {
				const parsed = JSON.parse(error.message);
				if (Array.isArray(parsed)) {
					const formatted = parsed.map(extractFromErrObject);
					return res.status(400).json({ success: false, errors: formatted });
				}
			} catch (e) {
				// not JSON — fall back below
			}
		}

		// Final fallback: single message
		const fallbackMessage =
			error && error.message ? error.message : "Invalid request";
		return res.status(400).json({
			success: false,
			errors: [{ field: null, message: fallbackMessage }],
		});
	}
};
