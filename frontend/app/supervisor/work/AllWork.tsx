import Card from "@/components/Supervisor/work/Card";
import React from "react";

const Allwork = () => {
  return (
    <div className="mt-4">
      <div className="flex itc justify-between">
        <h1 className="font-title">ใบงานทั้งหมด</h1>
      </div>
      <div className="mt-5 ">
        <Card />
      </div>
    </div>
  );
};

export default Allwork;
