"use client";

import React from "react";
import { X, BookOpen, Code, Shield, Zap, TrendingUp, ExternalLink, Copy, Check, Search } from "lucide-react";
import CustomIcon from "./CustomIcon";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  tab: string;
  title: string;
  content: string;
  category: string;
  relevanceScore?: number;
}

export default function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);

  // Search index for all documentation content
  const searchIndex = React.useMemo(() => [
    // Overview section
    { id: "overview-intro", tab: "overview", title: "Welcome to SmartLend", content: "SmartLend is a revolutionary DeFi lending protocol built on the Flow blockchain, leveraging AI-powered credit scoring and onchain verification to enable undercollateralized loans.", category: "Introduction" },
    { id: "overview-features", tab: "overview", title: "Core Features", content: "AI Trust Scoring, Onchain Verification, Smart Lending with reduced collateral requirements based on trust score.", category: "Features" },
    { id: "overview-quickstart", tab: "overview", title: "Quick Start Guide", content: "Connect your Flow wallet, initialize your SmartLend account, get verified onchain, deposit collateral, borrow funds with AI-driven rates.", category: "Getting Started" },
    
    // API Reference section
    { id: "api-trustscore", tab: "api-reference", title: "TrustScore Contract", content: "Manages and stores user trust scores on the Flow blockchain. Use getTrustScore() to retrieve user scores.", category: "Smart Contracts" },
    { id: "api-lendingpool", tab: "api-reference", title: "LendingPool Contract", content: "Manages liquidity pools, collateral, and loan operations. Includes depositCollateral, borrow, repay functions.", category: "Smart Contracts" },
    { id: "api-attestation", tab: "api-reference", title: "FlowAttestation Contract", content: "Onchain verification system for user identity and external accounts. Use getAttestationStatus() to check verification.", category: "Smart Contracts" },
    
    // Integration section
    { id: "integration-fcl", tab: "integration", title: "FCL Configuration", content: "Set up Flow Client Library to connect to Flow network with access node and wallet discovery.", category: "Setup" },
    { id: "integration-auth", tab: "integration", title: "User Authentication", content: "Use fcl.authenticate() to login users and fcl.unauthenticate() to logout.", category: "Authentication" },
    { id: "integration-contracts", tab: "integration", title: "Contract Interaction", content: "Use FCL to send transactions and execute scripts. Example: getUserScore() function to retrieve trust scores.", category: "Development" },
    
    // Security section
    { id: "security-audits", tab: "security", title: "Smart Contract Audits", content: "All core Cadence smart contracts undergo independent security audits by leading blockchain security firms.", category: "Security" },
    { id: "security-ai", tab: "security", title: "AI Model Security", content: "Offchain AI credit scoring model secured with data encryption, access controls, and regular security assessments.", category: "AI Security" },
    { id: "security-risk", tab: "security", title: "Risk Management", content: "Dynamic collateral ratios, liquidation mechanisms, and liquidity pool safeguards to protect lenders and borrowers.", category: "Risk Management" },
    
    // Common terms
    { id: "terms-collateral", tab: "overview", title: "Collateral Ratio", content: "The ratio of collateral to borrowed amount. Higher trust scores allow lower collateral requirements.", category: "Glossary" },
    { id: "terms-trustscore", tab: "overview", title: "Trust Score", content: "AI-powered credit score from 0-100 based on onchain behavior and verification status.", category: "Glossary" },
    { id: "terms-attestation", tab: "overview", title: "Attestation", content: "Onchain verification record linking wallet to verified external accounts for enhanced trust.", category: "Glossary" },
  ], []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = searchIndex.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    ).map(item => ({
      ...item,
      relevanceScore: calculateRelevanceScore(item, query)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const calculateRelevanceScore = (item: SearchResult, query: string) => {
    const queryLower = query.toLowerCase();
    let score = 0;
    
    // Title matches get highest score
    if (item.title.toLowerCase().includes(queryLower)) score += 10;
    
    // Category matches get medium score
    if (item.category.toLowerCase().includes(queryLower)) score += 5;
    
    // Content matches get lower score
    if (item.content.toLowerCase().includes(queryLower)) score += 1;
    
    return score;
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setActiveTab(result.tab);
    setShowSearchResults(false);
    
    // Add to search history
    if (searchQuery.trim()) {
      setSearchHistory(prev => {
        const newHistory = [searchQuery.trim(), ...prev.filter(term => term !== searchQuery.trim())].slice(0, 5);
        return newHistory;
      });
    }
    
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchSubmit = (query: string) => {
    handleSearch(query);
    if (query.trim()) {
      setSearchHistory(prev => {
        const newHistory = [query.trim(), ...prev.filter(term => term !== query.trim())].slice(0, 5);
        return newHistory;
      });
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search documentation"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape to close search results
      if (e.key === 'Escape' && showSearchResults) {
        setShowSearchResults(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, showSearchResults]);

  // Popular search terms for suggestions
  const popularSearches = [
    "trust score", "FCL", "security", "smart contracts", "API", 
    "authentication", "collateral", "borrow", "verification"
  ];

  if (!isOpen) return null;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    connect: `import * as fcl from "@onflow/fcl";

// Connect to Flow wallet
const connectWallet = async () => {
  try {
    await fcl.authenticate();
    console.log("Wallet connected!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
};`,
    
    getScore: `import * as fcl from "@onflow/fcl";

// Get user trust score
const getTrustScore = async (userAddress: string) => {
  const result = await fcl.query({
    cadence: \`
      import TrustScore from 0xTrustScore
      
      pub fun main(address: Address): UFix64 {
        let trustScore = TrustScore.getTrustScore(address: address)
        return trustScore.score
      }
    \`,
    args: (arg, t) => [arg(userAddress, t.Address)]
  });
  
  return result;
};`,
    
    borrow: `import * as fcl from "@onflow/fcl";

// Borrow funds with trust score
const borrowFunds = async (amount: UFix64) => {
  const transactionId = await fcl.mutate({
    cadence: \`
      import LendingPool from 0xLendingPool
      import FlowToken from 0xFlowToken
      
      transaction(amount: UFix64) {
        prepare(acct: AuthAccount) {
          let pool = acct.getAccount(0xLendingPool)
            .getCapability<&LendingPool.LendingPool>(LendingPool.PoolPublic)
            .borrow()!
            
          let vault = acct.getCapability<&FlowToken.Vault>(FlowToken.Receiver)
            .borrow()!
            
          pool.borrow(amount: amount, recipient: vault)
        }
      }
    \`,
    args: (arg, t) => [arg(amount, t.UFix64)],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    authorizations: [fcl.currentUser]
  });
  
  return transactionId;
};`
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "api", label: "API Reference", icon: Code },
    { id: "integration", label: "Integration", icon: Zap },
    { id: "security", label: "Security", icon: Shield }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700/50 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CustomIcon name="logo" size={32} />
              <h2 className="text-2xl font-bold text-white">SmartLend Documentation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleSearchSubmit(searchQuery.trim());
                }
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search documentation... (e.g., 'trust score', 'FCL', 'security')"
              className="block w-full pl-10 pr-20 py-3 border border-slate-600 rounded-lg bg-slate-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono text-gray-400 bg-slate-700 rounded border border-slate-600">
                ⌘K
              </kbd>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-50 mt-2 w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-400 mb-2 px-2">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          result.tab === 'overview' ? 'bg-blue-400' :
                          result.tab === 'api-reference' ? 'bg-green-400' :
                          result.tab === 'integration' ? 'bg-purple-400' :
                          'bg-orange-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            {result.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.tab === 'overview' ? 'bg-blue-500/20 text-blue-400' :
                            result.tab === 'api-reference' ? 'bg-green-500/20 text-green-400' :
                            result.tab === 'integration' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {result.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {result.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {searchFocused && !searchQuery && (
            <div className="absolute z-50 mt-2 w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
              <div className="p-4">
                {searchHistory.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-400 mb-2">Recent searches</div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(term);
                            handleSearch(term);
                          }}
                          className="px-3 py-1 text-sm text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-colors flex items-center gap-1"
                        >
                          <span>{term}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchHistory(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs font-medium text-gray-400 mb-2">Popular searches</div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(term);
                      }}
                      className="px-3 py-1 text-sm text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Results */}
          {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && (
            <div className="absolute z-50 mt-2 w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
              <div className="p-4 text-center">
                <Search className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 mb-1">No results found for &quot;{searchQuery}&quot;</p>
                <p className="text-sm text-gray-500">Try different keywords or check the spelling</p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {popularSearches.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(term);
                      }}
                      className="px-3 py-1 text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-700/50">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-400 bg-slate-800/50"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Welcome to SmartLend</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  SmartLend is a revolutionary AI-powered lending protocol built on Flow blockchain. 
                  Our platform combines advanced machine learning with onchain verification to provide 
                  transparent credit scoring and undercollateralized lending opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CustomIcon name="ai-trust" size={32} />
                    <h4 className="text-xl font-semibold text-white">AI Trust Scoring</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Our machine learning models analyze your onchain behavior to generate 
                    transparent credit scores from 0-100, updated in real-time.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CustomIcon name="verification" size={32} />
                    <h4 className="text-xl font-semibold text-white">Onchain Verification</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Link your wallet to verified external accounts for enhanced trust scores 
                    and access to premium lending features.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CustomIcon name="smart-lending" size={32} />
                    <h4 className="text-xl font-semibold text-white">Smart Lending</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Borrow with reduced collateral requirements based on your trust score. 
                    Higher scores unlock better rates and lower collateral needs.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <h4 className="text-xl font-semibold text-white">Flow Integration</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Built natively on Flow blockchain with Cadence smart contracts, 
                    ensuring security, scalability, and composability.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20">
                <h4 className="text-lg font-semibold text-white mb-3">Quick Start</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Connect your Flow wallet (Blocto, Lilico, or other compatible wallets)</li>
                  <li>Initialize your account with SmartLend contracts</li>
                  <li>Get your trust score calculated based on onchain activity</li>
                  <li>Verify your identity for additional score boost</li>
                  <li>Start borrowing with reduced collateral requirements</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">API Reference</h3>
                <p className="text-gray-300 mb-6">
                  SmartLend provides a comprehensive set of Cadence contracts and scripts for 
                  interacting with our lending protocol.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Core Contracts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-400 mb-2">TrustScore.cdc</h5>
                      <p className="text-gray-300 text-sm">Manages user credit scores and trust metrics</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">LendingPool.cdc</h5>
                      <p className="text-gray-300 text-sm">Handles lending operations and collateral management</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-400 mb-2">FlowAttestation.cdc</h5>
                      <p className="text-gray-300 text-sm">Onchain verification and attestation system</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-400 mb-2">TrustScoreOracle.cdc</h5>
                      <p className="text-gray-300 text-sm">AI integration and score calculation oracle</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Code Examples</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-lg font-medium text-white mb-2">Connect Wallet</h5>
                      <div className="relative">
                        <pre className="bg-slate-900 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                          <code>{codeExamples.connect}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(codeExamples.connect, "connect")}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === "connect" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium text-white mb-2">Get Trust Score</h5>
                      <div className="relative">
                        <pre className="bg-slate-900 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                          <code>{codeExamples.getScore}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(codeExamples.getScore, "getScore")}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === "getScore" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium text-white mb-2">Borrow Funds</h5>
                      <div className="relative">
                        <pre className="bg-slate-900 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                          <code>{codeExamples.borrow}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(codeExamples.borrow, "borrow")}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === "borrow" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integration" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Integration Guide</h3>
                <p className="text-gray-300 mb-6">
                  Learn how to integrate SmartLend into your applications and protocols.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Installation</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-white mb-2">1. Install FCL</h5>
                      <pre className="bg-slate-900 rounded-lg p-3 text-sm text-gray-300">
                        npm install @onflow/fcl @onflow/sdk
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">2. Configure FCL</h5>
                      <pre className="bg-slate-900 rounded-lg p-3 text-sm text-gray-300">
                        {`import { config } from "@onflow/fcl";

config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn"
});`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">SmartLend SDK</h4>
                  <p className="text-gray-300 mb-4">
                    Use our JavaScript SDK for easy integration with SmartLend contracts.
                  </p>
                  <div className="flex gap-4">
                    <a 
                      href="https://github.com/smartlend/sdk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      GitHub Repository
                    </a>
                    <a 
                      href="https://docs.smartlend.finance/sdk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-slate-600 text-gray-300 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      SDK Documentation
                    </a>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Supported Networks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold">T</span>
                      </div>
                      <h5 className="font-semibold text-white">Testnet</h5>
                      <p className="text-gray-400 text-sm">Development & Testing</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold">M</span>
                      </div>
                      <h5 className="font-semibold text-white">Mainnet</h5>
                      <p className="text-gray-400 text-sm">Production Ready</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold">E</span>
                      </div>
                      <h5 className="font-semibold text-white">Emulator</h5>
                      <p className="text-gray-400 text-sm">Local Development</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Security & Audits</h3>
                <p className="text-gray-300 mb-6">
                  SmartLend prioritizes security through comprehensive audits, formal verification, 
                  and industry best practices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-green-400" />
                    <h4 className="text-xl font-semibold text-white">Smart Contract Audits</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Comprehensive code review by leading auditors</li>
                    <li>• Formal verification of critical functions</li>
                    <li>• Regular security assessments</li>
                    <li>• Bug bounty program</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-8 h-8 text-blue-400" />
                    <h4 className="text-xl font-semibold text-white">Risk Management</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Dynamic collateral requirements</li>
                    <li>• Automated liquidation protection</li>
                    <li>• Real-time risk monitoring</li>
                    <li>• Emergency pause mechanisms</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                    <h4 className="text-xl font-semibold text-white">AI Model Security</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Bias detection and mitigation</li>
                    <li>• Adversarial attack protection</li>
                    <li>• Model explainability</li>
                    <li>• Continuous model validation</li>
                  </ul>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-8 h-8 text-orange-400" />
                    <h4 className="text-xl font-semibold text-white">Compliance</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• KYC/AML integration</li>
                    <li>• Privacy-preserving verification</li>
                    <li>• Regulatory compliance</li>
                    <li>• Transparent reporting</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-6 border border-red-500/20">
                <h4 className="text-lg font-semibold text-white mb-3">⚠️ Security Notice</h4>
                <p className="text-gray-300 text-sm">
                  SmartLend is currently in beta. While we&apos;ve implemented comprehensive security measures, 
                  users should only invest what they can afford to lose. Always verify contract addresses 
                  and be cautious of phishing attempts.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/50 p-6 bg-slate-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Need help?</span>
              <a href="mailto:support@smartlend.finance" className="text-blue-400 hover:text-blue-300 transition-colors">
                support@smartlend.finance
              </a>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://github.com/smartlend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://discord.gg/smartlend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Discord
              </a>
              <a 
                href="https://twitter.com/smartlend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
