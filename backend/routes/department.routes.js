import Router from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../controller/departmenet.controller.js";

const departmentRoute = Router();

departmentRoute.get("/", getDepartments);
departmentRoute.get("/:id", getDepartmentById);
departmentRoute.post("/", createDepartment);
departmentRoute.put("/:id", updateDepartment);
departmentRoute.delete("/:id", deleteDepartment);

export default departmentRoute;