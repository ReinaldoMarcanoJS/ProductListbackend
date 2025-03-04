import express, { Router } from "express";
import { createClient, deleteClient, getClient, getClients, updateClient } from "../controllers/clients/clients.controller";
const router: Router = express.Router();

router.get("/", getClients);
router.get("/:id", getClient);
router.post("/",  createClient);
router.put("/:id",  updateClient);
router.delete("/:id", deleteClient);



export default router;
