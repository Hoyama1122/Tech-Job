import { Router } from "express";
import { createItem, getItemById, getItems, updateItem, deleteItem } from "../controller/item.controller.js";
import { verifyToken, allowRoles } from "../lib/middleware.js";

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item/Stock management
 */

const itemRouter = Router();

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items
 */
itemRouter.get("/", verifyToken, getItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item data
 */
itemRouter.get("/:id", verifyToken, getItemById);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Item created
 */
itemRouter.post("/", verifyToken, allowRoles("ADMIN", "SUPERADMIN","SUPERVISOR"), createItem);

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
itemRouter.put("/:id", verifyToken, allowRoles("ADMIN", "SUPERADMIN","SUPERVISOR"), updateItem);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
itemRouter.delete("/:id", verifyToken, allowRoles("ADMIN", "SUPERADMIN","SUPERVISOR"), deleteItem);

export default itemRouter;
