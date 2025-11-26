function sendNotificationToTechnicians(techIds: number[], job: any) {
  const users = JSON.parse(localStorage.getItem("Users") || "[]");

  const updated = users.map((u: any) => {
    if (!techIds.includes(u.id)) return u;

    if (!u.notifications) u.notifications = [];

    u.notifications.push({
      id: +1,
      jobId: job.JobId,
      message: `มีใบงานใหม่: ${job.title}`,
      createdAt: new Date().toISOString(),
      read: false,
    });

    return u;
  });

  localStorage.setItem("Users", JSON.stringify(updated));
}
export { sendNotificationToTechnicians };
