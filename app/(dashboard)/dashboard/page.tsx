"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Shield,
  Droplets,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  // Mock data - in real app, this would come from onchain queries
  const userData = {
    trustScore: 75,
    tier: "MEDIUM",
    isVerified: false,
    totalBorrowed: 1612.5,
    totalSupplied: 2450.0,
    collateral: 3850.0,
    availableCredit: 10000,
    netAPY: 12.5,
    healthFactor: 1.85,
    nextPayment: {
      amount: 53.75,
      dueDate: "2024-01-15",
      overdue: true,
    },
    recentActivity: [
      {
        type: "borrow",
        amount: "500 FLOW",
        timestamp: "2 hours ago",
        status: "completed",
        txHash: "0x1234...5678",
      },
      {
        type: "supply",
        amount: "1000 FUSD",
        timestamp: "1 day ago",
        status: "completed",
        txHash: "0x5678...9abc",
      },
      {
        type: "repay",
        amount: "100 FLOW",
        timestamp: "3 days ago",
        status: "completed",
        txHash: "0x9abc...def0",
      },
    ],
    positions: [
      {
        id: "flow-fusd-lp",
        type: "liquidity",
        pair: "FLOW/FUSD",
        value: 2450.0,
        apy: 15.2,
        rewards: 15.23,
      },
      {
        id: "flow-loan",
        type: "loan",
        asset: "FLOW",
        borrowed: 1000.0,
        collateral: 1500.0,
        healthFactor: 1.85,
        nextPayment: 107.5,
      },
    ],
  };

  const quickActions = [
    {
      title: "Borrow Funds",
      description: "Access liquidity with reduced collateral",
      icon: DollarSign,
      href: "/lending",
      color: "from-blue-500 to-purple-500",
      hoverColor: "hover:from-blue-600 hover:to-purple-600",
    },
    {
      title: "Add Liquidity",
      description: "Provide liquidity and earn fees",
      icon: Droplets,
      href: "/liquidity",
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
    {
      title: "View Portfolio",
      description: "Manage your positions",
      icon: Target,
      href: "/portfolio",
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-400">
              Your wallet:{" "}
              {user?.addr
                ? `${user.addr.slice(0, 8)}...${user.addr.slice(-6)}`
                : "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-blue-400 border-blue-500/20 bg-blue-500/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Trust Score: {userData.trustScore}
            </Badge>
            {userData.isVerified ? (
              <Badge
                variant="outline"
                className="text-green-400 border-green-500/20 bg-green-500/10"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verified
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Unverified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Borrowed</p>
                <p className="text-2xl font-bold text-white">
                  ${userData.totalBorrowed.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="text-xs text-gray-500">Health Factor:</div>
              <Badge
                variant="outline"
                className={
                  userData.healthFactor > 1.5
                    ? "text-green-400 border-green-500/20"
                    : "text-yellow-400 border-yellow-500/20"
                }
              >
                {userData.healthFactor}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Supplied</p>
                <p className="text-2xl font-bold text-white">
                  ${userData.totalSupplied.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="text-xs text-gray-500">Net APY:</div>
              <Badge
                variant="outline"
                className="text-green-400 border-green-500/20"
              >
                {userData.netAPY}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Available Credit</p>
                <p className="text-2xl font-bold text-white">
                  ${userData.availableCredit.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="text-xs text-gray-500">Trust Score Bonus:</div>
              <Badge
                variant="outline"
                className="text-blue-400 border-blue-500/20"
              >
                15% reduction
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Next Payment</p>
                <p className="text-2xl font-bold text-white">
                  ${userData.nextPayment.amount}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  userData.nextPayment.overdue
                    ? "bg-red-500/10"
                    : "bg-yellow-500/10"
                }`}
              >
                <Clock
                  className={`w-6 h-6 ${
                    userData.nextPayment.overdue
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge
                variant="outline"
                className={
                  userData.nextPayment.overdue
                    ? "text-red-400 border-red-500/20"
                    : "text-yellow-400 border-yellow-500/20"
                }
              >
                {userData.nextPayment.overdue ? "Overdue" : "Due Soon"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className="group bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {userData.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === "borrow"
                        ? "bg-red-500/10"
                        : activity.type === "supply"
                          ? "bg-green-500/10"
                          : "bg-blue-500/10"
                    }`}
                  >
                    {activity.type === "borrow" ? (
                      <ArrowDownLeft className="w-5 h-5 text-red-400" />
                    ) : activity.type === "supply" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-400" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white capitalize">
                        {activity.type} {activity.amount}
                      </span>
                      <span className="text-sm text-gray-400">
                        {activity.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-green-400 border-green-500/20 text-xs"
                      >
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        TX: {activity.txHash}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Positions */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Active Positions</CardTitle>
              <Link href="/portfolio">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {userData.positions.map((position) => (
                <div
                  key={position.id}
                  className="p-4 bg-gray-800/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          position.type === "liquidity"
                            ? "bg-green-500/10"
                            : "bg-red-500/10"
                        }`}
                      >
                        {position.type === "liquidity" ? (
                          <Droplets className="w-5 h-5 text-green-400" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {position.type === "liquidity"
                            ? position.pair
                            : `${position.asset} Loan`}
                        </div>
                        <div className="text-sm text-gray-400">
                          {position.type === "liquidity"
                            ? "Liquidity Pool"
                            : "Borrowing Position"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        $
                        {position.type === "liquidity"
                          ? position.value?.toFixed(2)
                          : position.borrowed?.toFixed(2)}
                      </div>
                      {position.type === "liquidity" && (
                        <Badge
                          variant="outline"
                          className="text-green-400 border-green-500/20 text-xs"
                        >
                          {position.apy}% APY
                        </Badge>
                      )}
                    </div>
                  </div>

                  {position.type === "liquidity" ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rewards Earned:</span>
                      <span className="text-green-400">
                        ${position.rewards}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Collateral:</span>
                        <span className="text-white">
                          ${position.collateral?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Health Factor:</span>
                        <Badge
                          variant="outline"
                          className={
                            position.healthFactor && position.healthFactor > 1.5
                              ? "text-green-400 border-green-500/20"
                              : "text-yellow-400 border-yellow-500/20"
                          }
                        >
                          {position.healthFactor}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Score Improvement Tips */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Improve Your Trust Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Verify Identity</h3>
              <p className="text-sm text-gray-400">
                Complete onchain verification to boost your score by 15 points
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                Regular Payments
              </h3>
              <p className="text-sm text-gray-400">
                Make on-time payments to improve your payment history
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Droplets className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">
                Provide Liquidity
              </h3>
              <p className="text-sm text-gray-400">
                Participate in liquidity provision to show protocol support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
