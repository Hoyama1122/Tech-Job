import React from "react";
import SignInForm from "./signin-form";
export const metadata = {
  title: "เข้าสู่ระบบ",
  description: "เข้าสู่ระบบ Tech Job",
};
const page = () => {
  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default page;
