import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import process from "node:process";
import todoRoutes from "./routes/todo.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(todoRoutes);

app.listen(port, () => {
	console.log(`Servidor activo en http://localhost:${port}`);
});