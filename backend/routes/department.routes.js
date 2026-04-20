import Router from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../controller/departmenet.controller.js";

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management
 */

const departmentRoute = Router();

/**
 * @swagger
 * /api/department:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments
 */
departmentRoute.get("/", getDepartments);

/**
 * @swagger
 * /api/department/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department data
 *       404:
 *         description: Department not found
 */
departmentRoute.get("/:id", getDepartmentById);

/**
 * @swagger
 * /api/department:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created
 */
departmentRoute.post("/", createDepartment);

/**
 * @swagger
 * /api/department/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
departmentRoute.put("/:id", updateDepartment);

/**
 * @swagger
 * /api/department/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
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
departmentRoute.delete("/:id", deleteDepartment);

export default departmentRoute;