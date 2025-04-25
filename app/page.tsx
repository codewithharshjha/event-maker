"use client"


import Home from "@/pages/Home";
import { Suspense } from "react";
export default function Page() {


  return (
    <>
    <Suspense>

    <Home/>
    </Suspense>
    </>
  );
}
