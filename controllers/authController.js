import * as authService from "../services/authService.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export async function register(req, res) {
	try {
		const newUser = await authService.registerUser(req.body);
		return successResponse(res, newUser, "Registered successful!", 201);
	} catch (err) {
		return errorResponse(res, null, err.message, err.statusCode || 500);
	}
}

export const login = async (req, res) => {
	try {
		const result = await authService.loginUser(req.body);
		return successResponse(res, result, "Login successful!", 200);
	} catch (error) {
		return errorResponse(res, null, error.message, error.statusCode || 500);
	}
};

// don't need to implement logout in backend when using JWT. The client should simply delete the token on logout.
// export const logout = async (req, res) => {
// 	try {
// 		return successResponse(res, null, "Logout successful!", 200);
// 	} catch (error) {
// 		return errorResponse(res, error.message, "Server Error", 500);
// 	}
// };
