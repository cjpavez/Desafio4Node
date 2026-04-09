import {
	crearPost,
	darLike,
	eliminarPost,
	obtenerPosts,
} from "../consultas.js";
import DatabaseError from "../lib/errors/database/database.error.js";

const handleControllerError = (error, res, fallbackMessage) => {
	console.error(fallbackMessage, error);

	if (error instanceof DatabaseError) {
		return res.status(error.statusCode).json({ error: error.message });
	}

	return res.status(500).json({ error: fallbackMessage });
};

export const getPosts = async (_req, res, next) => {
	try {
		const posts = await obtenerPosts();

		res.status(200).json(posts);
	} catch (error) {
		return next(error);
	}
};

export const createPost = async (req, res) => {
	const { titulo, url, img, descripcion } = req.body;
	const imageUrl = url || img;

	if (!titulo || !imageUrl || !descripcion) {
		return res.status(400).json({
			error: "Debes enviar titulo, url y descripcion para crear el post.",
		});
	}

	try {
		const post = await crearPost(titulo, imageUrl, descripcion);

		res.status(201).json(post);
	} catch (error) {
		return handleControllerError(
			error,
			res,
			"No fue posible crear el post."
		);
	}
};

export const likePost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await darLike(id);

		if (!post) {
			return res.status(404).json({ error: "Post no encontrado." });
		}

		res.status(200).json(post);
	} catch (error) {
		return handleControllerError(
			error,
			res,
			"No fue posible actualizar el post."
		);
	}
};

export const deletePost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await eliminarPost(id);

		if (!post) {
			return res.status(404).json({ error: "Post no encontrado." });
		}

		res.status(200).json({ message: "Post eliminado correctamente." });
	} catch (error) {
		return handleControllerError(
			error,
			res,
			"No fue posible eliminar el post."
		);
	}
};