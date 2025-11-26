import SummaryModal from "./SummaryModal";
import SupervisorListModal from "./SupervisorListModal";
import TechnicianListModal from "./TechnicianListModal";
import TechnicianListModalDepartment from "./TechnicianListModalDepartment";

const RenderModal = ({ detail, users, card, onClose, }) => {

  const auth = localStorage.getItem("auth-storage");
  const parsedAuth = auth ? JSON.parse(auth) : [];


  if (!detail) return null;
  
  switch (detail.type) {
    case "technicians":
      return (
        <TechnicianListModal
          technicians={users.filter(u => u.role === "technician")}
          onClose={() => onClose()}
        />
      );

    case "techniciansDepartment":
      return (
        <TechnicianListModalDepartment
          technicians={users.filter(u => u.role === "technician" && u.department === parsedAuth.state.department)}
          onClose={() => onClose()}
        />
      );

    case "supervisors":
      return (
        <SupervisorListModal
          supervisors={users.filter(u => u.role === "supervisor")}
          onClose={() => onClose(null)}
        />
      );

    // case "jobs_all":
    //   return (
    //     <JobListModal
    //       jobs={card}
    //       onClose={() => setDetail(null)}
    //     />
    //   );

    // case "jobs_waiting":
    //   return (
    //     <JobListModal
    //       jobs={card.filter(j => j.status === "รอการตรวจสอบ")}
    //       onClose={() => setDetail(null)}
    //     />
    //   );

    
  }
};
export default RenderModal;