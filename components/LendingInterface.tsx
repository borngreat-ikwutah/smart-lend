"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BorrowForm } from "@/components/forms/BorrowForm"
import { RepayForm } from "@/components/forms/RepayForm"
import {
  ArrowRight,
  ArrowLeft,
  DollarSign,
  CreditCard,
  TrendingUp,
  Shield,
  Info,
  Activity
} from "lucide-react"

interface LendingInterfaceProps {
  onClose?: () => void
}

type LendingMode = "overview" | "borrow" | "repay"

// Mock lending pools data
const lendingPools = [
  {
    name: "FLOW-FUSD Pool",
    asset: "FLOW",
    apr: "7.5%",
    collateralRatio: "150%",
    totalLiquidity: "2.5M",
    utilization: "67%"
  },
  {
    name: "FUSD-FLOW Pool",
    asset: "FUSD",
    apr: "6.0%",
    collateralRatio: "140%",
    totalLiquidity: "1.8M",
    utilization: "54%"
  }
]

export function LendingInterface({ onClose }: LendingInterfaceProps) {
  const [mode, setMode] = useState<LendingMode>("overview")
  const [selectedPool, setSelectedPool] = useState(lendingPools[0])

  const handleBorrowSelect = (pool: typeof lendingPools[0]) => {
    setSelectedPool(pool)
    setMode("borrow")
  }

  const handleBackToOverview = () => {
    setMode("overview")
  }

  if (mode === "borrow") {
    return (
      <BorrowForm
        poolName={selectedPool.name}
        asset={selectedPool.asset}
        apr={selectedPool.apr}
        collateralRatio={selectedPool.collateralRatio}
        onClose={handleBackToOverview}
      />
    )
  }

  if (mode === "repay") {
    return (
      <RepayForm
        onClose={handleBackToOverview}
        onSuccess={() => {
          // Handle successful repayment
          setMode("overview")
        }}
      />
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Lending Dashboard</h2>
              <p className="text-gray-400">
                Borrow funds or repay existing loans with AI-powered trust scoring
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Trust Score</span>
              </div>
              <div className="text-2xl font-bold text-white">75</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Available Credit</span>
              </div>
              <div className="text-2xl font-bold text-white">$10K</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Active Loans</span>
              </div>
              <div className="text-2xl font-bold text-white">2</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Total Borrowed</span>
              </div>
              <div className="text-2xl font-bold text-white">$1.6K</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Borrow Section */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Borrow Funds</h3>
                <p className="text-gray-400 text-sm">Access liquidity with reduced collateral</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Trust Score Benefits</span>
                </div>
                <p className="text-xs text-gray-400">
                  Your trust score of 75 provides 15% collateral reduction and 0.5% rate discount
                </p>
              </div>

              {/* Available Pools */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Available Pools</h4>
                {lendingPools.map((pool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => handleBorrowSelect(pool)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{pool.asset}</span>
                        <Badge variant="outline" className="text-xs text-green-400 border-green-500/20">
                          {pool.apr} APR
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        Collateral: {pool.collateralRatio} • Liquidity: ${pool.totalLiquidity}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setMode("borrow")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Start Borrowing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Repay Section */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-green-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Repay Loans</h3>
                <p className="text-gray-400 text-sm">Manage your active loan payments</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Active Loans Summary */}
              <div className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-300">Active Loans</h4>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/20">
                    2 Loans
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Balance</span>
                    <span className="font-medium text-white">$1,612.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Next Payment</span>
                    <span className="font-medium text-yellow-400">$53.75 (overdue)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Interest Accrued</span>
                    <span className="font-medium text-red-400">$112.50</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Payment Due</span>
                </div>
                <p className="text-xs text-gray-400">
                  You have an overdue payment. Make a payment to avoid additional fees.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setMode("repay")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Make Payment
              <CreditCard className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
