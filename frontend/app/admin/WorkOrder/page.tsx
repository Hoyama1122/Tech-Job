"use client";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./workorder.css";

const Page = () => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save("work-order.pdf");
  };

  return (
    <div>
      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop: "0",
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "4px 6px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        PDF
      </button>
      <div
        className=" flex flex-col mt-4 px-4"
        style={{ backgroundColor: "#fffff" }}
      >
        <div ref={pdfRef} className="container-workorder">
          <div>
            <h1 className="">ใบรายละเอีดยงาน</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
