"use client";

import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import {
  TrendingUp,
  DollarSign,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Droplets,
} from "lucide-react";
import CustomIcon from "./CustomIcon";
import VerificationFlow from "./VerificationFlow";
import { LendingInterface } from "./LendingInterface";
import { LiquidityInterface } from "./LiquidityInterface";

interface MobileOptimizedDashboardProps {
  user: fcl.CurrentUser | null;
}

export default function MobileOptimizedDashboard({
  user,
}: MobileOptimizedDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showVerificationFlow, setShowVerificationFlow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Mock data - in real app, this would come from onchain queries
  const userData = {
    trustScore: 75,
    tier: "MEDIUM",
    isVerified: false,
    totalBorrowed: 0,
    collateral: 0,
    interestRate: 7.5,
    availableCredit: 10000,
    monthlyPayment: 0,
    nextPaymentDate: null,
    recentActivity: [
      {
        type: "score_update",
        amount: "+5",
        timestamp: "2 hours ago",
        positive: true,
      },
      {
        type: "verification_pending",
        amount: "",
        timestamp: "1 day ago",
        positive: false,
      },
    ],
    allActivity: [
      {
        type: "score_update",
        amount: "+5",
        timestamp: "2 hours ago",
        positive: true,
      },
      {
        type: "verification_pending",
        amount: "",
        timestamp: "1 day ago",
        positive: false,
      },
      {
        type: "wallet_connected",
        amount: "",
        timestamp: "3 days ago",
        positive: true,
      },
      {
        type: "profile_created",
        amount: "",
        timestamp: "1 week ago",
        positive: true,
      },
      {
        type: "first_login",
        amount: "",
        timestamp: "1 week ago",
        positive: true,
      },
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "HIGH":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "LOW":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye, shortLabel: "Home" },
    { id: "lending", label: "Lending", icon: DollarSign, shortLabel: "Loans" },
    { id: "pools", label: "Pools", icon: Droplets, shortLabel: "Pools" },
    { id: "activity", label: "Activity", icon: Clock, shortLabel: "History" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">
              Welcome back,{" "}
              {user?.addr
                ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
                : "User"}
              ! 👋
            </h2>
            <p className="text-gray-300 text-sm sm:text-base hidden sm:block">
              Your AI-powered lending dashboard is ready. Monitor your credit
              score and manage your loans.
            </p>
            <p className="text-gray-300 text-sm sm:hidden">
              Monitor your credit score and manage loans.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            <div className="text-right">
              <div className="text-xs sm:text-sm text-gray-400">
                Available Credit
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {userData.availableCredit.toLocaleString()} FLOW
              </div>
            </div>
            <CustomIcon name="logo" size={isMobile ? 32 : isTablet ? 40 : 48} />
          </div>
        </div>

        {/* Mobile Available Credit */}
        <div className="sm:hidden mt-4 pt-4 border-t border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Available Credit</div>
              <div className="text-xl font-bold text-white">
                {userData.availableCredit.toLocaleString()} FLOW
              </div>
            </div>
            <CustomIcon name="logo" size={32} />
          </div>
        </div>
      </div>

      {/* Trust Score Hero Card */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Trust Score Display */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                  Trust Score
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  AI-powered credit assessment
                </p>
              </div>
              <div
                className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium ${getTierColor(userData.tier)}`}
              >
                {userData.tier}
              </div>
            </div>

            {/* Score Circle - Responsive */}
            <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-6">
              <div
                className={`relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48`}
              >
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - userData.trustScore / 100)}`}
                    className={`${getScoreColor(userData.trustScore)} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getScoreColor(userData.trustScore)}`}
                    >
                      {userData.trustScore}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      / 100
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      Last Update
                    </div>
                    <div className="text-sm sm:text-base font-medium text-white">
                      +5 points
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      Verification
                    </div>
                    <div className="text-sm sm:text-base font-medium text-white">
                      {userData.isVerified ? "Verified" : "Not Verified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">
              Quick Actions
            </h4>
            <div className="space-y-3">
              {!userData.isVerified && (
                <button
                  onClick={() => setShowVerificationFlow(true)}
                  className="w-full flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
                >
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-medium text-sm sm:text-base">
                    Verify Identity
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                </button>
              )}

              <button
                onClick={() => setActiveTab("lending")}
                className="w-full flex items-center gap-3 p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 transition-colors rounded-xl"
              >
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium text-sm sm:text-base">
                  Borrow Funds
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveTab("lending")}
                className="w-full flex items-center gap-3 p-3 sm:p-4 bg-slate-700/50 hover:bg-slate-700 transition-colors rounded-xl"
              >
                <ArrowDownLeft className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium text-sm sm:text-base">
                  Repay Loan
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden">
        <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden lg:block">
        <div className="flex border-b border-slate-700/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-400 border-b-2 border-blue-400 bg-slate-800/50"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4 sm:space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 lg:p-6 border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {userData.trustScore}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  Trust Score
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 lg:p-6 border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {userData.interestRate}%
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  Interest Rate
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 lg:p-6 border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {userData.totalBorrowed}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Borrowed</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 lg:p-6 border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {userData.collateral}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  Collateral
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Recent Activity
                </h3>
                <button
                  onClick={() => setActiveTab("activity")}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {userData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-700/30 rounded-lg"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        activity.positive
                          ? "bg-green-500/20"
                          : "bg-yellow-500/20"
                      }`}
                    >
                      {activity.positive ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-medium text-white">
                        {activity.type === "score_update" &&
                          "Trust Score Updated"}
                        {activity.type === "verification_pending" &&
                          "Verification Pending"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {activity.timestamp}
                      </div>
                    </div>
                    {activity.amount && (
                      <div
                        className={`text-sm sm:text-base font-medium ${
                          activity.positive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "lending" && <LendingInterface />}

        {activeTab === "pools" && <LiquidityInterface />}

        {activeTab === "activity" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  All Activity
                </h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-xs font-medium text-gray-400 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    Filter
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-400 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    Export
                  </button>
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-3 sm:space-y-4">
                {userData.allActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        activity.positive
                          ? "bg-green-500/20"
                          : "bg-yellow-500/20"
                      }`}
                    >
                      {activity.positive ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm sm:text-base font-medium text-white">
                        {activity.type === "score_update" &&
                          "Trust Score Updated"}
                        {activity.type === "verification_pending" &&
                          "Verification Pending"}
                        {activity.type === "wallet_connected" &&
                          "Wallet Connected"}
                        {activity.type === "profile_created" &&
                          "Profile Created"}
                        {activity.type === "first_login" && "First Login"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {activity.timestamp}
                      </div>
                    </div>
                    {activity.amount && (
                      <div
                        className={`text-sm sm:text-base font-medium ${
                          activity.positive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Flow Modal */}
      <VerificationFlow
        isOpen={showVerificationFlow}
        onClose={() => setShowVerificationFlow(false)}
        user={user}
      />
    </div>
  );
}
