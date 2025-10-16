"use client";

import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import {
  ArrowRight,
  ArrowLeft,
  DollarSign,
  CreditCard,
  TrendingUp,
  Shield,
  Info,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Percent,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface LendingInterfaceProps {
  user: fcl.CurrentUser | null;
  onClose?: () => void;
}

type LendingMode = "overview" | "borrow" | "repay" | "history";

interface LendingPool {
  id: string;
  name: string;
  asset: string;
  collateralAsset: string;
  apr: number;
  collateralRatio: number;
  totalLiquidity: number;
  utilization: number;
  minBorrow: number;
  maxBorrow: number;
  isActive: boolean;
}

interface LoanPosition {
  id: string;
  asset: string;
  borrowedAmount: number;
  collateralAmount: number;
  interestRate: number;
  healthFactor: number;
  liquidationPrice: number;
  createdAt: string;
  status: "active" | "repaid" | "liquidated";
}

// Mock lending pools data
const lendingPools: LendingPool[] = [
  {
    id: "flow-fusd",
    name: "FLOW-FUSD Pool",
    asset: "FUSD",
    collateralAsset: "FLOW",
    apr: 7.5,
    collateralRatio: 150,
    totalLiquidity: 2500000,
    utilization: 67,
    minBorrow: 10,
    maxBorrow: 10000,
    isActive: true,
  },
  {
    id: "fusd-flow",
    name: "FUSD-FLOW Pool",
    asset: "FLOW",
    collateralAsset: "FUSD",
    apr: 6.0,
    collateralRatio: 140,
    totalLiquidity: 1800000,
    utilization: 54,
    minBorrow: 1,
    maxBorrow: 1000,
    isActive: true,
  },
  {
    id: "usdc-flow",
    name: "USDC-FLOW Pool",
    asset: "USDC",
    collateralAsset: "FLOW",
    apr: 8.2,
    collateralRatio: 160,
    totalLiquidity: 850000,
    utilization: 43,
    minBorrow: 5,
    maxBorrow: 5000,
    isActive: false,
  },
];

// Mock loan positions
const mockLoanPositions: LoanPosition[] = [
  {
    id: "loan-001",
    asset: "FUSD",
    borrowedAmount: 500,
    collateralAmount: 1000,
    interestRate: 7.5,
    healthFactor: 2.1,
    liquidationPrice: 0.35,
    createdAt: "2024-01-15",
    status: "active",
  },
];

export function LendingInterface({ user, onClose }: LendingInterfaceProps) {
  const [mode, setMode] = useState<LendingMode>("overview");
  const [selectedPool, setSelectedPool] = useState<LendingPool>(
    lendingPools[0],
  );
  const [borrowAmount, setBorrowAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loanPositions, setLoanPositions] =
    useState<LoanPosition[]>(mockLoanPositions);

  const calculateRequiredCollateral = (
    borrowAmount: number,
    pool: LendingPool,
  ) => {
    return (borrowAmount * pool.collateralRatio) / 100;
  };

  const calculateHealthFactor = (
    borrowAmount: number,
    collateralAmount: number,
    pool: LendingPool,
  ) => {
    if (borrowAmount === 0) return 0;
    return (collateralAmount / borrowAmount) * (100 / pool.collateralRatio);
  };

  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 2.0) return "text-emerald-400";
    if (healthFactor >= 1.5) return "text-yellow-400";
    if (healthFactor >= 1.1) return "text-orange-400";
    return "text-red-400";
  };

  const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const handleBorrow = async () => {
    if (!user?.loggedIn) {
      toast.error("Please connect your wallet first");
      return;
    }

    const borrow = parseFloat(borrowAmount);
    const collateral = parseFloat(collateralAmount);

    if (!borrow || !collateral) {
      toast.error("Please enter valid amounts");
      return;
    }

    if (borrow < selectedPool.minBorrow || borrow > selectedPool.maxBorrow) {
      toast.error(
        `Borrow amount must be between ${selectedPool.minBorrow} and ${formatCurrency(selectedPool.maxBorrow)} ${selectedPool.asset}`,
      );
      return;
    }

    const requiredCollateral = calculateRequiredCollateral(
      borrow,
      selectedPool,
    );
    if (collateral < requiredCollateral) {
      toast.error(
        `Insufficient collateral. Required: ${formatCurrency(requiredCollateral)} ${selectedPool.collateralAsset}`,
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newLoan: LoanPosition = {
        id: `loan-${Date.now()}`,
        asset: selectedPool.asset,
        borrowedAmount: borrow,
        collateralAmount: collateral,
        interestRate: selectedPool.apr,
        healthFactor: calculateHealthFactor(borrow, collateral, selectedPool),
        liquidationPrice: 0.8, // Mock liquidation price
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };

      setLoanPositions((prev) => [newLoan, ...prev]);
      setBorrowAmount("");
      setCollateralAmount("");
      setMode("overview");

      toast.success("Loan created successfully!");
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Active Loans Summary */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Your Loan Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loanPositions.filter((loan) => loan.status === "active").length ===
          0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No active loans yet</p>
              <Button
                onClick={() => setMode("borrow")}
                className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm"
              >
                Create Your First Loan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {loanPositions
                .filter((loan) => loan.status === "active")
                .map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-700/20 border border-gray-600/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-blue-400 border-blue-400/30"
                        >
                          {loan.asset}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${getHealthFactorColor(loan.healthFactor)} border-current/30`}
                        >
                          Health: {loan.healthFactor.toFixed(2)}
                        </Badge>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        Active
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Borrowed</p>
                        <p className="text-white font-medium">
                          {formatCurrency(loan.borrowedAmount)} {loan.asset}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Collateral</p>
                        <p className="text-white font-medium">
                          {formatCurrency(loan.collateralAmount)} FLOW
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Interest Rate</p>
                        <p className="text-white font-medium">
                          {loan.interestRate}% APR
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Liquidation Price</p>
                        <p className="text-white font-medium">
                          ${loan.liquidationPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Pools */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Available Lending Pools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {lendingPools.map((pool) => (
              <div
                key={pool.id}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  pool.isActive
                    ? "bg-gradient-to-r from-gray-800/40 to-gray-700/30 border-gray-600/30 hover:from-gray-700/50 hover:to-gray-600/40"
                    : "bg-gray-900/20 border-gray-700/20 opacity-50"
                }`}
                onClick={() =>
                  pool.isActive && (setSelectedPool(pool), setMode("borrow"))
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{pool.name}</h3>
                    {!pool.isActive && (
                      <Badge
                        variant="outline"
                        className="text-gray-500 border-gray-500/30"
                      >
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                      {pool.apr}% APR
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Collateral Ratio</p>
                    <p className="text-white font-medium">
                      {pool.collateralRatio}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Total Liquidity</p>
                    <p className="text-white font-medium">
                      ${formatCurrency(pool.totalLiquidity / 1000000, 1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Utilization</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={pool.utilization}
                        className="h-1 flex-1"
                      />
                      <span className="text-white font-medium">
                        {pool.utilization}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BorrowTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => setMode("overview")}
          className="text-gray-400 hover:text-white p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>
      </div>

      {/* Pool Selection */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Selected Pool: {selectedPool.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Borrow Asset</p>
              <p className="text-white font-medium">{selectedPool.asset}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Collateral Asset</p>
              <p className="text-white font-medium">
                {selectedPool.collateralAsset}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Interest Rate</p>
              <p className="text-white font-medium">{selectedPool.apr}% APR</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Collateral Ratio</p>
              <p className="text-white font-medium">
                {selectedPool.collateralRatio}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Borrow Form */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            Borrow Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Borrow Amount */}
          <div className="space-y-2">
            <Label htmlFor="borrowAmount" className="text-white">
              Borrow Amount ({selectedPool.asset})
            </Label>
            <Input
              id="borrowAmount"
              type="number"
              placeholder={`Min: ${selectedPool.minBorrow}, Max: ${formatCurrency(selectedPool.maxBorrow)}`}
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="bg-gray-800/50 border-gray-600/30 text-white"
            />
            <p className="text-xs text-gray-400">
              Available to borrow: ${formatCurrency(selectedPool.maxBorrow)}{" "}
              {selectedPool.asset}
            </p>
          </div>

          {/* Collateral Amount */}
          <div className="space-y-2">
            <Label htmlFor="collateralAmount" className="text-white">
              Collateral Amount ({selectedPool.collateralAsset})
            </Label>
            <Input
              id="collateralAmount"
              type="number"
              placeholder="Enter collateral amount"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="bg-gray-800/50 border-gray-600/30 text-white"
            />
            {borrowAmount && (
              <p className="text-xs text-gray-400">
                Required minimum:{" "}
                {formatCurrency(
                  calculateRequiredCollateral(
                    parseFloat(borrowAmount) || 0,
                    selectedPool,
                  ),
                )}{" "}
                {selectedPool.collateralAsset}
              </p>
            )}
          </div>

          {/* Health Factor Preview */}
          {borrowAmount && collateralAmount && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Health Factor</span>
                <span
                  className={`font-bold ${getHealthFactorColor(calculateHealthFactor(parseFloat(borrowAmount), parseFloat(collateralAmount), selectedPool))}`}
                >
                  {calculateHealthFactor(
                    parseFloat(borrowAmount),
                    parseFloat(collateralAmount),
                    selectedPool,
                  ).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• Health Factor &gt; 1.0 = Safe position</p>
                <p>• Health Factor &lt; 1.0 = Risk of liquidation</p>
                <p>• Recommended: Keep above 1.5</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleBorrow}
            disabled={
              !borrowAmount ||
              !collateralAmount ||
              isProcessing ||
              !user?.loggedIn
            }
            className="w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90 text-white border border-green-400/30 backdrop-blur-sm"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Loan
              </>
            )}
          </Button>

          {!user?.loggedIn && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-yellow-400">
                Please connect your wallet to create a loan
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Lending Interface
          </h2>
          <p className="text-gray-400">Borrow assets using your collateral</p>
        </div>
        <Badge
          variant="outline"
          className="bg-blue-500/20 text-blue-400 border-blue-400/30"
        >
          <Zap className="w-3 h-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as LendingMode)}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-600/30 backdrop-blur-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="borrow"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
          >
            Borrow
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="borrow">
          <BorrowTab />
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Loan History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Loan history feature coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
