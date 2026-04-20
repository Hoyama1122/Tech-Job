import SummaryModal from "./SummaryModal";
import SupervisorListModal from "./SupervisorListModal";
import TechnicianListModal from "./TechnicianListModal";
import TechnicianListModalDepartment from "./TechnicianListModalDepartment";
import JobListModal from "./JobListModal";
import { ClipboardList, Clock } from "lucide-react";

const RenderModal = ({ detail, users, card, currentUser, onClose }) => {
  if (!detail) return null;

  switch (detail.type) {
    case "technicians":
      return (
        <TechnicianListModal
          technicians={users.filter((u) => u.role === "TECHNICIAN")}
          onClose={onClose}
        />
      );

    case "techniciansDepartment":
      return (
        <TechnicianListModalDepartment
          // ✅ users ที่ส่งมาจาก MainSupervisor กรอง dept แล้ว
          // แค่ filter เฉพาะ TECHNICIAN (กัน supervisor ที่ isMe ออก)
          technicians={users.filter((u) => u.role === "TECHNICIAN")}
          onClose={onClose}
        />
      );

    case "supervisors":
      return (
        <SupervisorListModal
          supervisors={users.filter((u) => u.role === "SUPERVISOR")}
          onClose={onClose}
        />
      );

    case "jobs_all":
      return (
        <JobListModal
          jobs={card}
          title="ใบงานทั้งหมด"
          icon={<ClipboardList size={24} />}
          onClose={onClose}
        />
      );

    case "jobs_waiting":
      return (
        <JobListModal
          jobs={card.filter((j) => {
            const s = j.status?.toUpperCase();
            return s === "SUBMITTED" || s === "PENDING";
          })}
          title="ใบงานที่รอการตรวจสอบ"
          icon={<Clock size={24} />}
          onClose={onClose}
        />
      );

    case "jobs_working":
      return (
        <JobListModal
          jobs={card.filter((j) => j.status === "IN_PROGRESS")}
          title="ใบงานที่กำลังทำ"
          icon={<Clock size={24} />}
          onClose={onClose}
        />
      );

    default:
      return (
        <SummaryModal data={detail} onClose={onClose} />
      );
  }
};

export default RenderModal;