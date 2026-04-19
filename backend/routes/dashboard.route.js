import Router from "express";
import { getJobStats } from "../controller/dashboard.controller.js"; // ✅ เพิ่ม .js

const dashboardRoute = Router();

dashboardRoute.get("/stats", getJobStats);

export default dashboardRoute;