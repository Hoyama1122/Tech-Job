const page = () => {
  return (
    <div className="p-4 md:p-10 mx-auto max-w-4xl bg-white min-h-screen">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          นโยบายความเป็นส่วนตัว (Privacy Policy)
        </h1>
        <p className="text-gray-600 mt-2">
          เว็บไซต์ Tech Job: ระบบมอบหมายงานจากผู้ดูแลระบบ
        </p>
      </header>

      <section className="mb-10 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
        <p className="text-gray-800 leading-relaxed">
          นโยบายนี้จัดทำขึ้นเพื่อให้ความกระจ่างเกี่ยวกับการเก็บ, การใช้,
          และการเปิดเผยข้อมูลของ **ช่าง (Technicians)**
          โดยเฉพาะอย่างยิ่งข้อมูลด้านตำแหน่งที่ตั้ง (Location Data)
          และประสิทธิภาพการทำงานของท่านในระบบของเรา
        </p>
      </section>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-b pb-1">
            2.1. ข้อมูลส่วนบุคคลที่เราจัดเก็บ
          </h2>
          <p className="mb-4">
            เราเก็บรวบรวมข้อมูลส่วนบุคคลจากผู้ใช้งานดังต่อไปนี้:
          </p>

          <div className="space-y-6">
            <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
              <h3 className="font-bold text-lg text-green-700 mb-2">
                ช่าง (Technicians)
              </h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  **ข้อมูลระบุตัวตน:** ชื่อ-นามสกุล, หมายเลขโทรศัพท์, อีเมล,
                  บัญชีธนาคาร (เพื่อการจ่ายค่าตอบแทน), สำเนาเอกสารที่เกี่ยวข้อง
                  (เช่น ใบอนุญาตขับขี่, ใบรับรองฝีมือช่าง)
                </li>
                <li>
                  **ข้อมูลตำแหน่งที่ตั้ง (Location Data):** ข้อมูล GPS
                  ขณะเข้าใช้งานแอปพลิเคชันหรือขณะรับมอบหมายงาน
                  เพื่อให้แอดมินสามารถมอบหมายงานที่ใกล้ที่สุดและติดตามสถานะงานได้
                </li>
                <li>
                  **ข้อมูลประสิทธิภาพ:** เวลาที่ใช้ในการเดินทาง,
                  เวลาที่ใช้ในการทำงาน, คะแนนประเมินจากแอดมิน/ลูกค้า
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-b pb-1">
            2.2. วัตถุประสงค์ของการใช้ข้อมูล
          </h2>
          <p className="mb-3">
            เราใช้ข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังต่อไปนี้:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              **การมอบหมายและจัดการงาน:**
              เพื่อให้ผู้ดูแลระบบสามารถมอบหมายงานให้กับช่างที่เหมาะสมที่สุดตามทักษะและความใกล้เคียงของตำแหน่งที่ตั้ง
            </li>
            <li>
              **การติดตามงาน:** เพื่อติดตามความคืบหน้าของงานแบบเรียลไทม์
              และแจ้งสถานะแก่ผู้ใช้บริการ (หากเกี่ยวข้อง)
            </li>
            <li>
              **การคำนวณและจ่ายค่าตอบแทน:**
              เพื่อดำเนินการจ่ายค่าตอบแทนที่ถูกต้องให้กับช่างตามเวลาและสถานะของงานที่ทำเสร็จ
            </li>
            <li>
              **การปรับปรุงระบบ:** เพื่อวิเคราะห์ข้อมูลประสิทธิภาพ (Performance
              Data) ในการปรับปรุงกระบวนการมอบหมายงานและคุณภาพการให้บริการ
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-b pb-1">
            2.3. การเปิดเผยข้อมูลส่วนบุคคล
          </h2>
          <p className="mb-3">
            เราอาจเปิดเผยข้อมูลส่วนบุคคลของท่านภายใต้ขอบเขตที่จำเป็นและชอบด้วยกฎหมาย:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              **การเปิดเผยข้อมูลช่างต่อผู้ใช้บริการ (Customer):**
              เราจะเปิดเผยข้อมูลที่จำเป็นต่อการปฏิบัติงานเท่านั้น เช่น
              **ชื่อ-นามสกุลของช่าง, รูปโปรไฟล์ (ถ้ามี),
              และตำแหน่งที่ตั้งโดยประมาณขณะเดินทางไปรับงาน**
              
            </li>
            <li>
              **การเปิดเผยต่อผู้ประมวลผลข้อมูล:** เช่น ผู้ให้บริการระบบคลาวด์
              (Cloud Provider), ผู้ให้บริการระบบจ่ายเงิน (Payment Gateway)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-b pb-1">
            2.4. สิทธิของเจ้าของข้อมูล (Data Subject Rights)
          </h2>
          <p className="mb-3">
            ช่างและผู้ดูแลระบบมีสิทธิ์ในการดำเนินการกับข้อมูลส่วนบุคคลของท่าน:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>**เข้าถึง (Access):** ขอสำเนาข้อมูลส่วนบุคคลที่ท่านมอบให้</li>
            <li>**แก้ไข (Rectification):** ขอแก้ไขข้อมูลที่ไม่ถูกต้อง</li>
            <li>
              **คัดค้าน (Object):** คัดค้านการประมวลผลข้อมูลบางประเภท (เช่น
              การเก็บข้อมูลตำแหน่งที่ตั้ง เมื่อไม่ได้อยู่ในระหว่างปฏิบัติงาน)
            </li>
            <li>
              **ลบ (Erasure):**
              ขอให้ลบข้อมูลส่วนบุคคลเมื่อไม่มีเหตุผลทางกฎหมายให้เก็บรักษาต่อไป
            </li>
          </ul>
        </section>
      </div>

      <footer className="mt-12 text-sm text-gray-500 border-t pt-4">
        *นโยบายนี้มีผลบังคับใช้ตั้งแต่วันที่ [27 พฤศจิกายน 2568] เป็นต้นไป
      </footer>
    </div>
  );
};
export default page;
