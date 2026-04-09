import dotenv from "dotenv";
import process from "node:process";
import pg from "pg";
import DatabaseError from "./lib/errors/database/database.error.js";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "postgres",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "likeme",
	port: Number(process.env.DB_PORT) || 5432,
	allowExitOnIdle: true,
});

export const obtenerPosts = async () => {
	try {
		const { rowCount, rows } = await pool.query(
			"SELECT id, titulo, img, descripcion, likes FROM posts ORDER BY id ASC"
		);

		if (rowCount === 0) {
			throw new DatabaseError("No se encontraron posts en la base de datos.", {
				operation: "obtenerPosts",
				statusCode: 404,
			});
		}

		return rows;
	} catch (error) {
		throw DatabaseError.from(
			error,
			"obtenerPosts",
			"No fue posible obtener los posts desde la base de datos."
		);
	}
};

export const crearPost = async (titulo, imageUrl, descripcion) => {
	try {
		const { rows } = await pool.query(
			"INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING id, titulo, img, descripcion, likes",
			[titulo, imageUrl, descripcion, 0]
		);

		return rows[0];
	} catch (error) {
		throw DatabaseError.from(
			error,
			"crearPost",
			"No fue posible crear el post en la base de datos."
		);
	}
};

export const darLike = async (id) => {
	try {
		const { rows } = await pool.query(
			"UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING id, titulo, img, descripcion, likes",
			[id]
		);

		return rows[0];
	} catch (error) {
		throw DatabaseError.from(
			error,
			"darLike",
			"No fue posible actualizar el like del post en la base de datos."
		);
	}
};

export const eliminarPost = async (id) => {
	try {
		const { rows } = await pool.query(
			"DELETE FROM posts WHERE id = $1 RETURNING id",
			[id]
		);

		return rows[0];
	} catch (error) {
		throw DatabaseError.from(
			error,
			"eliminarPost",
			"No fue posible eliminar el post de la base de datos."
		);
	}
};
