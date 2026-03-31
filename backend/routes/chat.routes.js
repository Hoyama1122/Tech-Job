import Router from "express";
import { getConversations, getMessages, getContacts } from "../controller/chat.controller.js";
import { verifyToken, authCheck } from "../lib/middleware.js";

const chatRouter = Router();

// ต้องการ Token และ User Data
chatRouter.get("/conversations", verifyToken, authCheck, getConversations);
chatRouter.get("/contacts", verifyToken, authCheck, getContacts);
chatRouter.get("/messages/:receiverId", verifyToken, authCheck, getMessages);

export default chatRouter;
