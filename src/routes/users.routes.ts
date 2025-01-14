import express, { Router } from "express";
import { createUser, getUsers, getUser, updateUser, deleteUser } from "../controllers/users/users.controller";
import { userValidation } from "../middlewares/Users/userValidation";
const router: Router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/",  userValidation , createUser);
router.put("/:id", userValidation, updateUser);
router.delete("/:id", deleteUser);

export default router;
