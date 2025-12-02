import express from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

router.route('/')
  .get(getPosts)       // Get all posts
  .post(createPost);   // Create post

router.route('/:id')
  .put(updatePost)     // Update post
  .delete(deletePost); // Delete post

export default router;