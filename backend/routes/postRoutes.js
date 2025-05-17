const express = require("express");
const Post = require("../models/Post");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.json(posts);
});

router.post("/", auth, async (req, res) => {
  const post = await Post.create({
    content: req.body.content,
    author: req.user.id,
  });
  res.json(post);
});

router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user.id) return res.sendStatus(403);
  post.content = req.body.content;
  await post.save();
  res.json(post);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user.id) return res.sendStatus(403);
  await post.deleteOne();
  res.sendStatus(204);
});

module.exports = router;
