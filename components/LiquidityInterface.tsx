"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Droplets,
  TrendingUp,
  Coins,
  Plus,
  Minus,
  Info,
  Activity,
  Target,
  Zap,
  DollarSign,
  PieChart,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useLiquidity } from "@/lib/hooks/useLiquidity";

interface LiquidityInterfaceProps {
  onClose?: () => void;
}

type LiquidityMode = "overview" | "deposit" | "withdraw" | "yield";

// Pool data
const liquidityPools = [
  {
    id: "flow-fusd",
    name: "FLOW-FUSD Pool",
    tokenA: "FLOW",
    tokenB: "FUSD",
    apy: "12.5%",
    totalLiquidity: "5.2M",
    volume24h: "124K",
    fees24h: "372",
    userLiquidity: "2,450.00",
    userShare: "0.047%",
    rewards: "15.23",
    tokenABalance: "1,500.00",
    tokenBBalance: "1,275.00",
  },
  {
    id: "flow-usdc",
    name: "FLOW-USDC Pool",
    tokenA: "FLOW",
    tokenB: "USDC",
    apy: "15.2%",
    totalLiquidity: "2.8M",
    volume24h: "89K",
    fees24h: "267",
    userLiquidity: "0.00",
    userShare: "0.000%",
    rewards: "0.00",
    tokenABalance: "0.00",
    tokenBBalance: "0.00",
  },
];

// User's token balances
const userBalances = [
  { symbol: "FLOW", balance: "1,250.00", price: 0.85 },
  { symbol: "FUSD", balance: "5,000.00", price: 1.0 },
  { symbol: "USDC", balance: "2,500.00", price: 1.0 },
];

export function LiquidityInterface({ onClose }: LiquidityInterfaceProps) {
  const [mode, setMode] = useState<LiquidityMode>("overview");
  const [selectedPool, setSelectedPool] = useState(liquidityPools[0]);
  const [depositAmountA, setDepositAmountA] = useState("");
  const [depositAmountB, setDepositAmountB] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const {
    transactionState,
    executeAddLiquidity,
    executeRemoveLiquidity,
    executeClaimRewards,
  } = useLiquidity();

  const handlePoolSelect = (poolId: string, newMode: LiquidityMode) => {
    const pool =
      liquidityPools.find((p) => p.id === poolId) || liquidityPools[0];
    setSelectedPool(pool);
    setMode(newMode);
  };

  const handleDeposit = async () => {
    if (!depositAmountA || !depositAmountB) {
      toast.error("Please enter amounts for both tokens");
      return;
    }

    try {
      const result = await executeAddLiquidity(
        depositAmountA,
        depositAmountB,
        selectedPool.tokenA,
        selectedPool.tokenB,
      );

      if (result.success) {
        toast.success(`Successfully added liquidity to ${selectedPool.name}!`);
        setDepositAmountA("");
        setDepositAmountB("");
        setMode("overview");
      } else {
        toast.error(result.error || "Failed to add liquidity");
      }
    } catch {
      toast.error("Failed to add liquidity");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      toast.error("Please enter withdrawal amount");
      return;
    }

    try {
      const result = await executeRemoveLiquidity(
        withdrawAmount,
        selectedPool.name,
      );

      if (result.success) {
        toast.success(`Successfully withdrawn from ${selectedPool.name}!`);
        setWithdrawAmount("");
        setMode("overview");
      } else {
        toast.error(result.error || "Failed to withdraw liquidity");
      }
    } catch {
      toast.error("Failed to withdraw liquidity");
    }
  };

  const handleMaxDeposit = (isTokenA: boolean) => {
    const token = isTokenA ? selectedPool.tokenA : selectedPool.tokenB;
    const balance =
      userBalances.find((b) => b.symbol === token)?.balance || "0.00";
    if (isTokenA) {
      setDepositAmountA(balance.replace(",", ""));
    } else {
      setDepositAmountB(balance.replace(",", ""));
    }
  };

  const handleMaxWithdraw = () => {
    setWithdrawAmount(selectedPool.userLiquidity.replace(",", ""));
  };

  if (mode === "deposit") {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Add Liquidity
              </h2>
              <p className="text-gray-400">
                Deposit tokens to earn fees and rewards
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setMode("overview")}
              className="border-gray-600 text-gray-300 hover:border-gray-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Pool Selection */}
          <div className="mb-6">
            <Label className="text-base font-semibold text-white mb-3 block">
              Select Pool
            </Label>
            <Select
              value={selectedPool.id}
              onValueChange={(value) => {
                const pool =
                  liquidityPools.find((p) => p.id === value) ||
                  liquidityPools[0];
                setSelectedPool(pool);
              }}
            >
              <SelectTrigger className="h-14 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {liquidityPools.map((pool) => (
                  <SelectItem
                    key={pool.id}
                    value={pool.id}
                    className="text-white hover:bg-gray-800"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">{pool.name}</span>
                      <Badge
                        variant="outline"
                        className="ml-2 text-green-400 border-green-500/20"
                      >
                        {pool.apy} APY
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Token A Input */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-white">
                {selectedPool.tokenA} Amount
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMaxDeposit(true)}
                className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300"
              >
                Max:{" "}
                {userBalances.find((b) => b.symbol === selectedPool.tokenA)
                  ?.balance || "0.00"}
              </Button>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={depositAmountA}
                onChange={(e) => setDepositAmountA(e.target.value)}
                className="text-xl h-14 pr-20 bg-gray-800/50 border-gray-700 text-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="bg-gray-700 text-white">
                  {selectedPool.tokenA}
                </Badge>
              </div>
            </div>
          </div>

          {/* Token B Input */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-white">
                {selectedPool.tokenB} Amount
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMaxDeposit(false)}
                className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300"
              >
                Max:{" "}
                {userBalances.find((b) => b.symbol === selectedPool.tokenB)
                  ?.balance || "0.00"}
              </Button>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={depositAmountB}
                onChange={(e) => setDepositAmountB(e.target.value)}
                className="text-xl h-14 pr-20 bg-gray-800/50 border-gray-700 text-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="bg-gray-700 text-white">
                  {selectedPool.tokenB}
                </Badge>
              </div>
            </div>
          </div>

          {/* Pool Details */}
          <div className="bg-slate-800/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-400">
              <Info className="w-4 h-4" />
              Pool Information
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">APY</span>
                  <span className="text-sm font-semibold text-green-400">
                    {selectedPool.apy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Liquidity</span>
                  <span className="text-sm font-semibold text-white">
                    ${selectedPool.totalLiquidity}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">24h Volume</span>
                  <span className="text-sm font-semibold text-white">
                    ${selectedPool.volume24h}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">24h Fees</span>
                  <span className="text-sm font-semibold text-blue-400">
                    ${selectedPool.fees24h}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={
              !depositAmountA || !depositAmountB || transactionState.isLoading
            }
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {transactionState.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Liquidity...
              </>
            ) : (
              <>
                Add Liquidity
                <Plus className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mode === "withdraw") {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Withdraw Liquidity
              </h2>
              <p className="text-gray-400">
                Remove liquidity and claim rewards
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setMode("overview")}
              className="border-gray-600 text-gray-300 hover:border-gray-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Position Info */}
          <div className="bg-slate-800/30 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white mb-3">
              {selectedPool.name} Position
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  ${selectedPool.userLiquidity}
                </div>
                <div className="text-sm text-gray-400">Your Liquidity</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  ${selectedPool.rewards}
                </div>
                <div className="text-sm text-gray-400">Claimable Rewards</div>
              </div>
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-white">
                Withdrawal Amount (USD)
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxWithdraw}
                className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300"
              >
                Max: ${selectedPool.userLiquidity}
              </Button>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="text-xl h-14 pr-16 bg-gray-800/50 border-gray-700 text-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Withdrawal Preview */}
          {withdrawAmount && (
            <div className="bg-slate-800/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-400">
                <Info className="w-4 h-4" />
                You will receive
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">
                    {selectedPool.tokenA}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    ~{((parseFloat(withdrawAmount) || 0) * 0.6).toFixed(2)}{" "}
                    {selectedPool.tokenA}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">
                    {selectedPool.tokenB}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    ~{((parseFloat(withdrawAmount) || 0) * 0.4).toFixed(2)}{" "}
                    {selectedPool.tokenB}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Rewards</span>
                  <span className="text-sm font-semibold text-green-400">
                    ${selectedPool.rewards} FLOW
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || transactionState.isLoading}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            {transactionState.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Withdrawing...
              </>
            ) : (
              <>
                Withdraw Liquidity
                <Minus className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mode === "yield") {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Yield Farming
              </h2>
              <p className="text-gray-400">
                Stake LP tokens to earn additional rewards
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setMode("overview")}
              className="border-gray-600 text-gray-300 hover:border-gray-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Yield Farms */}
          <div className="grid gap-4">
            {liquidityPools.map((pool) => (
              <div
                key={pool.id}
                className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {pool.name} Farm
                      </h3>
                      <p className="text-sm text-gray-400">
                        Stake LP tokens to earn FLOW rewards
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
                  >
                    +5.0% Extra APY
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {parseFloat(pool.apy) + 5.0}%
                    </div>
                    <div className="text-xs text-gray-400">Total APY</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      $124K
                    </div>
                    <div className="text-xs text-gray-400">TVL Staked</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      2.5 FLOW
                    </div>
                    <div className="text-xs text-gray-400">Earned Rewards</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      ${pool.userLiquidity}
                    </div>
                    <div className="text-xs text-gray-400">Your LP Tokens</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Stake LP Tokens
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-500/20 text-green-400 hover:bg-green-500/10"
                    onClick={() => {
                      executeClaimRewards(pool.name)
                        .then((result) => {
                          if (result.success) {
                            toast.success("Rewards claimed successfully!");
                          } else {
                            toast.error(
                              result.error || "Failed to claim rewards",
                            );
                          }
                        })
                        .catch(() => {
                          toast.error("Failed to claim rewards");
                        });
                    }}
                    disabled={transactionState.isLoading}
                  >
                    {transactionState.isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    Claim Rewards
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Yield Summary */}
          <div className="mt-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-400">
                Your Yield Summary
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl font-bold text-white">$67.50</div>
                <div className="text-sm text-gray-400">
                  Total Rewards Earned
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">18.7%</div>
                <div className="text-sm text-gray-400">Average APY</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">$2,450</div>
                <div className="text-sm text-gray-400">Total Value Locked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Liquidity Provider Dashboard
              </h2>
              <p className="text-gray-400">
                Provide liquidity to earn trading fees and rewards
              </p>
            </div>
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Liquidity</span>
              </div>
              <div className="text-2xl font-bold text-white">$2,450</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Total Earnings</span>
              </div>
              <div className="text-2xl font-bold text-white">$67.50</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Active Pools</span>
              </div>
              <div className="text-2xl font-bold text-white">1</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Pending Rewards</span>
              </div>
              <div className="text-2xl font-bold text-white">$15.23</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Add Liquidity
                </h3>
                <p className="text-gray-400 text-sm">
                  Earn fees from trading pairs
                </p>
              </div>
            </div>
            <Button
              onClick={() => setMode("deposit")}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              Start Providing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Minus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Manage Positions
                </h3>
                <p className="text-gray-400 text-sm">
                  Withdraw or adjust liquidity
                </p>
              </div>
            </div>
            <Button
              onClick={() => setMode("withdraw")}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Manage Pools
              <Activity className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-yellow-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Yield Farming
                </h3>
                <p className="text-gray-400 text-sm">
                  Stake LP tokens for extra rewards
                </p>
              </div>
            </div>
            <Button
              onClick={() => setMode("yield")}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              Farm Rewards
              <Target className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pool List */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Available Pools
          </h3>
          <div className="space-y-4">
            {liquidityPools.map((pool) => (
              <div
                key={pool.id}
                className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{pool.name}</h4>
                      <p className="text-sm text-gray-400">
                        {pool.tokenA}/{pool.tokenB}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-500/20"
                    >
                      {pool.apy} APY
                    </Badge>
                    {parseFloat(pool.userLiquidity.replace(",", "")) > 0 && (
                      <Badge
                        variant="outline"
                        className="text-blue-400 border-blue-500/20"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Total Liquidity</div>
                    <div className="font-semibold text-white">
                      ${pool.totalLiquidity}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">24h Volume</div>
                    <div className="font-semibold text-white">
                      ${pool.volume24h}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Your Position</div>
                    <div className="font-semibold text-white">
                      ${pool.userLiquidity}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Your Share</div>
                    <div className="font-semibold text-white">
                      {pool.userShare}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handlePoolSelect(pool.id, "deposit")}
                    variant="outline"
                    size="sm"
                    className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Liquidity
                  </Button>
                  {parseFloat(pool.userLiquidity.replace(",", "")) > 0 && (
                    <>
                      <Button
                        onClick={() => handlePoolSelect(pool.id, "withdraw")}
                        variant="outline"
                        size="sm"
                        className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Withdraw
                      </Button>
                      <Button
                        onClick={() => handlePoolSelect(pool.id, "yield")}
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Farm
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
