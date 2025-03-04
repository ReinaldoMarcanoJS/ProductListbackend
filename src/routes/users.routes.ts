import express, { Router } from "express";
import {getUsers, getUser, updateUser, deleteUser} from "../controllers/users/users.controller";
import { userRegisterValidation } from "../middlewares/Users/userValidation";
const router: Router = express.Router();


router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", userRegisterValidation, updateUser);
router.delete("/:id", deleteUser);



export default router;
