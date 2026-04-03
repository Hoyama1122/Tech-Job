import Router from "express";
import { login, logout, me } from "../controller/auth.controller.js";
import { authCheck, verifyToken } from "../lib/middleware.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", verifyToken,authCheck, me);

export default authRouter;