import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page, size } = req.query;

  try {
    const startIndex = (Number(page) - 1) * size;
    const total = await PostMessage.countDocuments({});

    const post = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(size)
      .skip(startIndex);
    res.status(200).json({
      data: post,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / size),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage(post);
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Record Found on that Id");

  const updatePost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );

  res.json(updatePost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Record Found on that Id");

  await PostMessage.findByIdAndDelete(id);
  res.json({ message: "Post deleted success" });
};

//$and = AND
//$or = OR
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");
    let posts = [];
    if (title && tags) {
      posts = await PostMessage.find({
        $and: [{ title }, { tags: { $in: tags?.split(",") } }],
      });
    } else if (title || tags) {
      posts = await PostMessage.find({
        $or: [{ title }, { tags: { $in: tags?.split(",") } }],
      });
    }

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
