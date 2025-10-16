"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Zap,
  TrendingUp,
  Brain,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  benefits: string[];
  stats?: {
    label: string;
    value: string;
  };
}

const features: Feature[] = [
  {
    id: "ai-trust",
    title: "AI Trust Scoring",
    description:
      "Advanced machine learning models analyze your onchain behavior to provide transparent, real-time credit scores from 0-100.",
    icon: Brain,
    gradient: "from-blue-500/20 to-cyan-500/20",
    benefits: [
      "Real-time score updates",
      "Transparent algorithms",
      "Multi-chain analysis",
      "Privacy-preserving",
    ],
    stats: {
      label: "Accuracy Rate",
      value: "98.5%",
    },
  },
  {
    id: "onchain-verification",
    title: "Onchain Verification",
    description:
      "Link your wallet to verified external accounts for enhanced trust scores and access to premium lending features.",
    icon: Shield,
    gradient: "from-green-500/20 to-emerald-500/20",
    benefits: [
      "Identity verification",
      "Social media linking",
      "Credit history import",
      "Reputation building",
    ],
    stats: {
      label: "Verified Users",
      value: "250K+",
    },
  },
  {
    id: "smart-lending",
    title: "Smart Lending",
    description:
      "Borrow with reduced collateral requirements based on your trust score. Higher scores unlock better rates and lower collateral needs.",
    icon: TrendingUp,
    gradient: "from-purple-500/20 to-pink-500/20",
    benefits: [
      "Reduced collateral",
      "Better interest rates",
      "Flexible terms",
      "Auto-refinancing",
    ],
    stats: {
      label: "Avg. Collateral Reduction",
      value: "40%",
    },
  },
];

const additionalFeatures = [
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Multi-layer security with smart contract audits and AI model protection",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Access liquidity across 8+ blockchains with unified trust scoring",
  },
  {
    icon: Users,
    title: "Community Governed",
    description: "Decentralized governance with community-driven protocol improvements",
  },
  {
    icon: Target,
    title: "Dynamic Risk Management",
    description: "Real-time risk assessment with automated liquidation protection",
  },
];

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
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

  // Auto-rotate featured items
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14]" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 animate-pulse" />
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
              className="mb-6 bg-blue-500/10 border-blue-400/30 text-blue-300 px-4 py-2 text-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              One-stop for{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                on-chain credit
              </span>
              <br />
              analytics
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Comprehensive AI-powered credit scoring and lending infrastructure.
              Use our advanced analytics to access better rates and reduced collateral requirements.
            </p>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;

              return (
                <div
                  key={feature.id}
                  className={`group cursor-pointer transition-all duration-500 ${
                    isActive
                      ? "transform scale-105"
                      : "hover:transform hover:scale-102"
                  } ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                  }}
                  onClick={() => setActiveFeature(index)}
                >
                  <div
                    className={`p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                      isActive
                        ? `bg-gradient-to-br ${feature.gradient} border-blue-400/50 shadow-2xl shadow-blue-500/25`
                        : "bg-gray-900/40 border-gray-600/30 hover:border-gray-500/50 hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400/30 scale-110"
                            : "bg-gray-800/50 border-gray-600/30 group-hover:scale-105"
                        } border`}
                      >
                        <Icon
                          className={`w-8 h-8 transition-colors duration-300 ${
                            isActive ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {feature.description}
                        </p>

                        {/* Benefits List */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {feature.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-sm text-gray-400">{benefit}</span>
                            </div>
                          ))}
                        </div>

                        {/* Stats */}
                        {feature.stats && (
                          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                            <span className="text-sm text-gray-400">{feature.stats.label}</span>
                            <span className="text-lg font-bold text-white">{feature.stats.value}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Preview */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="sticky top-8">
              <div className="relative">
                {/* Main preview card */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-3xl p-8 border border-gray-600/30 backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {features[activeFeature].title} Preview
                    </h3>
                    <p className="text-gray-400">
                      See how it works in real-time
                    </p>
                  </div>

                  {/* Preview Content */}
                  <div className="space-y-6">
                    {activeFeature === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20">
                          <span className="text-white font-medium">Trust Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse" />
                            </div>
                            <span className="text-2xl font-bold text-blue-400">75</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-600/30">
                            <div className="text-xs text-gray-400 mb-1">Transaction History</div>
                            <div className="text-green-400 font-semibold">Excellent</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-600/30">
                            <div className="text-xs text-gray-400 mb-1">Liquidity Provided</div>
                            <div className="text-blue-400 font-semibold">$12.5K</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFeature === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20">
                          <Shield className="w-6 h-6 text-green-400" />
                          <div>
                            <div className="text-white font-medium">Identity Verified</div>
                            <div className="text-sm text-gray-400">Email, Twitter, GitHub</div>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gray-800/30 border border-gray-600/30">
                          <div className="text-3xl font-bold text-green-400 mb-1">+15 pts</div>
                          <div className="text-sm text-gray-400">Trust Score Boost</div>
                        </div>
                      </div>
                    )}

                    {activeFeature === 2 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-medium">Collateral Required</span>
                            <Badge className="bg-purple-500/20 text-purple-300">-40%</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Traditional</span>
                              <span className="text-gray-300">150%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">SmartLend</span>
                              <span className="text-purple-400 font-semibold">90%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-600/30">
                          <div className="text-2xl font-bold text-purple-400 mb-1">6.5% APR</div>
                          <div className="text-sm text-gray-400">Optimized Rate</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 text-center">
                    <Button className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105">
                      Try {features[activeFeature].title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeFeature === index
                          ? "bg-blue-400 scale-125"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Built for the Future of Finance
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Advanced features designed to revolutionize how lending works in DeFi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-gray-900/40 border border-gray-600/30 backdrop-blur-sm hover:border-blue-400/30 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
                  style={{
                    transitionDelay: `${600 + index * 100}ms`,
                  }}
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl flex items-center justify-center border border-gray-600/30 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 transition-all duration-300">
                      <Icon className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-20 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-400/20 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Experience Smart Lending?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of users who are already leveraging AI-powered credit scoring
              for better lending terms and reduced collateral requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white px-8 py-4 text-lg font-semibold border border-blue-400/30 backdrop-blur-sm hover:scale-105 transition-all duration-200"
              >
                Start Building Credit
                <TrendingUp className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-500/30 hover:border-gray-400/50 bg-gray-900/30 hover:bg-gray-800/40 text-white px-8 py-4 text-lg font-semibold backdrop-blur-sm hover:scale-105 transition-all duration-200"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
