"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BorrowForm } from "@/components/forms/BorrowForm";
import { RepayForm } from "@/components/forms/RepayForm";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Shield,
  Info,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Wallet,
} from "lucide-react";

export default function LendingPage() {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPool, setSelectedPool] = useState<
    (typeof lendingPools)[0] | null
  >(null);

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  // Mock lending pools data
  const lendingPools = [
    {
      name: "FLOW-FUSD Pool",
      asset: "FLOW",
      apr: "7.5%",
      collateralRatio: "150%",
      totalLiquidity: "2.5M",
      utilization: "67%",
      maxBorrow: "5,000",
    },
    {
      name: "FUSD-FLOW Pool",
      asset: "FUSD",
      apr: "6.0%",
      collateralRatio: "140%",
      totalLiquidity: "1.8M",
      utilization: "54%",
      maxBorrow: "3,500",
    },
    {
      name: "USDC-FLOW Pool",
      asset: "USDC",
      apr: "5.5%",
      collateralRatio: "135%",
      totalLiquidity: "1.2M",
      utilization: "42%",
      maxBorrow: "2,800",
    },
  ];

  // Mock user lending data
  const userLendingData = {
    trustScore: 75,
    totalBorrowed: 1612.5,
    availableCredit: 10000,
    healthFactor: 1.85,
    activeLoans: [
      {
        id: "loan_001",
        asset: "FLOW",
        principal: 1000,
        currentBalance: 1075,
        interestRate: 7.5,
        nextPayment: 107.5,
        dueDate: "2024-01-22",
        healthFactor: 1.85,
        overdue: false,
      },
      {
        id: "loan_002",
        asset: "FUSD",
        principal: 500,
        currentBalance: 537.5,
        interestRate: 6.0,
        nextPayment: 53.75,
        dueDate: "2024-01-15",
        healthFactor: 1.25,
        overdue: true,
      },
    ],
    repaymentHistory: [
      {
        date: "2024-01-10",
        amount: 125.5,
        asset: "FLOW",
        status: "completed",
      },
      {
        date: "2024-01-05",
        amount: 75.25,
        asset: "FUSD",
        status: "completed",
      },
    ],
  };

  const handleBorrowClick = (pool: (typeof lendingPools)[0]) => {
    setSelectedPool(pool);
    setActiveTab("borrow");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Lending Dashboard
          </h1>
          <p className="text-gray-400">
            Borrow funds or repay existing loans with AI-powered trust scoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-blue-400 border-blue-500/20 bg-blue-500/10"
          >
            <Shield className="w-4 h-4 mr-2" />
            Trust Score: {userLendingData.trustScore}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Trust Score</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {userLendingData.trustScore}
            </div>
            <div className="text-xs text-green-400">
              15% collateral reduction
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Available Credit</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${userLendingData.availableCredit.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Based on trust score</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Total Borrowed</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${userLendingData.totalBorrowed.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">
              {userLendingData.activeLoans.length} active loans
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Health Factor</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {userLendingData.healthFactor}
            </div>
            <div
              className={`text-xs ${userLendingData.healthFactor > 1.5 ? "text-green-400" : "text-yellow-400"}`}
            >
              {userLendingData.healthFactor > 1.5
                ? "Healthy"
                : "Monitor closely"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="borrow"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Borrow
          </TabsTrigger>
          <TabsTrigger
            value="repay"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Repay
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Available Pools */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">
                Available Lending Pools
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid gap-4">
                {lendingPools.map((pool, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {pool.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Asset: {pool.asset}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-green-400 border-green-500/20"
                        >
                          {pool.apr} APR
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">
                          Collateral Ratio
                        </div>
                        <div className="font-semibold text-white">
                          {pool.collateralRatio}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Total Liquidity
                        </div>
                        <div className="font-semibold text-white">
                          ${pool.totalLiquidity}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Utilization</div>
                        <div className="font-semibold text-white">
                          {pool.utilization}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Max Borrow</div>
                        <div className="font-semibold text-white">
                          ${pool.maxBorrow}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBorrowClick(pool)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      Borrow {pool.asset}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Loans */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Active Loans</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("repay")}
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {userLendingData.activeLoans.length > 0 ? (
                <div className="space-y-4">
                  {userLendingData.activeLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="bg-slate-800/30 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              {loan.asset} Loan
                            </h4>
                            <p className="text-sm text-gray-400">
                              Principal: ${loan.principal}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            ${loan.currentBalance}
                          </div>
                          <div className="text-sm text-gray-400">
                            Current Balance
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-400">
                            Interest Rate
                          </div>
                          <div className="font-semibold text-white">
                            {loan.interestRate}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Next Payment
                          </div>
                          <div className="font-semibold text-white">
                            ${loan.nextPayment}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Due Date</div>
                          <div className="font-semibold text-white">
                            {loan.dueDate}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Health Factor
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              loan.healthFactor > 1.5
                                ? "text-green-400 border-green-500/20"
                                : "text-yellow-400 border-yellow-500/20"
                            }
                          >
                            {loan.healthFactor}
                          </Badge>
                        </div>
                      </div>

                      {loan.overdue && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">
                            Payment overdue - please make a payment to avoid
                            penalties
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No Active Loans
                  </h3>
                  <p className="text-sm text-gray-400">
                    You don&apos;t have any active loans at the moment.
                  </p>
                  <Button onClick={() => setActiveTab("borrow")}>
                    Start Borrowing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Score Benefits */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Trust Score Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    15%
                  </div>
                  <div className="text-sm text-gray-400">
                    Collateral Reduction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    0.5%
                  </div>
                  <div className="text-sm text-gray-400">
                    Interest Rate Discount
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    $10K
                  </div>
                  <div className="text-sm text-gray-400">
                    Additional Credit Limit
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div className="text-sm text-gray-400">
                    Your trust score of {userLendingData.trustScore} provides
                    these benefits. Complete verification and maintain good
                    payment history to increase your score further.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Borrow Tab */}
        <TabsContent value="borrow" className="mt-6">
          {selectedPool ? (
            <BorrowForm
              poolName={selectedPool.name}
              asset={selectedPool.asset}
              apr={selectedPool.apr}
              collateralRatio={selectedPool.collateralRatio}
              onClose={() => setActiveTab("overview")}
            />
          ) : (
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Select a Pool to Borrow
                </h3>
                <p className="text-gray-400 mb-6">
                  Choose a lending pool from the overview tab to start
                  borrowing.
                </p>
                <Button onClick={() => setActiveTab("overview")}>
                  View Available Pools
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Repay Tab */}
        <TabsContent value="repay" className="mt-6">
          <RepayForm
            onClose={() => setActiveTab("overview")}
            onSuccess={() => setActiveTab("overview")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
