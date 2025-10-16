"use client";

import React from "react";
import LandingNavbar from "./landing-navbar";
import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import HowItWorksSection from "./how-it-works-section";
import HeroBackground from "@/components/layout/hero-background";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <HeroBackground />

      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />
      </main>
    </div>
  );
}
