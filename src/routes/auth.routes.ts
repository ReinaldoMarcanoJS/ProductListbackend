import express, { Router } from "express";

import { userLoginValidation,userRegisterValidation } from "../middlewares/Users/userValidation";
import { verifyToken } from "../middlewares/verify/verifyToken";
import { getProfile, login, logout, register } from "../controllers/auth/auth.controller";
const router: Router = express.Router();

router.post("/login",  userLoginValidation , login);
router.post("/register", userRegisterValidation, register);
router.post("/profile",  verifyToken , getProfile);
router.post("/logout",  verifyToken, logout );



export default router;
