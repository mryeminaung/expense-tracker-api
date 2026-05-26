import express from "express";
import { login, register } from "../controllers/authController.js";
import { validate } from "../middleware/validationMiddleware.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);

// need to implement only when using sessions or cookies for authentication. With JWT, the client can simply delete the token on logout, so no need for a logout route in the backend.
// authRouter.post("/logout", logout);

export default authRouter;
