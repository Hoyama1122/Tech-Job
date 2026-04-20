import Router from "express";
import { login, logout, me } from "../controller/auth.controller.js";
import { authCheck, verifyToken } from "../lib/middleware.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

const authRouter = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid credentials
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from the system
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success
 */
authRouter.post("/logout", logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/me", verifyToken, authCheck, me);

export default authRouter;