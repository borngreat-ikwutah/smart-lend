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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface EnhancedWalletConnectProps {
  className?: string;
}

export default function EnhancedWalletConnect({ className = "" }: EnhancedWalletConnectProps) {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

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

  // Get user initials for avatar
  const getUserInitials = (address: string | undefined) => {
    if (!address) return "U";
    return address.slice(-2).toUpperCase();
  };

  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!user?.loggedIn) {
    return (
      <Button 
        onClick={handleConnect}
        disabled={isConnecting}
        className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white ${className}`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`border-gray-600 hover:border-gray-400 bg-gray-900/50 hover:bg-gray-800/50 ${className}`}
        >
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
              {getUserInitials(user.addr)}
            </AvatarFallback>
          </Avatar>
          <span className="text-white">{formatAddress(user.addr)}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700">
        <div className="px-3 py-2 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {getUserInitials(user.addr)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {formatAddress(user.addr)}
              </p>
              <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/20 text-green-400">
                Connected
              </Badge>
            </div>
          </div>
        </div>
        
        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
          <User className="w-4 h-4 mr-3" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
          <TrendingUp className="w-4 h-4 mr-3" />
          Trust Score
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
          <Shield className="w-4 h-4 mr-3" />
          Verification
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}