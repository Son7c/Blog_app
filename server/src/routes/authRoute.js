import express from "express";
import { getUsers, registerUser } from "../controllers/authController.js";

const router =express.Router();

router.post('/',registerUser)
router.get('/', getUsers)

export default router;