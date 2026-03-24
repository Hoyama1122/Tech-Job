import Router from 'express';
import { createJob, getJobs  } from '../controller/job.controller.js';
import { upload } from '../lib/upload.js';
const jobRouter = Router();

jobRouter.get('/',getJobs)
jobRouter.post('/', createJob)
// jobRouter.post('/test',upload.array("images", 5),test)


export default jobRouter