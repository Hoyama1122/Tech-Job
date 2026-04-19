import { getJobStats as getJobStatsService } from "../service/dashboard.service.js";

export const getJobStats = async (req, res) => {
  try {
    const stats = await getJobStatsService();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};