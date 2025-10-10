"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { 
  Wallet, 
  LogOut, 
  User, 
  TrendingUp, 
  Shield, 
  Settings,
  ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";
import CustomIcon from "./CustomIcon";

interface EnhancedWalletConnectProps {
  className?: string;
}

export default function EnhancedWalletConnect({ className = "" }: EnhancedWalletConnectProps) {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Subscribe to FCL user state
  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await fcl.authenticate();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await fcl.unauthenticate();
      toast.success("Wallet disconnected successfully!");
    } catch (error) {
      console.error("Wallet disconnection failed:", error);
      toast.error("Failed to disconnect wallet. Please try again.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get wallet provider name
  const getProviderName = () => {
    return "Flow Wallet";
  };

  if (!user?.loggedIn) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isConnecting ? (
            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Wallet className="w-5 h-5 mr-2" />
          )}
          Connect Wallet
        </button>
        
        {/* Wallet Support Info */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
          <span>Supports:</span>
          <div className="flex gap-1">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Blocto</span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">Lilico</span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">Flow</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Quick Stats */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Score: --</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <CustomIcon name="verification" size={16} />
            <span className="text-sm font-medium text-blue-400">Unverified</span>
          </div>
        </div>

        {/* User Info */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800/70 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium text-white">
              {formatAddress(user?.addr || "")}
            </div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Connected
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{formatAddress(user?.addr || "")}</div>
                  <div className="text-xs text-gray-400">{getProviderName()}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Trust Score</div>
                  <div className="text-lg font-bold text-yellow-400">--</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Status</div>
                  <div className="text-lg font-bold text-blue-400">Unverified</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Account Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Verify Identity</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">View Analytics</span>
              </button>
            </div>

            {/* Disconnect */}
            <div className="p-4 border-t border-slate-700/50">
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDisconnecting ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
