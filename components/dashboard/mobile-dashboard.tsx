"use client";

import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import {
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  Droplets,
  Zap,
  Target,
  Activity,
  CreditCard,
  PiggyBank,
  BarChart3,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import VerificationFlow from "@/components/features/verification-flow";
import { LendingInterface } from "@/components/features/lending-interface";
import { LiquidityInterface } from "@/components/features/liquidity-interface";

interface MobileDashboardProps {
  user: fcl.CurrentUser | null;
}

interface UserData {
  trustScore: number;
  tier: string;
  isVerified: boolean;
  totalBorrowed: number;
  totalLent: number;
  availableCollateral: number;
  activeLoans: number;
  liquidityProvided: number;
  rewardsEarned: number;
}

export default function MobileDashboard({ user }: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showVerificationFlow, setShowVerificationFlow] = useState(false);

  // Mock data - in real app, this would come from onchain queries
  const userData: UserData = {
    trustScore: 75,
    tier: "MEDIUM",
    isVerified: false,
    totalBorrowed: 0,
    totalLent: 250.5,
    availableCollateral: 1500,
    activeLoans: 0,
    liquidityProvided: 500,
    rewardsEarned: 12.5,
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "HIGH":
        return "from-emerald-500/80 to-green-400/80";
      case "MEDIUM":
        return "from-yellow-500/80 to-orange-400/80";
      case "LOW":
        return "from-red-500/80 to-pink-400/80";
      default:
        return "from-gray-500/80 to-gray-400/80";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType = "positive",
    prefix = "",
    suffix = "",
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    prefix?: string;
    suffix?: string;
  }) => (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm hover:from-gray-800/60 hover:to-gray-700/40 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">
              {prefix}
              {value}
              {suffix}
            </p>
            {change && (
              <p
                className={`text-xs mt-1 flex items-center gap-1 ${
                  changeType === "positive"
                    ? "text-emerald-400"
                    : changeType === "negative"
                      ? "text-red-400"
                      : "text-gray-400"
                }`}
              >
                {changeType === "positive" && (
                  <ArrowUpRight className="w-3 h-3" />
                )}
                {changeType === "negative" && (
                  <ArrowDownLeft className="w-3 h-3" />
                )}
                {change}
              </p>
            )}
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Trust Score Section */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Trust Score & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-3xl font-bold ${getScoreColor(userData.trustScore)}`}
                >
                  {userData.trustScore}
                </span>
                <Badge
                  className={`bg-gradient-to-r ${getTierColor(userData.tier)} text-white border-0`}
                >
                  {userData.tier} TIER
                </Badge>
              </div>
              <Progress value={userData.trustScore} className="h-2 mb-2" />
              <p className="text-sm text-gray-400">
                Your trust score determines lending limits and rates
              </p>
            </div>
          </div>

          {!userData.isVerified && (
            <Button
              onClick={() => setShowVerificationFlow(true)}
              className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              Start Verification Process
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Borrowed"
          value={userData.totalBorrowed}
          icon={CreditCard}
          prefix="$"
          change={userData.totalBorrowed > 0 ? "+2.5%" : undefined}
        />
        <StatCard
          title="Total Lent"
          value={userData.totalLent}
          icon={PiggyBank}
          prefix="$"
          change="+5.2%"
        />
        <StatCard
          title="Available Collateral"
          value={userData.availableCollateral}
          icon={Wallet}
          prefix="$"
          change="+1.8%"
        />
        <StatCard
          title="Rewards Earned"
          value={userData.rewardsEarned}
          icon={Target}
          prefix="$"
          change="+12.3%"
        />
      </div>

      {/* Activity Overview */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Liquidity Added
                  </p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <span className="text-sm text-green-400">+$100.00</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Trust Score Updated
                  </p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
              <span className="text-sm text-blue-400">+5 points</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Referral Bonus
                  </p>
                  <p className="text-xs text-gray-400">3 days ago</p>
                </div>
              </div>
              <span className="text-sm text-purple-400">+$5.00</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back{user?.addr ? `, ${user.addr.slice(0, 6)}...` : ""}
              </h1>
              <p className="text-gray-400">
                Manage your lending portfolio and track your trust score
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-500/20 border-green-400/30 text-green-300"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-600/30 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="lending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Lending</span>
            </TabsTrigger>
            <TabsTrigger
              value="liquidity"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
            >
              <Droplets className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Liquidity</span>
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
            >
              <PiggyBank className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="lending" className="space-y-6">
            <LendingInterface user={user} />
          </TabsContent>

          <TabsContent value="liquidity" className="space-y-6">
            <LiquidityInterface user={user} />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Portfolio Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Portfolio analytics coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Verification Flow Modal */}
      {showVerificationFlow && (
        <VerificationFlow onClose={() => setShowVerificationFlow(false)} />
      )}
    </div>
  );
}
