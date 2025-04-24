"use client"
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Home from "@/pages/Home";
export default function Page() {
  const {user,loading}=useAuth()

  return (
    <>
    <Home/>
    </>
  );
}
