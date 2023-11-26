import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPostsBySearch,
} from "../controllers/posts.js";

const router = express.Router();

//CRUD
router.get("/", getPosts);
router.post("/create", createPost);
router.patch("/update/:id", updatePost);
router.delete("/:id", deletePost);

//Search
router.get("/search", getPostsBySearch);

export default router;
