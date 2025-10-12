"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Droplets,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Eye,
  Download,
  Filter
} from "lucide-react";

export default function PortfolioPage() {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [timeframe, setTimeframe] = useState("30d");

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  // Mock portfolio data
  const portfolioData = {
    totalValue: 12450.75,
    totalGain: 1287.50,
    gainPercentage: 11.5,
    healthScore: 85,
    riskLevel: "Medium",
    diversificationScore: 78,
    breakdown: {
      lending: { value: 1612.50, percentage: 13.0, change: -2.5 },
      liquidity: { value: 2450.00, percentage: 19.7, change: +5.2 },
      collateral: { value: 3850.00, percentage: 30.9, change: +1.8 },
      liquid: { value: 4538.25, percentage: 36.4, change: +0.8 }
    },
    positions: [
      {
        id: "flow-fusd-lp",
        type: "liquidity",
        name: "FLOW-FUSD LP",
        asset: "FLOW/FUSD",
        value: 2450.00,
        costBasis: 2200.00,
        pnl: 250.00,
        pnlPercentage: 11.36,
        apy: 17.5,
        healthScore: 95,
        lastUpdated: "2 minutes ago",
        status: "active"
      },
      {
        id: "flow-loan",
        type: "loan",
        name: "FLOW Loan",
        asset: "FLOW",
        value: -1075.00,
        principal: -1000.00,
        pnl: -75.00,
        pnlPercentage: -7.5,
        interestRate: 7.5,
        healthScore: 72,
        dueDate: "2024-01-22",
        status: "active"
      },
      {
        id: "fusd-loan",
        type: "loan",
        name: "FUSD Loan",
        asset: "FUSD",
        value: -537.50,
        principal: -500.00,
        pnl: -37.50,
        pnlPercentage: -7.5,
        interestRate: 6.0,
        healthScore: 65,
        dueDate: "2024-01-15",
        status: "overdue"
      },
      {
        id: "flow-collateral",
        type: "collateral",
        name: "FLOW Collateral",
        asset: "FLOW",
        value: 2500.00,
        costBasis: 2400.00,
        pnl: 100.00,
        pnlPercentage: 4.17,
        utilization: 65,
        healthScore: 80,
        status: "active"
      },
      {
        id: "fusd-collateral",
        type: "collateral",
        name: "FUSD Collateral",
        asset: "FUSD",
        value: 1350.00,
        costBasis: 1350.00,
        pnl: 0.00,
        pnlPercentage: 0.00,
        utilization: 40,
        healthScore: 85,
        status: "active"
      }
    ],
    performance: {
      "7d": { value: 12450.75, change: +156.75, percentage: +1.27 },
      "30d": { value: 12450.75, change: +1287.50, percentage: +11.5 },
      "90d": { value: 12450.75, change: +2100.25, percentage: +20.3 },
      "1y": { value: 12450.75, change: +3250.50, percentage: +35.4 }
    },
    analytics: {
      riskMetrics: {
        volatility: 15.2,
        sharpeRatio: 1.8,
        maxDrawdown: -8.5,
        beta: 0.7
      },
      yields: {
        totalAPY: 12.4,
        lendingAPY: 7.2,
        liquidityAPY: 17.5,
        stakingAPY: 8.9
      }
    },
    recentTransactions: [
      {
        id: "tx_001",
        type: "add_liquidity",
        asset: "FLOW-FUSD",
        amount: "+500.00",
        timestamp: "2 hours ago",
        status: "completed",
        hash: "0x1234...5678"
      },
      {
        id: "tx_002",
        type: "repay",
        asset: "FLOW",
        amount: "-125.50",
        timestamp: "1 day ago",
        status: "completed",
        hash: "0x5678...9abc"
      },
      {
        id: "tx_003",
        type: "borrow",
        asset: "FUSD",
        amount: "+300.00",
        timestamp: "3 days ago",
        status: "completed",
        hash: "0x9abc...def0"
      }
    ]
  };

  const getPositionIcon = (type: string) => {
    switch (type) {
      case "liquidity":
        return <Droplets className="w-5 h-5" />;
      case "loan":
        return <DollarSign className="w-5 h-5" />;
      case "collateral":
        return <Shield className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getPositionColor = (type: string) => {
    switch (type) {
      case "liquidity":
        return "from-green-500 to-emerald-500";
      case "loan":
        return "from-red-500 to-pink-500";
      case "collateral":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 border-green-500/20";
    if (score >= 60) return "text-yellow-400 border-yellow-500/20";
    return "text-red-400 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h1>
          <p className="text-gray-400">
            Track and manage all your positions across lending and liquidity pools
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Portfolio Value</span>
              <PieChart className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${portfolioData.totalValue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">
                +${portfolioData.totalGain.toFixed(2)} ({portfolioData.gainPercentage}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Health Score</span>
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {portfolioData.healthScore}
            </div>
            <div className="text-xs text-green-400">
              Risk Level: {portfolioData.riskLevel}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total APY</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {portfolioData.analytics.yields.totalAPY}%
            </div>
            <div className="text-xs text-purple-400">
              Weighted average return
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Diversification</span>
              <BarChart3 className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {portfolioData.diversificationScore}
            </div>
            <div className="text-xs text-yellow-400">
              Portfolio spread score
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Asset Allocation</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={timeframe === "7d" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe("7d")}
                >
                  7D
                </Button>
                <Button
                  variant={timeframe === "30d" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe("30d")}
                >
                  30D
                </Button>
                <Button
                  variant={timeframe === "90d" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe("90d")}
                >
                  90D
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {Object.entries(portfolioData.breakdown).map(([key, data]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      key === 'lending' ? 'from-red-500 to-pink-500' :
                      key === 'liquidity' ? 'from-green-500 to-emerald-500' :
                      key === 'collateral' ? 'from-blue-500 to-cyan-500' :
                      'from-gray-500 to-gray-600'
                    }`}></div>
                    <div>
                      <div className="font-medium text-white capitalize">{key}</div>
                      <div className="text-sm text-gray-400">${data.value.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{data.percentage}%</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      data.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.change >= 0 ?
                        <TrendingUp className="w-3 h-3" /> :
                        <TrendingDown className="w-3 h-3" />
                      }
                      {Math.abs(data.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {Object.entries(portfolioData.performance).map(([period, data]) => (
                <div key={period} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm uppercase">{period}</span>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      data.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}
                    </div>
                    <div className={`text-xs ${
                      data.percentage >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.percentage >= 0 ? '+' : ''}{data.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800">
          <TabsTrigger
            value="positions"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Positions
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            History
          </TabsTrigger>
        </TabsList>

        {/* Positions Tab */}
        <TabsContent value="positions">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Active Positions</CardTitle>
                <Badge variant="outline" className="text-gray-400">
                  {portfolioData.positions.length} positions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {portfolioData.positions.map((position) => (
                  <div key={position.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getPositionColor(position.type)} rounded-lg flex items-center justify-center`}>
                          {getPositionIcon(position.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{position.name}</h4>
                          <p className="text-sm text-gray-400">{position.asset}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getHealthScoreColor(position.healthScore)}
                        >
                          Health: {position.healthScore}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={position.status === 'overdue' ?
                            "text-red-400 border-red-500/20" :
                            "text-green-400 border-green-500/20"
                          }
                        >
                          {position.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Value</div>
                        <div className="font-semibold text-white">
                          ${Math.abs(position.value).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">P&L</div>
                        <div className={`font-semibold ${
                          position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          {position.type === 'loan' ? 'Interest Rate' :
                           position.type === 'liquidity' ? 'APY' : 'Utilization'}
                        </div>
                        <div className="font-semibold text-white">
                          {position.type === 'loan' ? `${position.interestRate}%` :
                           position.type === 'liquidity' ? `${position.apy}%` :
                           `${position.utilization}%`}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          {position.type === 'loan' ? 'Due Date' : 'Last Updated'}
                        </div>
                        <div className="font-semibold text-white text-sm">
                          {position.type === 'loan' ? position.dueDate : position.lastUpdated}
                        </div>
                      </div>
                    </div>

                    {position.status === 'overdue' && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-3">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">Payment overdue - action required</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {position.type === 'loan' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Repay
                        </Button>
                      )}
                      {position.type === 'liquidity' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <Minus className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Volatility</span>
                    <span className="font-semibold text-white">
                      {portfolioData.analytics.riskMetrics.volatility}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Sharpe Ratio</span>
                    <span className="font-semibold text-white">
                      {portfolioData.analytics.riskMetrics.sharpeRatio}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Max Drawdown</span>
                    <span className="font-semibold text-red-400">
                      {portfolioData.analytics.riskMetrics.maxDrawdown}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Beta</span>
                    <span className="font-semibold text-white">
                      {portfolioData.analytics.riskMetrics.beta}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Yield Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total APY</span>
                    <span className="font-semibold text-green-400">
                      {portfolioData.analytics.yields.totalAPY}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Lending APY</span>
                    <span className="font-semibold text-white">
                      {portfolioData.analytics.yields.lendingAPY}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Liquidity APY</span>
                    <span className="font-semibold text-white">
                      {portfolioData.analytics.yields.liquidityAPY}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Staking APY</span>
                    <span className="font-semibold text-white">
                      {portfolioData.analytics.yields.stakingAPY}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {portfolioData.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'add_liquidity' ? 'bg-green-500/10' :
                      tx.type === 'borrow' ? 'bg-red-500/10' :
                      tx.type === 'repay' ? 'bg-blue-500/10' : 'bg-gray-500/10'
                    }`}>
                      {tx.type === 'add_liquidity' ? <Plus className="w-5 h-5 text-green-400" /> :
                       tx.type === 'borrow' ? <ArrowDownLeft className="w-5 h-5 text-red-400" /> :
                       tx.type === 'repay' ? <ArrowUpRight className="w-5 h-5 text-blue-400" /> :
                       <Activity className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white capitalize">
                          {tx.type.replace('_', ' ')} {tx.asset}
                        </span>
                        <span className="text-sm text-gray-400">{tx.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`font-semibold ${
                          tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${tx.amount}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-400 border-green-500/20 text-xs">
                            {tx.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{tx.hash}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
