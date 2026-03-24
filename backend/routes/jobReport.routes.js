import Router from "express";
import {} from "../controller/job.controller.js";
import { upload } from "../lib/upload.js";
import {
  createJobReport,
  deleteJobReport,
  getJobReportById,
  getJobReports,
  updateJobReport,
} from "../controller/jobreport.controller.js";
const jobReportRouter = Router();

jobReportRouter.get("/", getJobReports);
jobReportRouter.get("/:id", getJobReportById);
jobReportRouter.delete("/:id", deleteJobReport);
(jobReportRouter.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "cus_sign", maxCount: 1 },
  ]),
  createJobReport,
),
  jobReportRouter.put(
    "/:id",
    upload.fields([
      { name: "images", maxCount: 10 },
      { name: "cus_sign", maxCount: 1 },
    ]),
    updateJobReport,
  ));

export default jobReportRouter;
