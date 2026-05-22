import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";

config();
const app = express();

app.use(cors());
app.use(json());

connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB Connected Successfully!"))
	.catch((err) => console.error("Database Connection Error:", err));

app.get("/", (req, res) => {
	res.send("<h1>Welcome to MongoDB Backend Starter Point!</h1>");
});

app.get("/api", (req, res) => {
	res.json({ message: "Project Setup - Expense Tracker API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
