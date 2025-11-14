"use client";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./workorder.css"; // ถ้ามีจะใช้แค่ layout ภายนอก

const Page = () => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;

    // แปลง DOM เป็นภาพ
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

    // แปลงเป็น blob แล้วเปิดแท็บใหม่
    const pdfBlob = pdf.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, "_blank"); // 👈 เด้งแท็บใหม่เหมือนที่มึงบอกว่าโอเค
  };

  return (
    <div className="p-4">
      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop: 0,
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        เปิด PDF
      </button>

      <div className="flex flex-col mt-4 px-4">
        {/* PDF */}
        <div
          ref={pdfRef}
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            backgroundColor: "#ffffff",
            color: "#111827",
            padding: "24px",
            width: "800px",
            height: "1200px",
            margin: "0 auto 40px auto",
            
            border: "1px solid #e5e7eb",
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
              
              <div style={{marginTop:"40px"}}>เลขที่เอกสาร: <b>WO-2025-0001</b></div>
              <div>พิมพ์เมื่อ: 13/11/2025</div>
            </div>
          </div>

          <hr style={{ borderColor: "#e5e7eb", margin: "12px 0 16px 0" }} />

          {/* title ใบงาน */}
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
              <Row label="รหัสใบงาน" value="JOB_001" />
              <Row label="ชื่องาน" value="ตรวจสอบระบบไฟฟ้าอาคารสำนักงาน" />
              <Row label="ลูกค้า" value="บริษัท ตัวอย่าง จำกัด" />
              <Row label="สถานที่" value="อาคาร A ชั้น 5 ห้องเครื่อง" />
            </div>
            <div style={{ flex: 1 }}>
              <Row label="วันที่แจ้งงาน" value="10/11/2025 09:30" />
              <Row label="วันที่เริ่มทำงาน" value="11/11/2025 12:00" />
              <Row label="วันที่สิ้นสุดงาน" value="11/11/2025 17:00" />
              <Row label="เบอร์โทรลูกค่า" value="0934125122" />
            </div>
          </div>

          {/* รายละเอียดอาการ / การดำเนินการ */}
          <Section title="รายละเอียดอาการ">
            <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}>
              ไฟฟ้าบางส่วนของชั้น 5 ดับเป็นช่วง ๆ ส่งผลให้เครื่องปรับอากาศและปลั๊กไฟบางจุดใช้งานไม่ได้
              มีเสียงดังจากตู้เมนไฟฟ้าเป็นระยะ
            </p>
          </Section>

          <Section title="ผลการตรวจสอบ">
            <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}>
              ตรวจสอบแล้วพบว่ามีจุดต่อสาย (terminal) หลวมภายในตู้เมน ทำให้เกิดความร้อนสะสม
              และมีการอาร์คของกระแสไฟในบางช่วงเวลา จำเป็นต้องทำการขันจุดต่อใหม่และทำความสะอาดจุดสัมผัส
            </p>
          </Section>

          <Section title="การดำเนินการซ่อม">
            <ul
              style={{
                fontSize: "13px",
                color: "#374151",
                lineHeight: 1.6,
                paddingLeft: "18px",
                margin: 0,
              }}
            >
              <li>ตัดระบบไฟในตู้เมนหลัก และติดป้ายห้ามเปิดสวิตช์ (Lockout/Tagout)</li>
              <li>ถอดสายและทำความสะอาดจุดสัมผัสด้วย contact cleaner</li>
              <li>ขันจุดต่อสายทุกจุดให้แน่นตามมาตรฐาน</li>
              <li>ตรวจสอบกระแสและอุณหภูมิหลังเปิดระบบ พร้อมบันทึกค่า</li>
            </ul>
          </Section>

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
                  <Th>ชั่วโมงรวม</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td center>1</Td>
                  <Td>นายโฟล์ค เทสระบบ</Td>
                  <Td>หัวหน้าช่างไฟ</Td>
                  <Td center>10:00</Td>
                  <Td center>14:30</Td>
                  <Td center>4.5</Td>
                </Tr>
                <Tr>
                  <Td center>2</Td>
                  <Td>นายเอ ช่างผู้ช่วย</Td>
                  <Td>ผู้ช่วยช่างไฟ</Td>
                  <Td center>10:00</Td>
                  <Td center>14:30</Td>
                  <Td center>4.5</Td>
                </Tr>
              </tbody>
            </table>
          </Section>

          {/* สรุปผล */}
          <Section title="สรุปผลการดำเนินงาน">
            <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6 }}>
              ระบบไฟฟ้ากลับมาทำงานเป็นปกติ ตรวจสอบอุณหภูมิที่จุดต่อสายไม่พบความผิดปกติ
              แนะนำให้ตรวจเช็คตู้เมนทุก 6 เดือน และบันทึกค่ากระแสในแต่ละเฟส
            </p>
          </Section>

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

/* 🧩 small sub components ให้โค้ดอ่านง่ายขึ้น */

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
  <tr style={{}}>
    {children}
  </tr>
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
}: {
  title: string;
  name: string;
  position?: string;
}) => (
  <div
    style={{
      flex: 1,
      borderTop: "1px solid #d1d5db",
      paddingTop: "8px",
      marginTop:"50px"
    }}
  >
    <div style={{ marginBottom: "32px", fontSize: "12px", color: "#6b7280" }}>
      ลายเซ็น {title}
    </div>
    <div style={{ fontSize: "12px", fontWeight: 500 }}>{name}</div>
    {position && (
      <div style={{ fontSize: "11px", color: "#6b7280" }}>{position}</div>
    )}
  </div>
);

export default Page;
