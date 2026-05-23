import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

config();
const app = express();
connectDB();

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
	res.send("<h1>Welcome to MongoDB Backend Starter Point!</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
