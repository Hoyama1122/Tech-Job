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
const notifyTechnicians = (techIds: number[], message: string) => {
  const users = JSON.parse(localStorage.getItem("Users") || "[]");

  const updated = users.map((u: any) => {
    if (u.role === "technician" && techIds.includes(u.id)) {
      const newNoti = {
        id: Date.now(),
        message,
        read: false,
        createdAt: new Date().toISOString(),
      };

      return {
        ...u,
        notifications: u.notifications
          ? [...u.notifications, newNoti]
          : [newNoti],
      };
    }
    return u;
  });

  localStorage.setItem("Users", JSON.stringify(updated));
};

export { notifyTechnicians };