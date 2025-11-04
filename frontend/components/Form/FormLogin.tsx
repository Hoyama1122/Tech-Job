"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";

type LoginFormInputs = {
  email: string;
  password: string;
};

const FormLogin = () => {
  const { login } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    const role = login(data.email, data.password); // ✅ return role

    if (role) {
      toast.success("เข้าสู่ระบบสำเร็จ!");
      switch (role) {
        case "admin":
          router.push("/admin");
          break;
        case "supervisor":
          console.log("supervisor");

          router.push("/supervisor");
          break;
        case "technician":
          router.push("/technician");
          break;
        case "executive":
          router.push("/executive");
          break;
        default:
          toast.error("ไม่สามารถเข้าสู่ระบบได้!");
          router.push("/");
      }
    } else {
      toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto border p-4 rounded space-y-4"
    >
      <div>
        <label className="block mb-1">อีเมล</label>
        <input
          {...register("email")}
          type="text"
          className="w-full border rounded p-2"
          placeholder="ชื่อผู้ใช้"
        />
      </div>

      <div>
        <label className="block mb-1">รหัสผ่าน</label>
        <input
          {...register("password")}
          type="password"
          className="w-full border rounded p-2"
          placeholder="รหัสผ่าน"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        เข้าสู่ระบบ
      </button>
    </form>
  );
};

export default FormLogin;
