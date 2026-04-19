import { Router } from "express";
import { createItem, getItemById, getItems, updateItem, deleteItem } from "../controller/item.controller.js";
import { verifyToken, allowRoles } from "../lib/middleware.js";

const itemRouter = Router();

itemRouter.get("/", verifyToken, getItems);
itemRouter.get("/:id", verifyToken, getItemById);
itemRouter.post("/", verifyToken, allowRoles("ADMIN", "SUPERADMIN","SUPERVISOR"), createItem);
itemRouter.put("/:id", verifyToken, allowRoles("ADMIN", "SUPERADMIN","SUPERVISOR"), updateItem);
itemRouter.delete("/:id", verifyToken, allowRoles("ADMIN", "SUPERADMIN","SUPERVISOR"), deleteItem);

export default itemRouter;
