import Router from "express";
import {
  createDepartment,
  getDepartments,
} from "../controller/departmenet.controller.js";
const departmentRoute = Router();

departmentRoute.get("/", getDepartments);
departmentRoute.post("/", createDepartment);

export default departmentRoute;
