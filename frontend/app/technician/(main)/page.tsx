import React from "react";
import Dashboard from "./Dashboard";
export const metadata = {
  title: "Technician",
  description: "A modern ecommerce platform",
};
const page = () => {
  return (
    <div className="bg-gray-50">
      <Dashboard />
    </div>
  );
};

export default page;
