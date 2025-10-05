"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema,LoginFormInputs } from "@/lib/validation";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";



const FormLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login data:", data);
    if(data.username === "admin" && data.password === "admin123"){
      toast.success("เข้าสู่ระบบสําเร็จ ! ");
      redirect("/dashboard")
    }else{
      toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ! ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto p-4 border rounded"
    >
      {/* Username */}
      <div>
        <label className="block mb-1 font-medium">ชื่อผู้ใช้</label>
        <input
          type="text"
          {...register("username")}
          placeholder="ชื่อผู้ใช้"
          className="w-full border rounded p-2"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
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
