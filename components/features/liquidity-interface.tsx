"use client";

import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import {
  Droplets,
  Plus,
  Minus,
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
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface LiquidityInterfaceProps {
  user: fcl.CurrentUser | null;
  onClose?: () => void;
}

type LiquidityMode = "overview" | "add" | "remove" | "rewards";

interface LiquidityPool {
  id: string;
  name: string;
  asset1: string;
  asset2: string;
  totalLiquidity: number;
  apr: number;
  userLiquidity: number;
  userShare: number;
  rewardsEarned: number;
  volume24h: number;
  fees24h: number;
  isActive: boolean;
}

interface LiquidityPosition {
  id: string;
  poolId: string;
  poolName: string;
  liquidityAmount: number;
  asset1Amount: number;
  asset2Amount: number;
  sharePercentage: number;
  rewardsEarned: number;
  createdAt: string;
  status: "active" | "removed";
}

// Mock liquidity pools data
const liquidityPools: LiquidityPool[] = [
  {
    id: "flow-fusd",
    name: "FLOW/FUSD",
    asset1: "FLOW",
    asset2: "FUSD",
    totalLiquidity: 5200000,
    apr: 12.5,
    userLiquidity: 2500,
    userShare: 0.048,
    rewardsEarned: 45.2,
    volume24h: 125000,
    fees24h: 375,
    isActive: true,
  },
  {
    id: "flow-usdc",
    name: "FLOW/USDC",
    asset1: "FLOW",
    asset2: "USDC",
    totalLiquidity: 3800000,
    apr: 15.8,
    userLiquidity: 0,
    userShare: 0,
    rewardsEarned: 0,
    volume24h: 89000,
    fees24h: 267,
    isActive: true,
  },
  {
    id: "fusd-usdc",
    name: "FUSD/USDC",
    asset1: "FUSD",
    asset2: "USDC",
    totalLiquidity: 2100000,
    apr: 8.3,
    userLiquidity: 0,
    userShare: 0,
    rewardsEarned: 0,
    volume24h: 45000,
    fees24h: 135,
    isActive: false,
  },
];

// Mock liquidity positions
const mockLiquidityPositions: LiquidityPosition[] = [
  {
    id: "pos-001",
    poolId: "flow-fusd",
    poolName: "FLOW/FUSD",
    liquidityAmount: 2500,
    asset1Amount: 1250,
    asset2Amount: 1250,
    sharePercentage: 0.048,
    rewardsEarned: 45.2,
    createdAt: "2024-01-10",
    status: "active",
  },
];

export function LiquidityInterface({ user, onClose }: LiquidityInterfaceProps) {
  const [mode, setMode] = useState<LiquidityMode>("overview");
  const [selectedPool, setSelectedPool] = useState<LiquidityPool>(
    liquidityPools[0],
  );
  const [asset1Amount, setAsset1Amount] = useState("");
  const [asset2Amount, setAsset2Amount] = useState("");
  const [removePercentage, setRemovePercentage] = useState("25");
  const [isProcessing, setIsProcessing] = useState(false);
  const [liquidityPositions, setLiquidityPositions] = useState<
    LiquidityPosition[]
  >(mockLiquidityPositions);

  const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const calculateLiquidityValue = (asset1: number, asset2: number) => {
    return asset1 + asset2; // Simplified calculation
  };

  const calculateAPR = (pool: LiquidityPool) => {
    return pool.apr + (pool.volume24h / pool.totalLiquidity) * 100 * 365;
  };

  const handleAddLiquidity = async () => {
    if (!user?.loggedIn) {
      toast.error("Please connect your wallet first");
      return;
    }

    const amount1 = parseFloat(asset1Amount);
    const amount2 = parseFloat(asset2Amount);

    if (!amount1 || !amount2) {
      toast.error("Please enter valid amounts for both assets");
      return;
    }

    if (amount1 < 1 || amount2 < 1) {
      toast.error("Minimum liquidity amount is 1 for each asset");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newPosition: LiquidityPosition = {
        id: `pos-${Date.now()}`,
        poolId: selectedPool.id,
        poolName: selectedPool.name,
        liquidityAmount: calculateLiquidityValue(amount1, amount2),
        asset1Amount: amount1,
        asset2Amount: amount2,
        sharePercentage:
          (calculateLiquidityValue(amount1, amount2) /
            selectedPool.totalLiquidity) *
          100,
        rewardsEarned: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };

      setLiquidityPositions((prev) => [newPosition, ...prev]);
      setAsset1Amount("");
      setAsset2Amount("");
      setMode("overview");

      toast.success("Liquidity added successfully!");
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!user?.loggedIn) {
      toast.error("Please connect your wallet first");
      return;
    }

    const percentage = parseFloat(removePercentage);
    if (!percentage || percentage < 1 || percentage > 100) {
      toast.error("Please enter a valid percentage (1-100)");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`${percentage}% of liquidity removed successfully!`);
      setMode("overview");
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-blue-400" />
            Your Liquidity Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20">
              <p className="text-sm text-gray-400 mb-1">Total Liquidity</p>
              <p className="text-lg font-bold text-white">
                $
                {formatCurrency(
                  liquidityPositions.reduce(
                    (sum, pos) => sum + pos.liquidityAmount,
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20">
              <p className="text-sm text-gray-400 mb-1">Total Rewards</p>
              <p className="text-lg font-bold text-green-400">
                $
                {formatCurrency(
                  liquidityPositions.reduce(
                    (sum, pos) => sum + pos.rewardsEarned,
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20">
              <p className="text-sm text-gray-400 mb-1">Active Positions</p>
              <p className="text-lg font-bold text-yellow-400">
                {
                  liquidityPositions.filter((pos) => pos.status === "active")
                    .length
                }
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20">
              <p className="text-sm text-gray-400 mb-1">Avg APR</p>
              <p className="text-lg font-bold text-purple-400">
                {liquidityPositions.length > 0 ? "12.5%" : "0%"}
              </p>
            </div>
          </div>

          {liquidityPositions.filter((pos) => pos.status === "active")
            .length === 0 ? (
            <div className="text-center py-8">
              <Droplets className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                No active liquidity positions yet
              </p>
              <Button
                onClick={() => setMode("add")}
                className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm"
              >
                Add Your First Liquidity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {liquidityPositions
                .filter((pos) => pos.status === "active")
                .map((position) => (
                  <div
                    key={position.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-700/20 border border-gray-600/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-blue-400 border-blue-400/30"
                        >
                          {position.poolName}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-green-400 border-green-400/30"
                        >
                          {position.sharePercentage.toFixed(3)}% Share
                        </Badge>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        Active
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Liquidity Value</p>
                        <p className="text-white font-medium">
                          ${formatCurrency(position.liquidityAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Rewards Earned</p>
                        <p className="text-green-400 font-medium">
                          ${formatCurrency(position.rewardsEarned)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Asset Distribution</p>
                        <p className="text-white font-medium">
                          {formatCurrency(position.asset1Amount)} /{" "}
                          {formatCurrency(position.asset2Amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Added Date</p>
                        <p className="text-white font-medium">
                          {position.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => setMode("add")}
                        className="bg-gradient-to-r from-green-500/70 to-emerald-500/70 hover:from-green-600/80 hover:to-emerald-600/80 text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add More
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setMode("remove")}
                        className="border-gray-600/30 hover:border-gray-400/50 bg-gray-900/30 hover:bg-gray-800/40 text-gray-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
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
            Available Liquidity Pools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {liquidityPools.map((pool) => (
              <div
                key={pool.id}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  pool.isActive
                    ? "bg-gradient-to-r from-gray-800/40 to-gray-700/30 border-gray-600/30 hover:from-gray-700/50 hover:to-gray-600/40"
                    : "bg-gray-900/20 border-gray-700/20 opacity-50"
                }`}
                onClick={() =>
                  pool.isActive && (setSelectedPool(pool), setMode("add"))
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Total Liquidity</p>
                    <p className="text-white font-medium">
                      ${formatCurrency(pool.totalLiquidity / 1000000, 1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">24h Volume</p>
                    <p className="text-white font-medium">
                      ${formatCurrency(pool.volume24h / 1000, 0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">24h Fees</p>
                    <p className="text-white font-medium">
                      ${formatCurrency(pool.fees24h)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Your Share</p>
                    <p className="text-white font-medium">
                      {pool.userShare > 0
                        ? `${pool.userShare.toFixed(3)}%`
                        : "0%"}
                    </p>
                  </div>
                </div>

                {pool.userLiquidity > 0 && (
                  <div className="mt-3 p-2 rounded bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs text-blue-400">
                      Your liquidity: ${formatCurrency(pool.userLiquidity)} |
                      Rewards: ${formatCurrency(pool.rewardsEarned)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AddLiquidityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => setMode("overview")}
          className="text-gray-400 hover:text-white p-0"
        >
          ← Back to Overview
        </Button>
      </div>

      {/* Pool Info */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Add Liquidity to {selectedPool.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Pool APR</p>
              <p className="text-green-400 font-medium">{selectedPool.apr}%</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Total Liquidity</p>
              <p className="text-white font-medium">
                ${formatCurrency(selectedPool.totalLiquidity / 1000000, 1)}M
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">24h Volume</p>
              <p className="text-white font-medium">
                ${formatCurrency(selectedPool.volume24h / 1000, 0)}K
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Your Current Share</p>
              <p className="text-white font-medium">
                {selectedPool.userShare > 0
                  ? `${selectedPool.userShare.toFixed(3)}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Liquidity Form */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Liquidity Amounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Asset 1 */}
          <div className="space-y-2">
            <Label htmlFor="asset1Amount" className="text-white">
              {selectedPool.asset1} Amount
            </Label>
            <Input
              id="asset1Amount"
              type="number"
              placeholder="0.0"
              value={asset1Amount}
              onChange={(e) => setAsset1Amount(e.target.value)}
              className="bg-gray-800/50 border-gray-600/30 text-white"
            />
            <p className="text-xs text-gray-400">
              Balance: 1,000 {selectedPool.asset1}
            </p>
          </div>

          {/* Asset 2 */}
          <div className="space-y-2">
            <Label htmlFor="asset2Amount" className="text-white">
              {selectedPool.asset2} Amount
            </Label>
            <Input
              id="asset2Amount"
              type="number"
              placeholder="0.0"
              value={asset2Amount}
              onChange={(e) => setAsset2Amount(e.target.value)}
              className="bg-gray-800/50 border-gray-600/30 text-white"
            />
            <p className="text-xs text-gray-400">
              Balance: 5,000 {selectedPool.asset2}
            </p>
          </div>

          {/* Summary */}
          {asset1Amount && asset2Amount && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
              <h4 className="font-medium text-white mb-2">
                Transaction Summary
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Liquidity Value:</span>
                  <span className="text-white">
                    $
                    {formatCurrency(
                      calculateLiquidityValue(
                        parseFloat(asset1Amount),
                        parseFloat(asset2Amount),
                      ),
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Pool Share:</span>
                  <span className="text-white">
                    {(
                      (calculateLiquidityValue(
                        parseFloat(asset1Amount),
                        parseFloat(asset2Amount),
                      ) /
                        selectedPool.totalLiquidity) *
                      100
                    ).toFixed(4)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated APR:</span>
                  <span className="text-green-400">{selectedPool.apr}%</span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddLiquidity}
            disabled={
              !asset1Amount || !asset2Amount || isProcessing || !user?.loggedIn
            }
            className="w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90 text-white border border-green-400/30 backdrop-blur-sm"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Adding Liquidity...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Liquidity
              </>
            )}
          </Button>

          {!user?.loggedIn && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-yellow-400">
                Please connect your wallet to add liquidity
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const RemoveLiquidityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => setMode("overview")}
          className="text-gray-400 hover:text-white p-0"
        >
          ← Back to Overview
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Minus className="w-5 h-5 text-red-400" />
            Remove Liquidity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-white">Remove Percentage</Label>
            <div className="grid grid-cols-4 gap-2">
              {["25", "50", "75", "100"].map((percentage) => (
                <Button
                  key={percentage}
                  variant={
                    removePercentage === percentage ? "default" : "outline"
                  }
                  onClick={() => setRemovePercentage(percentage)}
                  className={
                    removePercentage === percentage
                      ? "bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white"
                      : "border-gray-600/30 hover:border-gray-400/50 bg-gray-900/30 hover:bg-gray-800/40 text-gray-300"
                  }
                >
                  {percentage}%
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom percentage"
              value={removePercentage}
              onChange={(e) => setRemovePercentage(e.target.value)}
              className="bg-gray-800/50 border-gray-600/30 text-white"
              min="1"
              max="100"
            />
          </div>

          <Button
            onClick={handleRemoveLiquidity}
            disabled={!removePercentage || isProcessing || !user?.loggedIn}
            className="w-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600/90 hover:to-pink-600/90 text-white border border-red-400/30 backdrop-blur-sm"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Removing Liquidity...
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 mr-2" />
                Remove {removePercentage}% Liquidity
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Liquidity Interface
          </h2>
          <p className="text-gray-400">Provide liquidity and earn rewards</p>
        </div>
        <Badge
          variant="outline"
          className="bg-blue-500/20 text-blue-400 border-blue-400/30"
        >
          <Droplets className="w-3 h-3 mr-1" />
          LP Rewards
        </Badge>
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as LiquidityMode)}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-600/30 backdrop-blur-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
          >
            Add
          </TabsTrigger>
          <TabsTrigger
            value="remove"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
          >
            Remove
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
          >
            Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="add">
          <AddLiquidityTab />
        </TabsContent>

        <TabsContent value="remove">
          <RemoveLiquidityTab />
        </TabsContent>

        <TabsContent value="rewards">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Rewards Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Detailed rewards tracking coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
