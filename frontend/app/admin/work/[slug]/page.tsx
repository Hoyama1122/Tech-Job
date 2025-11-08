"use client";
import { notFound, useRouter } from "next/navigation";
import React, { useState } from "react";

const page = ({ params }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { slug } = React.use(params);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [job, setJob] = useState(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(true);
  return <div></div>;
};

export default page;
