// import React from "react";
// import TablePage from "./TablePage";
// import { Users } from "lucide-react";
// export const metadata = {
//   title: "จัดการผู้ใช้งาน",
// };
// const page = () => {
//   return (
//     <div className="p-4">
//       {/* Header Section */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
//               <Users className="w-8 h-8" />
//               ข้อมูลผู้ใช้งาน
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               รายชื่อผู้ใช้งานทั้งหมด
//             </p>
//           </div>
//         </div>
//       </div>

//       <TablePage />
//     </div>
//   );
// };

// export default page;

"use client";

import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers } from "@/services/user";

type UserItem = {
  id: number;
  email: string;
  empno?: string;
  role?: string;
  profile?: {
    firstname?: string;
    lastname?: string;
    phone?: string;
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    empno: "",
    address: "",
    birthday: "",
    firstname: "",
    lastname: "",
    gender: "",
    departmentId: 1,
    role: "TECHNICIAN",
    phone: "",
    avatar: "",
  });

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data || []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "departmentId"
          ? Number(e.target.value)
          : e.target.value,
    }));
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser(form);
    alert("สร้างผู้ใช้สำเร็จ");
    await loadUsers();
  };

  const onDelete = async (id: number) => {
    if (!confirm("ยืนยันการลบผู้ใช้งาน?")) return;
    await deleteUser(id);
    await loadUsers();
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">จัดการผู้ใช้งาน</h1>
        <form onSubmit={onCreate} className="grid grid-cols-2 gap-3">
          <input name="email" value={form.email} onChange={onChange} placeholder="email" className="border p-2 rounded" />
          <input name="password" value={form.password} onChange={onChange} placeholder="password" className="border p-2 rounded" />
          <input name="empno" value={form.empno} onChange={onChange} placeholder="empno" className="border p-2 rounded" />
          <input name="firstname" value={form.firstname} onChange={onChange} placeholder="firstname" className="border p-2 rounded" />
          <input name="lastname" value={form.lastname} onChange={onChange} placeholder="lastname" className="border p-2 rounded" />
          <input name="phone" value={form.phone} onChange={onChange} placeholder="phone" className="border p-2 rounded" />
          <input name="address" value={form.address} onChange={onChange} placeholder="address" className="border p-2 rounded" />
          <input name="birthday" type="date" value={form.birthday} onChange={onChange} className="border p-2 rounded" />
          <input name="avatar" value={form.avatar} onChange={onChange} placeholder="avatar url" className="border p-2 rounded" />
          <select name="gender" value={form.gender} onChange={onChange} className="border p-2 rounded">
            <option value="">gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
          <select name="role" value={form.role} onChange={onChange} className="border p-2 rounded">
            <option value="TECHNICIAN">TECHNICIAN</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="EXECUTIVE">EXECUTIVE</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPERADMIN">SUPERADMIN</option>
          </select>
          <input name="departmentId" type="number" value={form.departmentId} onChange={onChange} placeholder="departmentId" className="border p-2 rounded" />

          <button className="col-span-2 bg-green-600 text-white p-2 rounded">
            เพิ่มผู้ใช้งาน
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">รายการผู้ใช้งาน</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {user.profile?.firstname} {user.profile?.lastname}
                </p>
                <p>{user.email}</p>
                <p>{user.empno}</p>
                <p>{user.role}</p>
              </div>

              <button
                onClick={() => onDelete(user.id)}
                className="bg-red-600 text-white px-3 py-2 rounded"
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
