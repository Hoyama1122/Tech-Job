"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormInputs } from "@/lib/Validations/validation";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { toLowerCase } from "zod";

const FormLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = (data: LoginFormInputs) => {
    if (
      data.email.toLocaleLowerCase() === "admin@gmail.com" &&
      data.password === "admin123"
    ) {
      localStorage.setItem("token", "admin-token");
      localStorage.setItem("role", "admin");
      toast.success("เข้าสู่ระบบสําเร็จ ! ");
      redirect("/admin");
    }
    if (
      data.email === "supervisor@gmail.com" &&
      data.password === "supervisor"
    ) {
      localStorage.setItem("token", "supervisor-token");
      localStorage.setItem("role", "supervisor");
      toast.success("เข้าสู่ระบบสําเร็จ ! ");
      redirect("/supervisor");
    }
    if (
      data.email === "technician@gmail.com" &&
      data.password === "technician"
    ) {
      localStorage.setItem("token", "technician-token");
      localStorage.setItem("role", "technician");
      toast.success("เข้าสู่ระบบสําเร็จ ! ");
      redirect("/technician");
    } else {
      toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ! ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto p-4 border rounded"
    >
      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">ชื่อผู้ใช้</label>
        <input
          type="text"
          {...register("email")}
          placeholder="ชื่อผู้ใช้"
          className="w-full border rounded p-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 font-medium">รหัสผ่าน</label>
        <input
          type="password"
          {...register("password")}
          placeholder="รหัสผ่าน"
          className="w-full border rounded p-2"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
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
