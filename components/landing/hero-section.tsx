"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Shield,
  Zap,
  TrendingUp,
  Star,
  ChevronRight,
  Sparkles,
  Globe,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const stats = [
    { label: "Scorable Addresses", value: "200M+", icon: Globe },
    { label: "Blockchains", value: "8", icon: Shield },
    { label: "Lending Protocols", value: "30+", icon: TrendingUp },
    { label: "Repayment Rate", value: "95%+", icon: BarChart3 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14]" />

      {/* Dynamic gradient overlay that follows mouse */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div
            className={`inline-flex mb-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="bg-blue-500/10 border-blue-400/30 text-blue-300 px-6 py-3 text-sm font-medium backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300"
            >
              <Star className="w-4 h-4 mr-2" />
              Powered by Flow Blockchain & AI
              <Sparkles className="w-4 h-4 ml-2" />
            </Badge>
          </div>

          {/* Main Heading */}
          <div
            className={`mb-8 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">Onchain Credit Risk,</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Quantified.
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div
            className={`mb-12 transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
              AI-powered credit scoring, onchain verification, and smart lending
              <br />
              <span className="text-gray-400">
                Unlock undercollateralized loans with transparent trust metrics
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`mb-16 transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold border border-blue-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-200 group"
                >
                  <Play className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Launch App
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="border-gray-500/30 hover:border-gray-400/50 bg-gray-900/30 hover:bg-gray-800/40 text-white px-8 py-4 text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all duration-200 group"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                View Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div
            className={`mb-16 transition-all duration-1000 delay-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-gray-500 mb-8 text-sm uppercase tracking-wider font-semibold">
              Trusted By Industry Leaders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-60">
              {["Flow Protocol", "Blocto", "Lilico", "FCL", "Cadence"].map(
                (partner, index) => (
                  <div
                    key={partner}
                    className="text-white font-bold text-lg hover:text-blue-300 transition-colors duration-300 cursor-default"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {partner}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div
            className={`transition-all duration-1000 delay-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/40 to-gray-800/20 border border-gray-600/20 backdrop-blur-sm hover:border-blue-400/30 hover:bg-gray-800/30 transition-all duration-300 hover:scale-105"
                    style={{
                      animationDelay: `${1000 + index * 100}ms`,
                    }}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-400/20 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0C14] to-transparent" />
    </section>
  );
}
