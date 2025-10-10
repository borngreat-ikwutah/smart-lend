"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, Zap, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import CustomIcon from "./CustomIcon";

interface MobileOptimizedFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: "ai-trust" | "verification" | "smart-lending" | null;
  onStartVerification?: () => void;
}

export default function MobileOptimizedFeatureModal({ isOpen, onClose, feature, onStartVerification }: MobileOptimizedFeatureModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isOpen || !feature) return null;

  const getFeatureData = () => {
    switch (feature) {
      case "ai-trust":
        return {
          title: "AI Trust Scoring",
          icon: "ai-trust",
          description: "Advanced machine learning models analyze your onchain behavior to provide transparent, real-time credit scores from 0-100.",
          features: [
            "Real-time onchain behavior analysis",
            "Machine learning credit scoring algorithms",
            "Transparent scoring methodology",
            "Dynamic score updates based on activity",
            "Cross-chain behavior aggregation",
            "Risk assessment and prediction models"
          ],
          benefits: [
            "Higher credit scores unlock better rates",
            "Reduced collateral requirements",
            "Access to premium lending products",
            "Real-time score monitoring",
            "Historical performance tracking"
          ],
          color: "blue"
        };
      case "verification":
        return {
          title: "Onchain Verification",
          icon: "verification",
          description: "Link your wallet to verified external accounts for enhanced trust scores and access to premium lending features.",
          features: [
            "Multi-platform identity verification",
            "Social media account linking",
            "Professional credential verification",
            "KYC/AML compliance integration",
            "Decentralized attestation system",
            "Privacy-preserving verification"
          ],
          benefits: [
            "Significant trust score boost",
            "Access to exclusive lending pools",
            "Lower interest rates",
            "Higher borrowing limits",
            "Premium customer support"
          ],
          color: "green"
        };
      case "smart-lending":
        return {
          title: "Smart Lending",
          icon: "smart-lending",
          description: "Borrow with reduced collateral requirements based on your trust score. Higher scores unlock better rates and lower collateral needs.",
          features: [
            "Dynamic collateral requirements",
            "AI-powered interest rate calculation",
            "Automated risk assessment",
            "Real-time loan monitoring",
            "Flexible repayment options",
            "Liquidation protection mechanisms"
          ],
          benefits: [
            "Borrow up to 120% of collateral value",
            "Competitive interest rates",
            "No credit checks required",
            "Instant loan approval",
            "Transparent fee structure"
          ],
          color: "purple"
        };
      default:
        return null;
    }
  };

  const featureData = getFeatureData();
  if (!featureData) return null;

  const colors = {
    blue: {
      bg: "from-blue-600 to-cyan-600",
      text: "text-blue-400",
      border: "border-blue-500/20"
    },
    green: {
      bg: "from-green-600 to-emerald-600",
      text: "text-green-400",
      border: "border-green-500/20"
    },
    purple: {
      bg: "from-purple-600 to-violet-600",
      text: "text-purple-400",
      border: "border-purple-500/20"
    }
  };

  const currentColors = colors[featureData.color as keyof typeof colors];

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[95vh] overflow-y-auto ${
          isMobile ? 'mx-2' : 'mx-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentColors.bg} p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <CustomIcon name={featureData.icon as "ai-trust" | "verification" | "smart-lending"} size={isMobile ? 24 : 32} />
            <h2 className={`text-lg sm:text-2xl font-bold text-white ${isMobile ? 'truncate' : ''}`}>
              {featureData.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Description */}
          <div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {featureData.description}
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Key Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {featureData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                  <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${currentColors.text} flex-shrink-0 mt-0.5`} />
                  <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Benefits
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {featureData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-800/30 rounded-lg border border-slate-700/20">
                  <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${currentColors.text} flex-shrink-0 mt-0.5`} />
                  <span className="text-gray-300 text-xs sm:text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 sm:pt-6 border-t border-slate-700/50">
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 sm:gap-4`}>
              {feature === "verification" && onStartVerification ? (
                <button 
                  onClick={() => {
                    onStartVerification();
                    onClose();
                  }}
                  className={`flex-1 inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r ${currentColors.bg} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Get Verified Now</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                </button>
              ) : (
                <button className={`flex-1 inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r ${currentColors.bg} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Get Started</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                </button>
              )}
              <button className={`flex-1 inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-slate-600 text-gray-300 font-semibold rounded-xl hover:border-slate-500 hover:text-white transition-colors`}>
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">View Documentation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
