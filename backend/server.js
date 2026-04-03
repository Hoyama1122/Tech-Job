import dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import departmentRoute from "./routes/department.routes.js";
import jobRouter from "./routes/job.routes.js";
import jobReportRouter from "./routes/jobReport.routes.js";
import userRouter from "./routes/user.routes.js";
import routerProfile from "./routes/profile.routes.js";
import chatRouter from "./routes/chat.routes.js";
import { swaggerSpec } from "./swagger.js";
const PORT = process.env.PORT || 5000;

import { createServer } from "http";
import setupSocket from "./lib/socket.js";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
setupSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ระบุ Method ให้ชัดเจน
    allowedHeaders: ["Content-Type", "Authorization"], // ระบุ Header ที่อนุญาต
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  next();
});
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRoute);
app.use("/api/jobs", jobRouter);
app.use("/api/job-reports", jobReportRouter);
app.use("/api/users", userRouter);
app.use("/api/profile", routerProfile);
app.use("/api/chat", chatRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
