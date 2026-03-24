import Router from 'express';
import { createJob, deleteJob, getJobById, getJobs, updateJob  } from '../controller/job.controller.js';
import { upload } from '../lib/upload.js';
const jobRouter = Router();

jobRouter.get('/',getJobs)
jobRouter.post('/', upload.fields([
    { name: "images", maxCount: 10 },
  ]), createJob);
jobRouter.get('/:id', getJobById)
jobRouter.put('/:id',upload.fields([
    { name: "images", maxCount: 10 },
  ]), updateJob)
jobRouter.delete('/:id', deleteJob)

export default jobRouter