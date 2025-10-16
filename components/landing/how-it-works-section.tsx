"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Wallet,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Users,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
  color: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Connect Your Wallet",
    description: "Link your Flow-compatible wallet to start building your onchain credit profile.",
    icon: Wallet,
    details: [
      "Support for Blocto, Lilico, Dapper",
      "Secure connection via Flow Client Library",
      "No personal data stored",
      "Instant wallet integration",
    ],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 2,
    title: "Build Your Trust Score",
    description: "Our AI analyzes your onchain behavior to calculate a transparent trust score.",
    icon: BarChart3,
    details: [
      "Real-time transaction analysis",
      "Multi-chain activity tracking",
      "DeFi protocol interactions",
      "Liquidity provision history",
    ],
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 3,
    title: "Complete Verification",
    description: "Boost your score by linking verified external accounts and identity.",
    icon: Shield,
    details: [
      "Email and social media verification",
      "KYC compliance options",
      "Credit history integration",
      "Professional network linking",
    ],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: 4,
    title: "Access Smart Lending",
    description: "Unlock reduced collateral requirements and better rates based on your trust score.",
    icon: TrendingUp,
    details: [
      "Up to 60% collateral reduction",
      "Dynamic interest rates",
      "Flexible loan terms",
      "Auto-refinancing options",
    ],
    color: "from-orange-500/20 to-red-500/20",
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance steps
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] via-[#0A0C14] to-[#1A1F2C]" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Badge
              variant="outline"
              className="mb-6 bg-purple-500/10 border-purple-400/30 text-purple-300 px-4 py-2 text-sm"
            >
              <Target className="w-4 h-4 mr-2" />
              How It Works
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Get Started in{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                4 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Experience the future of lending with AI-powered credit scoring.
              Build your trust score and unlock better lending terms in minutes.
            </p>
          </div>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Steps List */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isCompleted = activeStep > index;

              return (
                <div
                  key={step.id}
                  className={`group cursor-pointer transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                  }}
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                      isActive
                        ? `bg-gradient-to-br ${step.color} border-blue-400/50 shadow-2xl shadow-blue-500/25 scale-105`
                        : isCompleted
                        ? "bg-gray-900/60 border-green-400/30"
                        : "bg-gray-900/40 border-gray-600/30 hover:border-gray-500/50 hover:bg-gray-800/50"
                    }`}
                  >
                    {/* Step connector line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-12 top-24 w-0.5 h-16 bg-gradient-to-b from-gray-600/50 to-transparent hidden lg:block" />
                    )}

                    <div className="flex items-start gap-6">
                      {/* Step number and icon */}
                      <div className="flex-shrink-0 relative">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400/30 scale-110"
                              : isCompleted
                              ? "bg-green-500/20 border-green-400/30"
                              : "bg-gray-800/50 border-gray-600/30 group-hover:scale-105"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          ) : (
                            <Icon
                              className={`w-8 h-8 transition-colors duration-300 ${
                                isActive
                                  ? "text-blue-400"
                                  : "text-gray-400 group-hover:text-blue-400"
                              }`}
                            />
                          )}
                        </div>

                        {/* Step number badge */}
                        <div
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isActive
                              ? "bg-blue-500 text-white"
                              : isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {step.id}
                        </div>
                      </div>

                      {/* Step content */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Step details */}
                        <div className="grid grid-cols-2 gap-2">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                              <span className="text-sm text-gray-400">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Demo */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="sticky top-8">
              <div className="relative">
                {/* Demo container */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-3xl p-8 border border-gray-600/30 backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Step {steps[activeStep].id}: {steps[activeStep].title}
                    </h3>
                    <p className="text-gray-400">
                      Interactive preview of the process
                    </p>
                  </div>

                  {/* Demo content based on active step */}
                  <div className="space-y-6">
                    {activeStep === 0 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20">
                          <div className="flex items-center gap-3 mb-3">
                            <Wallet className="w-6 h-6 text-blue-400" />
                            <span className="text-white font-medium">Connect Flow Wallet</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg" />
                              <span className="text-gray-300">Blocto Wallet</span>
                              <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg" />
                              <span className="text-gray-300">Lilico Wallet</span>
                              <div className="w-4 h-4 border border-gray-600 rounded-full ml-auto" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-medium">Trust Score Calculation</span>
                            <div className="text-2xl font-bold text-green-400">calculating...</div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Transaction History</span>
                              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-green-400 rounded-full animate-pulse" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">DeFi Activity</span>
                              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-blue-400 rounded-full animate-pulse" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-gray-300">Email Verification</span>
                              </div>
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-gray-300">Social Verification</span>
                              </div>
                              <div className="w-4 h-4 border-2 border-purple-400 rounded-full animate-spin" />
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <div className="text-xl font-bold text-purple-400">+25 pts</div>
                            <div className="text-xs text-gray-400">Trust Score Boost</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/20">
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-orange-400 mb-1">85/100</div>
                            <div className="text-sm text-gray-400">Final Trust Score</div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Collateral Reduction</span>
                              <span className="text-orange-400 font-semibold">-45%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Interest Rate</span>
                              <span className="text-orange-400 font-semibold">6.2% APR</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Max Loan Amount</span>
                              <span className="text-orange-400 font-semibold">$50,000</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm text-white">{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${((activeStep + 1) / steps.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeStep === index
                          ? "bg-blue-400 scale-125"
                          : index < activeStep
                          ? "bg-green-400"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-20 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-400/20 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Build Your Trust Score?
            </h3>
            <p className="text-gray-300 mb-6">
              Join the revolution in decentralized lending. Start building your onchain credit profile today.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white px-8 py-4 text-lg font-semibold border border-blue-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-200 group"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
