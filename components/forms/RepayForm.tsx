"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft,
  Info,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Calculator,
  Loader2,
} from "lucide-react";
import { useLending } from "@/lib/hooks/useLending";

interface Loan {
  id: string;
  asset: string;
  principal: number;
  currentBalance: number;
  interestRate: number;
  interestAccrued: number;
  nextPaymentDate: Date;
  minimumPayment: number;
  collateralAmount: number;
  collateralAsset: string;
  healthFactor: number;
  daysOverdue: number;
}

interface RepayFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

// Mock loans data - in real app, this would come from onchain queries
const mockLoans: Loan[] = [
  {
    id: "loan_001",
    asset: "FLOW",
    principal: 1000,
    currentBalance: 1075,
    interestRate: 7.5,
    interestAccrued: 75,
    nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    minimumPayment: 107.5,
    collateralAmount: 1500,
    collateralAsset: "FUSD",
    healthFactor: 1.85,
    daysOverdue: 0,
  },
  {
    id: "loan_002",
    asset: "FUSD",
    principal: 500,
    currentBalance: 537.5,
    interestRate: 6.0,
    interestAccrued: 37.5,
    nextPaymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
    minimumPayment: 53.75,
    collateralAmount: 800,
    collateralAsset: "FLOW",
    healthFactor: 1.25,
    daysOverdue: 2,
  },
];

export function RepayForm({ onClose, onSuccess }: RepayFormProps) {
  const [selectedLoanId, setSelectedLoanId] = useState(mockLoans[0]?.id || "");
  const [repayAmount, setRepayAmount] = useState("");
  const [paymentType, setPaymentType] = useState<"minimum" | "full" | "custom">(
    "minimum",
  );
  const { transactionState, executeRepay } = useLending();

  const selectedLoan = mockLoans.find((loan) => loan.id === selectedLoanId);

  useEffect(() => {
    if (selectedLoan && paymentType !== "custom") {
      if (paymentType === "minimum") {
        setRepayAmount(selectedLoan.minimumPayment.toString());
      } else if (paymentType === "full") {
        setRepayAmount(selectedLoan.currentBalance.toString());
      }
    }
  }, [selectedLoan, paymentType]);

  const handlePaymentTypeChange = (type: "minimum" | "full" | "custom") => {
    setPaymentType(type);
    if (type === "custom") {
      setRepayAmount("");
    }
  };

  const handleRepay = async () => {
    if (!selectedLoan || !repayAmount || Number.parseFloat(repayAmount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    try {
      const result = await executeRepay(repayAmount, selectedLoan.asset);

      if (result.success) {
        toast.success(
          `Successfully repaid ${repayAmount} ${selectedLoan.asset}!`,
        );
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        toast.error(result.error || "Transaction failed");
      }
    } catch (error) {
      toast.error("Failed to execute repay transaction");
    }
  };

  const calculateNewBalance = () => {
    if (!selectedLoan || !repayAmount) return null;

    const payment = Number.parseFloat(repayAmount);
    const newBalance = Math.max(0, selectedLoan.currentBalance - payment);
    const newHealthFactor =
      newBalance > 0
        ? (selectedLoan.collateralAmount * 0.85) / newBalance
        : Infinity;

    return {
      newBalance: newBalance.toFixed(2),
      healthFactor:
        newHealthFactor === Infinity ? "∞" : newHealthFactor.toFixed(2),
      interestSaved: Math.min(payment, selectedLoan.interestAccrued).toFixed(2),
    };
  };

  const calculation = calculateNewBalance();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPaymentStatus = (loan: Loan) => {
    if (loan.daysOverdue > 0) {
      return {
        status: "overdue",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
      };
    } else if (loan.healthFactor < 1.5) {
      return {
        status: "at-risk",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
      };
    }
    return {
      status: "healthy",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    };
  };

  if (mockLoans.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Active Loans
          </h3>
          <p className="text-gray-400 mb-6">
            You don&apos;t have any active loans to repay. All your loans are
            fully paid off!
          </p>
          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-white">Repay Loan</CardTitle>
            <CardDescription className="mt-2 text-gray-400">
              {mockLoans.length === 1
                ? "Manage your loan repayment"
                : "Select and manage your loan repayments"}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-blue-400 border-blue-500/20 bg-blue-500/10"
          >
            {mockLoans.length} Active Loan{mockLoans.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Loan Selection */}
        {mockLoans.length > 1 && (
          <div className="space-y-2">
            <Label
              htmlFor="loan-select"
              className="text-base font-semibold text-white"
            >
              Select Loan
            </Label>
            <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
              <SelectTrigger
                id="loan-select"
                className="h-14 bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {mockLoans.map((loan) => {
                  const status = getPaymentStatus(loan);
                  return (
                    <SelectItem
                      key={loan.id}
                      value={loan.id}
                      className="text-white hover:bg-gray-800"
                    >
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">
                            {loan.asset} Loan
                          </span>
                          <Badge
                            className={`text-xs ${status.color} ${status.bgColor} ${status.borderColor}`}
                          >
                            {loan.daysOverdue > 0
                              ? `${loan.daysOverdue}d overdue`
                              : "Current"}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-400">
                          ${loan.currentBalance}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedLoan && (
          <>
            {/* Loan Overview */}
            <div
              className={`rounded-lg border p-4 ${getPaymentStatus(selectedLoan).bgColor} ${getPaymentStatus(selectedLoan).borderColor}`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Info className="w-4 h-4" />
                <span className={getPaymentStatus(selectedLoan).color}>
                  Loan Overview
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Balance</span>
                    <span className="font-semibold text-white">
                      ${selectedLoan.currentBalance}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Interest Rate</span>
                    <span className="font-semibold text-white">
                      {selectedLoan.interestRate}% APR
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Health Factor</span>
                    <span
                      className={`font-semibold ${
                        selectedLoan.healthFactor < 1.5
                          ? "text-red-400"
                          : selectedLoan.healthFactor < 2.0
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      {selectedLoan.healthFactor.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Next Payment</span>
                    <span
                      className={`font-semibold ${selectedLoan.daysOverdue > 0 ? "text-red-400" : "text-white"}`}
                    >
                      {formatDate(selectedLoan.nextPaymentDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Minimum Payment</span>
                    <span className="font-semibold text-white">
                      ${selectedLoan.minimumPayment}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Collateral</span>
                    <span className="font-semibold text-white">
                      {selectedLoan.collateralAmount}{" "}
                      {selectedLoan.collateralAsset}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-white">
                Payment Options
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant={paymentType === "minimum" ? "default" : "outline"}
                  onClick={() => handlePaymentTypeChange("minimum")}
                  className={`h-auto p-4 flex flex-col items-start gap-2 ${
                    paymentType === "minimum"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-transparent border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Minimum</span>
                  </div>
                  <span className="text-sm opacity-80">
                    ${selectedLoan.minimumPayment}
                  </span>
                </Button>

                <Button
                  variant={paymentType === "full" ? "default" : "outline"}
                  onClick={() => handlePaymentTypeChange("full")}
                  className={`h-auto p-4 flex flex-col items-start gap-2 ${
                    paymentType === "full"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-transparent border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Pay Off</span>
                  </div>
                  <span className="text-sm opacity-80">
                    ${selectedLoan.currentBalance}
                  </span>
                </Button>

                <Button
                  variant={paymentType === "custom" ? "default" : "outline"}
                  onClick={() => handlePaymentTypeChange("custom")}
                  className={`h-auto p-4 flex flex-col items-start gap-2 ${
                    paymentType === "custom"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-transparent border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span className="font-medium">Custom</span>
                  </div>
                  <span className="text-sm opacity-80">Enter amount</span>
                </Button>
              </div>
            </div>

            {/* Repayment Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="repay-amount"
                  className="text-base font-semibold text-white"
                >
                  Payment Amount
                </Label>
                {paymentType === "custom" && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setRepayAmount(selectedLoan.minimumPayment.toString())
                      }
                      className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300"
                    >
                      Min: ${selectedLoan.minimumPayment}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setRepayAmount(selectedLoan.currentBalance.toString())
                      }
                      className="h-auto p-0 text-xs text-green-400 hover:text-green-300"
                    >
                      Max: ${selectedLoan.currentBalance}
                    </Button>
                  </div>
                )}
              </div>
              <div className="relative">
                <Input
                  id="repay-amount"
                  type="number"
                  placeholder="0.00"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  disabled={paymentType !== "custom"}
                  className="text-2xl h-14 pr-20 font-semibold bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="font-mono bg-gray-700 text-white"
                  >
                    {selectedLoan.asset}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Payment Impact */}
            {calculation &&
              repayAmount &&
              Number.parseFloat(repayAmount) > 0 && (
                <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
                    <Calculator className="w-4 h-4" />
                    Payment Impact
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">New Balance</span>
                      <span className="font-semibold text-white">
                        ${calculation.newBalance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        New Health Factor
                      </span>
                      <span className="font-semibold text-green-400">
                        {calculation.healthFactor}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Interest Saved
                      </span>
                      <span className="font-semibold text-blue-400">
                        ${calculation.interestSaved}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* Validation Messages */}
            {repayAmount && Number.parseFloat(repayAmount) > 0 && (
              <div className="space-y-2">
                {/* Insufficient payment warning */}
                {Number.parseFloat(repayAmount) <
                  selectedLoan.minimumPayment && (
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-sm text-yellow-400">
                        Below Minimum Payment
                      </div>
                      <div className="text-xs text-gray-400">
                        Payment is below the minimum required amount of $
                        {selectedLoan.minimumPayment}
                      </div>
                    </div>
                  </div>
                )}

                {/* Overpayment warning */}
                {Number.parseFloat(repayAmount) >
                  selectedLoan.currentBalance && (
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold text-sm text-yellow-400">
                        Payment Exceeds Balance
                      </div>
                      <div className="text-xs text-gray-400">
                        Payment amount exceeds current loan balance. Only $
                        {selectedLoan.currentBalance} will be charged.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleRepay}
                className="flex-1 gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                disabled={
                  !repayAmount ||
                  Number.parseFloat(repayAmount) <= 0 ||
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
                    Confirm Payment
                    <DollarSign className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
