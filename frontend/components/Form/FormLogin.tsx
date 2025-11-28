"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import logo from "@/public/Logo/Logotechjob.png";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type LoginFormInputs = {
  email: string;
  password: string;
};

const FormLogin = () => {
  const [show, setShow] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    const role = login(data.email, data.password);

    if (role) {
      toast.success("เข้าสู่ระบบสำเร็จ!");
      switch (role) {
        case "admin":
          router.push("/admin");
          break;
        case "supervisor":
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
      className="w-full max-w-sm space-y-6"
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
        ยินดีต้อนรับกลับ!
      </h2>

      <div className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-base font-medium text-white/80 mb-2">
            อีเมลของคุณ
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full border-transparent rounded-lg p-4 
            bg-blue-900 text-white text-lg placeholder-white/80 
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-offset-blue-950 focus:ring-blue-500"
            placeholder="example@gmail.com"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-base font-medium text-gray-300 mb-2">
            รหัสผ่าน
          </label>
          <input
            {...register("password")}
            type={show ? "text" : "password"}
            className="w-full border-transparent rounded-lg p-4 bg-blue-900 text-white text-lg placeholder-white/80"
            placeholder="กรอกรหัสผ่าน"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-[6px] top-[43px] text-white cursor-pointer hover:bg-primary/80 p-2 rounded-full"
          >
            {show ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-100 text-blue-950 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors mt-4 cursor-pointer"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </form>
  );
};

export default FormLogin;
