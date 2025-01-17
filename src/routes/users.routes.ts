import express, { Router } from "express";
import { createUser, getUsers, getUser, updateUser, deleteUser, getProfile, login} from "../controllers/users/users.controller";
import { userLoginValidation,userRegisterValidation } from "../middlewares/Users/userValidation";
import { verifyToken } from "../middlewares/verify/verifyToken";
const router: Router = express.Router();

router.post("/login",  userLoginValidation , login);
router.post("/register", userRegisterValidation, createUser);
router.post("/profile",  verifyToken , getProfile);

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", userRegisterValidation, updateUser);
router.delete("/:id", deleteUser);



export default router;
