"use client";

import React from "react";
import LandingPage from "@/components/landing/landing-page";
import NoSSR from "@/components/common/no-ssr";

export default function Home() {
  return (
    <NoSSR>
      <LandingPage />
    </NoSSR>
  );
}
