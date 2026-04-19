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
          technicians={users.filter(u => u.role === "TECHNICIAN")}
          onClose={onClose}
        />
      );

    case "techniciansDepartment":
      return (
        <TechnicianListModalDepartment
          technicians={users.filter(u => 
            u.role === "TECHNICIAN" && 
            (currentUser?.departmentId ? u.departmentId === currentUser.departmentId : true)
          )}
          onClose={onClose}
        />
      );

    case "supervisors":
      return (
        <SupervisorListModal
          supervisors={users.filter(u => u.role === "SUPERVISOR")}
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
          jobs={card.filter(j => {
            const s = j.status?.toUpperCase();
            return s === "SUBMITTED" || s === "PENDING" || j.status === "ส่งงานแล้ว" || j.status === "รอการตรวจสอบ";
          })}
          title="ใบงานที่รอการตรวจสอบ"
          icon={<Clock size={24} />}
          onClose={onClose}
        />
      );

    default:
      return null;
  }
};
export default RenderModal;