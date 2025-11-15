"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import logo from "@/public/Logo/Logotechjob.png";
import Image from "next/image";


type LoginFormInputs = {
  email: string;
  password: string;
};

const FormLogin = () => {
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
    <div className="w-full max-w-sm space-y-6">
      <div className="flex justify-center">
        <Image
        src={logo} alt="Tech Job" width={160} height={160} className="object-contain"
        />
      </div>

      <h2 className="text-center text-3xl font-bold text-white">
        Yooo, welcome back!
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border-transparent rounded-lg p-3 
    bg-blue-900 text-white placeholder-gray-500 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-950 focus:ring-blue-500
    autofill:shadow-[inset_0_0_0px_1000px_rgb(30,58,138)] 
    autofill:text-white"
            placeholder="tech@gmail.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border-transparent rounded-lg p-3 bg-blue-900 text-white placeholder-gray-500"
            placeholder="รหัสผ่าน"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-100 text-blue-950 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
        >
          SignIn
        </button>
      </form>

      <div className="flex items-center justify-between">
        <span className="w-full border-t border-gray-700"></span>
        <span className="px-4 text-gray-500 flex-shrink-0">or</span>
        <span className="w-full border-t border-gray-700"></span>
      </div>

      <button
        type="button"
        
        className="w-full bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
      >
        <span>Sign in with Google</span>
      </button>

      <p className="text-xs text-gray-500 text-center">
        Yooo, welcome back! bhasa basasbasahbas. <br />
        <a href="#" className="underline hover:text-gray-300">
          Terms of Service
        </a>{" "}
        and our{" "}
        <a href="#" className="underline hover:text-gray-300">
          Privacy Policy
        </a>
        .
      </p>
    </div>

  );
};

export default FormLogin;
