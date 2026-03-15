import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import departmentRoute from "./routes/department.routes.js";
import jobRouter from "./routes/job.routes.js";
const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRoute);
app.use("/api/job", jobRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
