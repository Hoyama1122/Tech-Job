"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

import logo from "@/public/Logo/Logotechjob.png";
import { authService, UserRole } from "@/services/auth.service";

type LoginFormInputs = {
  email: string;
  password: string;
};

const rolePathMap: Record<UserRole, string> = {
  ADMIN: "/admin",
  SUPERVISOR: "/supervisor",
  TECHNICIAN: "/technician",
  EXECUTIVE: "/executive",
  SUPERADMIN: "/superadmin",
};

const FormLogin = () => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await authService.login(data);
      const role = res.role;

      if (!role) {
        toast.error("ไม่พบ role");
        return;
      }

      const path = rolePathMap[role];

      if (!path) {
        toast.error("role ไม่ถูกต้อง");
        return;
      }

      toast.success("เข้าสู่ระบบสำเร็จ");
      router.push(path);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6"
    >
      <div className="flex justify-center">
        <Image
          src={logo}
          alt="Tech Job"
          width={160}
          height={160}
          className="object-contain"
        />
      </div>

      <h2 className="text-center text-3xl font-bold text-white">
        ยินดีต้อนรับเข้าสู่ระบบ Tech Job
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-base font-medium text-white/80">
            อีเมลของคุณ
          </label>
          <input
            {...register("email", {
              required: "กรุณากรอกอีเมล",
            })}
            type="email"
            className="w-full rounded-lg border-transparent bg-blue-900 p-4 text-lg text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950"
            placeholder="example@gmail.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <label className="mb-2 block text-base font-medium text-gray-300">
            รหัสผ่าน
          </label>
          <input
            {...register("password", {
              required: "กรุณากรอกรหัสผ่าน",
            })}
            type={show ? "text" : "password"}
            className="w-full rounded-lg border-transparent bg-blue-900 p-4 pr-14 text-lg text-white placeholder-white/80"
            placeholder="กรอกรหัสผ่าน"
          />
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-[6px] top-[43px] cursor-pointer rounded-full p-2 text-white hover:bg-primary/80"
          >
            {show ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
          {errors.password && (
            <p className="mt-2 text-sm text-red-300">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full cursor-pointer rounded-full bg-gray-100 py-3 text-lg font-semibold text-blue-950 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </div>
    </form>
  );
};

export default FormLogin;