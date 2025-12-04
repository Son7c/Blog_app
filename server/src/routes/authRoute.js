import express from "express";
import { registerUser,loginUser,getUsers,getMe} from "../controllers/authController.js";

const router =express.Router();

router.post('/',registerUser)
router.get('/', getUsers)
router.post("/login",loginUser);
router.get("/me",getMe);

export default router;