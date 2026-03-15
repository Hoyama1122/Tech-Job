import Router from 'express';
import { craeteJob, getJobs } from '../controller/job.controller.js';
const jobRouter = Router();

jobRouter.get('/',getJobs)
jobRouter.post('/',craeteJob)

export default jobRouter