import { Router } from "express";
import {
	createPost,
	deletePost,
	getPosts,
	likePost,
} from "../controllers/todo.controller.js";

const router = Router();

router.get("/posts", getPosts);

router.post("/posts", createPost);

router.put("/posts/like/:id", likePost);

router.delete("/posts/:id", deletePost);

export default router;