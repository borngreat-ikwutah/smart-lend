"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Code,
  Shield,
  Zap,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  Search,
  FileText,
  Settings,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DocumentationModalProps {
  onClose: () => void;
}

interface CodeExample {
  title: string;
  language: string;
  code: string;
  description: string;
}

export default function DocumentationModal({
  onClose,
}: DocumentationModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const codeExamples: Record<string, CodeExample[]> = {
    auth: [
      {
        title: "Connect Wallet",
        language: "javascript",
        code: `import * as fcl from "@onflow/fcl";

// Authenticate user
const handleConnect = async () => {
  try {
    await fcl.authenticate();
    console.log("Wallet connected successfully!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

// Subscribe to user state
useEffect(() => {
  const unsubscribe = fcl.currentUser.subscribe(setUser);
  return () => unsubscribe();
}, []);`,
        description: "Connect and authenticate users with Flow wallets",
      },
      {
        title: "Get Trust Score",
        language: "cadence",
        code: `import SmartLendTrustScore from 0xTRUST_SCORE_ADDRESS

pub fun main(userAddress: Address): UFix64 {
    let trustScore = SmartLendTrustScore.getTrustScore(address: userAddress)
    return trustScore ?? 0.0
}`,
        description: "Retrieve a user's trust score from the blockchain",
      },
    ],
    contracts: [
      {
        title: "Borrow Funds",
        language: "cadence",
        code: `import SmartLendLendingPool from 0xLENDING_POOL_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN

transaction(amount: UFix64, collateralAmount: UFix64) {
    prepare(signer: AuthAccount) {
        let lendingPool = SmartLendLendingPool.borrowFunds(
            amount: amount,
            collateralAmount: collateralAmount,
            borrower: signer.address
        )

        log("Loan created successfully")
    }

    execute {
        // Additional execution logic
    }
}`,
        description: "Create a new loan with collateral",
      },
      {
        title: "Deposit Collateral",
        language: "javascript",
        code: `import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const depositCollateral = async (amount) => {
  const transactionId = await fcl.mutate({
    cadence: \`
      import SmartLendLendingPool from 0xLENDING_POOL_ADDRESS

      transaction(amount: UFix64) {
        prepare(signer: AuthAccount) {
          SmartLendLendingPool.depositCollateral(
            amount: amount,
            from: signer
          )
        }
      }
    \`,
    args: (arg, t) => [arg(amount, t.UFix64)],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 9999
  });

  return await fcl.tx(transactionId).onceSealed();
};`,
        description: "Deposit collateral to secure loans",
      },
    ],
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-400/20">
          <BookOpen className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            SmartLend Documentation
          </h3>
          <p className="text-gray-400">
            Comprehensive guide to building on SmartLend&apos;s AI-powered
            lending protocol
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400 font-semibold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    Connect Your Wallet
                  </h4>
                  <p className="text-sm text-gray-400">
                    Use Flow-compatible wallets like Blocto, Lilico, or Dapper
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400 font-semibold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    Complete Verification
                  </h4>
                  <p className="text-sm text-gray-400">
                    Verify your identity to boost your trust score and unlock
                    better rates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400 font-semibold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Start Lending</h4>
                  <p className="text-sm text-gray-400">
                    Deposit collateral and borrow with AI-optimized terms
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Core Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">AI Trust Scoring</h4>
                  <p className="text-sm text-gray-400">
                    Dynamic credit assessment using onchain data
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-400/20">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="font-medium text-white">
                    Onchain Verification
                  </h4>
                  <p className="text-sm text-gray-400">
                    Link external accounts for enhanced trust
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-400/20">
                <Zap className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-medium text-white">Smart Lending</h4>
                  <p className="text-sm text-gray-400">
                    Reduced collateral based on trust score
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ApiTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {codeExamples.auth.map((example, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{example.title}</h4>
                <Badge className="bg-gray-700/50 text-gray-300">
                  {example.language}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{example.description}</p>
              <div className="relative">
                <pre className="bg-gray-950/50 border border-gray-700/30 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-gray-300">{example.code}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(example.code, `auth-${index}`)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-700/50"
                >
                  {copiedCode === `auth-${index}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Smart Contracts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {codeExamples.contracts.map((example, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{example.title}</h4>
                <Badge className="bg-gray-700/50 text-gray-300">
                  {example.language}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{example.description}</p>
              <div className="relative">
                <pre className="bg-gray-950/50 border border-gray-700/30 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-gray-300">{example.code}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(example.code, `contracts-${index}`)
                  }
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-700/50"
                >
                  {copiedCode === `contracts-${index}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const IntegrationTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-400" />
            FCL Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-white">Installation</h4>
            <div className="relative">
              <pre className="bg-gray-950/50 border border-gray-700/30 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">
                  npm install @onflow/fcl @onflow/types
                </code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(
                    "npm install @onflow/fcl @onflow/types",
                    "install",
                  )
                }
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-700/50"
              >
                {copiedCode === "install" ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-white">Configuration</h4>
            <div className="relative">
              <pre className="bg-gray-950/50 border border-gray-700/30 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{`import * as fcl from "@onflow/fcl";

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xProfile", "0xba1132bc08f82fe2");`}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(
                    `import * as fcl from "@onflow/fcl";

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xProfile", "0xba1132bc08f82fe2");`,
                    "config",
                  )
                }
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-700/50"
              >
                {copiedCode === "config" ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-blue-400" />
            External Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <a
              href="https://developers.flow.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors border border-gray-700/30"
            >
              <ExternalLink className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-medium text-white">Flow Developer Docs</h4>
                <p className="text-sm text-gray-400">
                  Official Flow blockchain documentation
                </p>
              </div>
            </a>
            <a
              href="https://github.com/onflow/fcl-js"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors border border-gray-700/30"
            >
              <ExternalLink className="w-5 h-5 text-green-400" />
              <div>
                <h4 className="font-medium text-white">FCL JavaScript SDK</h4>
                <p className="text-sm text-gray-400">
                  Flow Client Library on GitHub
                </p>
              </div>
            </a>
            <a
              href="https://cadence-lang.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors border border-gray-700/30"
            >
              <ExternalLink className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="font-medium text-white">
                  Cadence Documentation
                </h4>
                <p className="text-sm text-gray-400">
                  Learn Flow&apos;s smart contract language
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" />
            Security Measures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-400/20">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Smart Contract Audits
              </h4>
              <p className="text-sm text-gray-400">
                All core smart contracts undergo rigorous security audits by
                leading blockchain security firms. Reports are publicly
                available and contracts are formally verified.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                AI Model Security
              </h4>
              <p className="text-sm text-gray-400">
                Our AI credit scoring models are secured with enterprise-grade
                encryption, access controls, and regular security assessments to
                prevent manipulation.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-400/20">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Risk Management
              </h4>
              <p className="text-sm text-gray-400">
                Dynamic collateral ratios, automated liquidation mechanisms, and
                liquidity pool safeguards protect both lenders and borrowers
                from market volatility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-400/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            ⚠️ Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Always verify contract addresses before interacting</p>
            <p>• Use hardware wallets for large transactions</p>
            <p>• Monitor your positions regularly for liquidation risk</p>
            <p>• Never share your private keys or seed phrases</p>
            <p>• Keep your trust score updated with fresh onchain activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14] border-gray-600/30 backdrop-blur-sm overflow-hidden">
        <DialogHeader className="border-b border-gray-600/30 pb-4">
          <DialogTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/80 to-purple-500/80 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              Documentation
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600/30 text-white"
              />
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-600/30 backdrop-blur-sm mb-4">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
              >
                API
              </TabsTrigger>
              <TabsTrigger
                value="integration"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
              >
                Integration
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white"
              >
                Security
              </TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="api" className="space-y-6 mt-0">
                <ApiTab />
              </TabsContent>

              <TabsContent value="integration" className="space-y-6 mt-0">
                <IntegrationTab />
              </TabsContent>

              <TabsContent value="security" className="space-y-6 mt-0">
                <SecurityTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
