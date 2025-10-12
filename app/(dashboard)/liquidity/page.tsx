"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiquidityInterface } from "@/components/LiquidityInterface";
import {
  Droplets,
  TrendingUp,
  Coins,
  PieChart,
  Plus,
  Minus,
  Target,
  Zap,
  ArrowRight,
  DollarSign,
  Activity,
  Info,
  Shield
} from "lucide-react";

export default function LiquidityPage() {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "interface">("overview");

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  // Mock liquidity data
  const liquidityData = {
    totalLiquidity: 2450.00,
    totalEarnings: 67.50,
    activePools: 1,
    pendingRewards: 15.23,
    averageAPY: 18.7,
    totalValueLocked: 2450.00,
    positions: [
      {
        id: "flow-fusd-lp",
        name: "FLOW-FUSD Pool",
        tokenA: "FLOW",
        tokenB: "FUSD",
        liquidity: 2450.00,
        share: "0.047%",
        apy: 12.5,
        farmingAPY: 5.0,
        totalAPY: 17.5,
        rewards: 15.23,
        isStaked: true,
        stakedAmount: 125.45
      }
    ],
    availablePools: [
      {
        id: "flow-fusd",
        name: "FLOW-FUSD Pool",
        tokenA: "FLOW",
        tokenB: "FUSD",
        apy: "12.5%",
        farmingAPY: "+5.0%",
        totalAPY: "17.5%",
        totalLiquidity: "5.2M",
        volume24h: "124K",
        fees24h: "372",
        utilization: "67%"
      },
      {
        id: "flow-usdc",
        name: "FLOW-USDC Pool",
        tokenA: "FLOW",
        tokenB: "USDC",
        apy: "15.2%",
        farmingAPY: "+6.8%",
        totalAPY: "22.0%",
        totalLiquidity: "2.8M",
        volume24h: "89K",
        fees24h: "267",
        utilization: "54%"
      },
      {
        id: "fusd-usdc",
        name: "FUSD-USDC Pool",
        tokenA: "FUSD",
        tokenB: "USDC",
        apy: "8.5%",
        farmingAPY: "+3.5%",
        totalAPY: "12.0%",
        totalLiquidity: "1.5M",
        volume24h: "45K",
        fees24h: "135",
        utilization: "38%"
      }
    ],
    recentActivity: [
      {
        type: "add_liquidity",
        pool: "FLOW-FUSD",
        amount: "1,250 FLOW + 1,062 FUSD",
        timestamp: "2 hours ago",
        status: "completed"
      },
      {
        type: "claim_rewards",
        pool: "FLOW-FUSD",
        amount: "5.67 FLOW",
        timestamp: "1 day ago",
        status: "completed"
      },
      {
        type: "stake_lp",
        pool: "FLOW-FUSD",
        amount: "125.45 LP tokens",
        timestamp: "3 days ago",
        status: "completed"
      }
    ]
  };

  if (activeView === "interface") {
    return <LiquidityInterface onClose={() => setActiveView("overview")} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Liquidity Provider Dashboard</h1>
          <p className="text-gray-400">
            Provide liquidity to earn trading fees and farming rewards
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/10">
            <Shield className="w-4 h-4 mr-2" />
            LP Benefits: +20% APY
          </Badge>
          <Button
            onClick={() => setActiveView("interface")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Liquidity
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Liquidity</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${liquidityData.totalLiquidity.toLocaleString()}
            </div>
            <div className="text-xs text-blue-400">Across {liquidityData.activePools} pool</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${liquidityData.totalEarnings}
            </div>
            <div className="text-xs text-green-400">+{liquidityData.averageAPY}% APY average</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Pending Rewards</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${liquidityData.pendingRewards}
            </div>
            <div className="text-xs text-yellow-400">Ready to claim</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Active Farms</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {liquidityData.positions.filter(p => p.isStaked).length}
            </div>
            <div className="text-xs text-purple-400">Yield farming active</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setActiveView("interface")}
              className="h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex-col gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Liquidity
            </Button>
            <Button
              onClick={() => setActiveView("interface")}
              variant="outline"
              className="h-16 border-purple-500/20 text-purple-400 hover:bg-purple-500/10 flex-col gap-2"
            >
              <Minus className="w-5 h-5" />
              Remove Liquidity
            </Button>
            <Button
              onClick={() => setActiveView("interface")}
              variant="outline"
              className="h-16 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 flex-col gap-2"
            >
              <Zap className="w-5 h-5" />
              Yield Farm
            </Button>
            <Button
              variant="outline"
              className="h-16 border-green-500/20 text-green-400 hover:bg-green-500/10 flex-col gap-2"
            >
              <Target className="w-5 h-5" />
              Claim Rewards
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Positions */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Your Positions</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("interface")}
                className="text-gray-400 hover:text-white"
              >
                Manage All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {liquidityData.positions.length > 0 ? (
              <div className="space-y-4">
                {liquidityData.positions.map((position) => (
                  <div key={position.id} className="bg-slate-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{position.name}</h4>
                          <p className="text-sm text-gray-400">{position.tokenA}/{position.tokenB}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">${position.liquidity.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">{position.share} share</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-400">Base APY</div>
                        <div className="font-semibold text-green-400">{position.apy}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Total APY</div>
                        <div className="font-semibold text-blue-400">{position.totalAPY}%</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-400">Pending Rewards:</span>
                      <span className="font-semibold text-yellow-400">${position.rewards}</span>
                    </div>

                    {position.isStaked && (
                      <div className="flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg mb-3">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-400">
                          Farming: {position.stakedAmount} LP tokens staked
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                      >
                        <Minus className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Liquidity Positions</h3>
                <p className="text-gray-400 mb-4">Start providing liquidity to earn trading fees and rewards.</p>
                <Button onClick={() => setActiveView("interface")}>
                  Add Your First Position
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {liquidityData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'add_liquidity' ? 'bg-green-500/10' :
                    activity.type === 'claim_rewards' ? 'bg-yellow-500/10' :
                    activity.type === 'stake_lp' ? 'bg-purple-500/10' : 'bg-red-500/10'
                  }`}>
                    {activity.type === 'add_liquidity' ? <Plus className="w-5 h-5 text-green-400" /> :
                     activity.type === 'claim_rewards' ? <Target className="w-5 h-5 text-yellow-400" /> :
                     activity.type === 'stake_lp' ? <Zap className="w-5 h-5 text-purple-400" /> :
                     <Minus className="w-5 h-5 text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">
                        {activity.type === 'add_liquidity' && 'Added Liquidity'}
                        {activity.type === 'claim_rewards' && 'Claimed Rewards'}
                        {activity.type === 'stake_lp' && 'Staked LP Tokens'}
                        {activity.type === 'remove_liquidity' && 'Removed Liquidity'}
                      </span>
                      <span className="text-sm text-gray-400">{activity.timestamp}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {activity.pool}: {activity.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Pools */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Available Liquidity Pools</CardTitle>
            <Button
              variant="outline"
              onClick={() => setActiveView("interface")}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              View All Pools
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-4">
            {liquidityData.availablePools.map((pool) => (
              <div key={pool.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{pool.name}</h4>
                      <p className="text-sm text-gray-400">{pool.tokenA}/{pool.tokenB}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-500/20">
                      {pool.apy} APY
                    </Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-500/20">
                      {pool.farmingAPY} Farm
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Total APY</div>
                    <div className="font-semibold text-blue-400">{pool.totalAPY}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">TVL</div>
                    <div className="font-semibold text-white">${pool.totalLiquidity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">24h Volume</div>
                    <div className="font-semibold text-white">${pool.volume24h}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Utilization</div>
                    <div className="font-semibold text-white">{pool.utilization}</div>
                  </div>
                </div>

                <Button
                  onClick={() => setActiveView("interface")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Add Liquidity to {pool.tokenA}/{pool.tokenB}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Benefits */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Liquidity Provider Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Earn Trading Fees</h3>
              <p className="text-sm text-gray-400">Collect 0.3% of all trades in your liquidity pools automatically</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Yield Farming Rewards</h3>
              <p className="text-sm text-gray-400">Stake LP tokens to earn additional FLOW token rewards</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Trust Score Boost</h3>
              <p className="text-sm text-gray-400">Providing liquidity increases your trust score and lending benefits</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-sm text-gray-400">
                <strong className="text-blue-400">Pro Tip:</strong> Diversify across multiple pools to maximize returns and minimize impermanent loss risk. Our AI algorithms help optimize your portfolio allocation.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
