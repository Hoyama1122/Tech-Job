import Router from 'express';
import { createJob, deleteJob, getJobById, getJobs, updateJob  } from '../controller/job.controller.js';
import { upload } from '../lib/upload.js';
const jobRouter = Router();

jobRouter.get('/',getJobs)
jobRouter.post('/', upload.array("images", 5), createJob);
jobRouter.get('/:id', getJobById)
jobRouter.put('/:id', updateJob)
jobRouter.delete('/:id', deleteJob)

export default jobRouter