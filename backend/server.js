import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import departmentRoute from "./routes/department.routes.js";
import jobRouter from "./routes/job.routes.js";
import jobReportRouter from "./routes/jobreport.routes.js";
import userRouter from "./routes/user.routes.js";

const PORT = process.env.PORT || 8000;


const app = express();

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

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRoute);
app.use("/api/jobs", jobRouter);
app.use("/api/job-report", jobReportRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
