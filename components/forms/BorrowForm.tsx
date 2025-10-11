"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Info,
  TrendingDown,
  Wallet,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useLending } from "@/lib/hooks/useLending";

interface BorrowFormProps {
  poolName: string;
  asset: string;
  apr: string;
  collateralRatio: string;
  onClose?: () => void;
}

const collateralAssets = [
  { symbol: "FLOW", name: "Flow Token", balance: "1,250.00", price: 0.85 },
  { symbol: "FUSD", name: "Flow USD", balance: "5,000.00", price: 1.0 },
  { symbol: "USDC", name: "USD Coin", balance: "2,500.00", price: 1.0 },
];

export function BorrowForm({
  poolName,
  asset,
  apr,
  collateralRatio,
  onClose,
}: BorrowFormProps) {
  const [borrowAmount, setBorrowAmount] = useState("");
  const [selectedCollateral, setSelectedCollateral] = useState(
    collateralAssets[0].symbol,
  );
  const { transactionState, executeBorrow } = useLending();

  const collateralMultiplier = Number.parseFloat(collateralRatio) / 100;
  const requiredCollateral = borrowAmount
    ? (Number.parseFloat(borrowAmount) * collateralMultiplier).toFixed(2)
    : "0.00";
  const selectedAsset = collateralAssets.find(
    (a) => a.symbol === selectedCollateral,
  );
  const maxBorrowAmount = selectedAsset
    ? (
        (Number.parseFloat(selectedAsset.balance) * selectedAsset.price) /
        collateralMultiplier
      ).toFixed(2)
    : "0.00";

  const handleMaxBorrow = () => {
    setBorrowAmount(maxBorrowAmount);
  };

  const handleBorrow = async () => {
    if (!borrowAmount || Number.parseFloat(borrowAmount) <= 0) {
      toast.error("Please enter a valid borrow amount");
      return;
    }

    try {
      const result = await executeBorrow(borrowAmount, asset);

      if (result.success) {
        toast.success(`Successfully borrowed ${borrowAmount} ${asset}!`);
        if (onClose) onClose();
      } else {
        toast.error(result.error || "Transaction failed");
      }
    } catch (error) {
      toast.error("Failed to execute borrow transaction");
    }
  };

  // Calculate health factor (simplified)
  const healthFactor =
    borrowAmount && Number.parseFloat(borrowAmount) > 0 && selectedAsset
      ? (Number.parseFloat(requiredCollateral) * selectedAsset.price) /
        Number.parseFloat(borrowAmount)
      : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-white">
              Borrow {asset}
            </CardTitle>
            <CardDescription className="mt-2 text-gray-400">
              From {poolName}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-blue-400 border-blue-500/20 bg-blue-500/10"
          >
            {apr} APR
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Borrow Amount Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="borrow-amount"
              className="text-base font-semibold text-white"
            >
              Borrow Amount
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMaxBorrow}
              className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300"
            >
              Max: {maxBorrowAmount} {asset}
            </Button>
          </div>
          <div className="relative">
            <Input
              id="borrow-amount"
              type="number"
              placeholder="0.00"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="text-2xl h-14 pr-20 font-semibold bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="font-mono bg-gray-700 text-white"
              >
                {asset}
              </Badge>
            </div>
          </div>
        </div>

        {/* Collateral Selection */}
        <div className="space-y-2">
          <Label
            htmlFor="collateral"
            className="text-base font-semibold text-white"
          >
            Collateral Asset
          </Label>
          <Select
            value={selectedCollateral}
            onValueChange={setSelectedCollateral}
          >
            <SelectTrigger
              id="collateral"
              className="h-14 bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {collateralAssets.map((asset) => (
                <SelectItem
                  key={asset.symbol}
                  value={asset.symbol}
                  className="text-white hover:bg-gray-800"
                >
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="font-semibold">{asset.symbol}</span>
                      <span className="text-gray-400 text-sm">
                        - {asset.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      Balance: {asset.balance}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loan Details */}
        <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <Info className="w-4 h-4" />
            Loan Details
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Required Collateral</span>
              <span className="font-semibold text-white">
                {requiredCollateral} {selectedCollateral}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Collateral Ratio</span>
              <span className="font-semibold text-white">
                {collateralRatio}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Interest Rate (APR)</span>
              <span className="font-semibold text-blue-400">{apr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Liquidation Price</span>
              <span className="font-semibold text-red-400">
                $
                {selectedAsset
                  ? (selectedAsset.price * 0.85).toFixed(2)
                  : "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Health Factor Warning */}
        {borrowAmount && Number.parseFloat(borrowAmount) > 0 && (
          <div
            className={`rounded-lg border p-4 flex items-start gap-3 ${
              healthFactor < 1.5
                ? "border-red-500/20 bg-red-500/5"
                : healthFactor < 2.0
                  ? "border-yellow-500/20 bg-yellow-500/5"
                  : "border-green-500/20 bg-green-500/5"
            }`}
          >
            {healthFactor < 1.5 ? (
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            ) : healthFactor < 2.0 ? (
              <TrendingDown className="w-5 h-5 text-yellow-400 mt-0.5" />
            ) : (
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
            )}
            <div className="space-y-1">
              <div
                className={`font-semibold text-sm ${
                  healthFactor < 1.5
                    ? "text-red-400"
                    : healthFactor < 2.0
                      ? "text-yellow-400"
                      : "text-green-400"
                }`}
              >
                Health Factor: {healthFactor.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {healthFactor < 1.5
                  ? "⚠️ High risk! Your position may be liquidated soon."
                  : healthFactor < 2.0
                    ? "⚠️ Monitor your collateral value regularly."
                    : "✅ Your position is healthy and safe."}
              </div>
            </div>
          </div>
        )}

        {/* Trust Score Boost */}
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
            <Shield className="w-4 h-4" />
            Trust Score Benefits
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Your trust score of 75 provides a 15% reduction in collateral
            requirements and 0.5% lower interest rate.
          </div>
        </div>

        {/* Transaction Status */}
        {transactionState.status !== "idle" && (
          <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2">
              <Info className="w-4 h-4" />
              Transaction Status
            </div>
            {transactionState.status === "pending" && (
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing transaction...
              </div>
            )}
            {transactionState.status === "success" && (
              <div className="text-sm text-green-400">
                Transaction successful! TX ID:{" "}
                {transactionState.transactionId?.slice(0, 8)}...
              </div>
            )}
            {transactionState.status === "error" && (
              <div className="text-sm text-red-400">
                Error: {transactionState.error}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
              disabled={transactionState.isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleBorrow}
            className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            disabled={
              !borrowAmount ||
              Number.parseFloat(borrowAmount) <= 0 ||
              transactionState.isLoading
            }
          >
            {transactionState.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm Borrow
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
