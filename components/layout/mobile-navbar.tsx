"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Menu, ChevronDown, Zap, BookOpen, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EnhancedWalletConnect from "@/components/common/enhanced-wallet-connect";

interface MobileNavbarProps {
  showDocumentation: () => void;
}

export default function MobileNavbar({ showDocumentation }: MobileNavbarProps) {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <nav className="z-50 border-b border-gray-600/20 backdrop-blur-md bg-gradient-to-r from-[#0A0C14]/90 via-[#1A1F2C]/90 to-[#0A0C14]/90 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/80 to-purple-500/80 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-400/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              SmartLend
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              onClick={showDocumentation}
              className="text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </Button>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Your Score
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Products
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900/95 border-gray-600/30 backdrop-blur-sm">
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                  AI Trust Scoring
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                  Onchain Verification
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                  Smart Lending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {!user?.loggedIn && (
              <Button className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm transition-all duration-200">
                Get Started
              </Button>
            )}
            <EnhancedWalletConnect />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-gray-700/30"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gradient-to-b from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14] border-gray-600/30 backdrop-blur-sm"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/80 to-purple-500/80 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-400/20">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      SmartLend
                    </span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/30"
                    >
                      Features
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={showDocumentation}
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/30"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/30"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Your Score
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/30"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Products
                    </Button>

                    <div className="pt-4 border-t border-gray-600/30 space-y-3">
                      {!user?.loggedIn && (
                        <Button className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm">
                          Get Started
                        </Button>
                      )}
                      <div className="w-full">
                        <EnhancedWalletConnect className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
