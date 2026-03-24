// คานนท์ทำเพิ่ม

"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/services/profile";

type ProfileForm = {
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  avatar: string;
  gender: string;
  birthday: string;
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    avatar: "",
    gender: "",
    birthday: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const profile = res?.data?.profile || res?.data?.Profile || res?.data;
        const p = profile?.profile || profile;

        setForm({
          firstname: p?.firstname || "",
          lastname: p?.lastname || "",
          phone: p?.phone || "",
          address: p?.address || "",
          avatar: p?.avatar || "",
          gender: p?.gender || "",
          birthday: p?.birthday ? String(p.birthday).slice(0, 10) : "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateMyProfile(form);
      alert("บันทึกโปรไฟล์สำเร็จ");
    } catch (error: any) {
      alert(error?.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">โปรไฟล์ของฉัน</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input name="firstname" value={form.firstname} onChange={onChange} placeholder="ชื่อ" className="w-full border p-2 rounded" />
        <input name="lastname" value={form.lastname} onChange={onChange} placeholder="นามสกุล" className="w-full border p-2 rounded" />
        <input name="phone" value={form.phone} onChange={onChange} placeholder="เบอร์โทร" className="w-full border p-2 rounded" />
        <input name="address" value={form.address} onChange={onChange} placeholder="ที่อยู่" className="w-full border p-2 rounded" />
        <input name="avatar" value={form.avatar} onChange={onChange} placeholder="Avatar URL" className="w-full border p-2 rounded" />
        <select name="gender" value={form.gender} onChange={onChange} className="w-full border p-2 rounded">
          <option value="">เลือกเพศ</option>
          <option value="MALE">ชาย</option>
          <option value="FEMALE">หญิง</option>
          <option value="OTHER">อื่น ๆ</option>
        </select>
        <input name="birthday" type="date" value={form.birthday} onChange={onChange} className="w-full border p-2 rounded" />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </form>
    </div>
  );
}