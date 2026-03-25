// คานนท์ทำเพิ่ม

import express from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controller/profile.controller.js";
import { authCheck, verifyToken } from "../lib/middleware.js";

const routerProfile = express.Router();

routerProfile.get("/", verifyToken, authCheck, getMyProfile);
routerProfile.put("/", verifyToken, authCheck, updateMyProfile);

export default routerProfile;
