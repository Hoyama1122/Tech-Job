// คานนท์ทำเพิ่ม

import express from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller.js";
import { authCheck } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authCheck, getMyProfile);
router.put("/", authCheck, updateMyProfile);

export default router;