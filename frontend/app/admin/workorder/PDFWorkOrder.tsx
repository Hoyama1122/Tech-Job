"use client";
import React, { useRef } from "react";
import "./workorder.css";
import formatThaiDateTime from "@/lib/Format/DateFormatThai";
import DateFormatWork from "@/lib/Format/DateForWork";

export const PDFWorkOrder = ({ job }) => {


  return (
    <div className="p-4">
      <div className="flex flex-col mt-4 px-4">
        {/* PDF */}
        <div
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            backgroundColor: "#ffffff",
            color: "#111827",
            overflow: "hidden",
            width: "800px",
            height: "1200px",
            padding: "24px",
            margin: "0 auto 40px auto",
            boxSizing: "border-box",

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* header บริษัท */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* โลโก้ / ชื่อบริษัท */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1f2933",
                }}
              >
                LOGO
              </div>
              <div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Tech Job Service
                </div>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>
                  123 ถนนสุขุมวิท แขวงบางนา เขตบางนา กรุงเทพมหานคร 10260
                </div>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>
                  โทร: 02-000-0000 • อีเมล: support@techjob.com
                </div>
              </div>
            </div>

            {/* ช่อง QR / รหัสเอกสาร */}
            <div style={{ textAlign: "right", fontSize: "12px" }}>
              <div style={{ marginTop: "40px" }}>
                เลขที่เอกสาร: <b>WO-2025-0001</b>
              </div>
              <div>พิมพ์เมื่อ: 13/11/2025</div>
            </div>
          </div>

          <hr style={{ borderColor: "#e5e7eb", margin: "12px 0 16px 0" }} />

          {/* title ใบงาน */}
          <div style={{ flex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "0.03em",
                }}
              >
                ใบรายละเอียดงาน (WORK ORDER)
              </div>
            </div>

            {/* ข้อมูลหลักของงาน */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <Row label="รหัสใบงาน" value={job.JobId} />
                <Row label="ชื่องาน" value={job.title} />
                <Row label="ลูกค้า" value={job.customer?.name} />
                <Row label="สถานที่" value={job.customer?.address} />
              </div>
              <div style={{ flex: 1 }}>
                <Row
                  label="วันที่แจ้งงาน"
                  value={DateFormatWork(job.createdAt)}
                />
                <Row
                  label="วันที่เริ่มทำงาน"
                  value={DateFormatWork(job.dateRange?.startAt)}
                />
                <Row
                  label="วันที่สิ้นสุดงาน"
                  value={DateFormatWork(job.dateRange?.endAt)}
                />
                <Row label="เบอร์โทรลูกค้า" value={job.customer?.phone} />
              </div>
            </div>

            {/* รายละเอียดอาการ / การดำเนินการ */}
            <Section title="รายละเอียดอาการ">
              <p
                style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}
              >
                {job.technicianReport?.detail}
              </p>
            </Section>

            <Section title="ผลการตรวจสอบ">
              <p
                style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}
              >
                {job.technicianReport?.inspectionResults}
              </p>
            </Section>

            <Section title="การดำเนินการซ่อม">
              <p
                style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}
              >
                {job.technicianReport?.repairOperations}
              </p>
            </Section>
            {/*  */}
            {/* <Section title="อุปกรณ์ที่ใช้ในงาน">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr>
                  <Th>ลำดับ</Th>
                  <Th>รายการอุปกรณ์</Th>
                  <Th>จำนวน</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td center>1</Td>
                  <Td>Contact Cleaner</Td>
                  <Td center>1</Td>
                </Tr>
              </tbody>
            </table>
          </Section> */}

            {/* ตารางทีมช่าง */}
            <Section title="ทีมช่างที่เข้าดำเนินการ">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr>
                    <Th>ลำดับ</Th>
                    <Th>ชื่อช่าง</Th>
                    <Th>ตำแหน่ง</Th>
                    <Th>เวลาเริ่ม</Th>
                    <Th>เวลาเสร็จ</Th>
                  </tr>
                </thead>
                <tbody>
                  {job.technician?.map((tech, index) => (
                    <Tr key={tech.id}>
                      <Td center>{index + 1}</Td>
                      <Td>{tech.name}</Td>
                      <Td>{tech.department}</Td>

                    
                      <Td>{formatThaiDateTime(job.dateRange.startAt)}</Td>
                      <Td>{formatThaiDateTime(job.dateRange.endAt)}</Td>
                    </Tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* สรุปผล */}
            <Section title="สรุปผลการดำเนินงาน">
              <p
                style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}
              >
                {job.technicianReport?.summaryOfOperatingResults}
              </p>
            </Section>
          </div>

          {/* ลายเซ็น */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "28px",
              fontSize: "14px",
            }}
          >
            <SignatureBox
              title="ผู้ดำเนินการ"
              name="นายโฟล์ค เทสระบบ"
              position="หัวหน้าช่างไฟ"
              signatureSrc={job?.technicianReport?.technicianSignature}
            />
            <SignatureBox
              title="ผู้ตรวจสอบ / หัวหน้า"
              name="นายออย ตัวอย่าง"
              position="Supervisor"
            />
            <SignatureBox
              title="ผู้รับมอบงาน (ลูกค้า)"
              name="................................"
              position=""
            />
          </div>

          {/* footer */}
          <div
            style={{
              marginTop: "24px",
              fontSize: "10px",
              color: "#9ca3af",
              textAlign: "right",
            }}
          >
            เอกสารนี้สร้างจากระบบ Tech Job สำหรับโปรเจคการศึกษา
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      marginBottom: "4px",
    }}
  >
    <div style={{ width: "40%", color: "#6b7280" }}>{label}</div>
    <div style={{ flex: 1, fontWeight: 500 }}>{value}</div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginTop: "14px" }}>
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#111827",
        marginBottom: "4px",
      }}
    >
      {title}
    </div>
    <div>{children}</div>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th
    style={{
      border: "1px solid #e5e7eb",
      padding: "6px 8px",
      textAlign: "center",
      backgroundColor: "#f9fafb",
      fontWeight: 600,
    }}
  >
    {children}
  </th>
);

const Tr = ({ children }: { children: React.ReactNode }) => (
  <tr style={{}}>{children}</tr>
);

const Td = ({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) => (
  <td
    style={{
      border: "1px solid #e5e7eb",
      padding: "6px 8px",
      textAlign: center ? "center" : "left",
    }}
  >
    {children}
  </td>
);

const SignatureBox = ({
  title,
  name,
  position,
  signatureSrc,
}: {
  title: string;
  name: string;
  position?: string;
  signatureSrc?: string | null;
}) => (
  <div
    style={{
      flex: 1,
      paddingTop: "8px",
      marginTop: "100px",
      textAlign: "center",
    }}
  >
    {/* Signature Image */}
    <div style={{ height: "60px", marginBottom: "8px" }}>
      {signatureSrc ? (
        <img
          src={signatureSrc}
          alt="signature"
          style={{
            width: "120px",
            height: "60px",
            objectFit: "contain",
            margin: "0 auto",
          }}
        />
      ) : (
        <div></div>
      )}
    </div>

    <div
      style={{
        marginBottom: "12px",
        fontSize: "12px",
        color: "#6b7280",
        borderTop: "1px solid #d1d5db",
      }}
    >
      ลายเซ็น {title}
    </div>

    <div style={{ fontSize: "12px", fontWeight: 500 }}>{name}</div>

    {position && (
      <div style={{ fontSize: "11px", color: "#6b7280" }}>{position}</div>
    )}
  </div>
);
