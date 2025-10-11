"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Menu, ChevronDown } from "lucide-react";
import CustomIcon from "./CustomIcon";
import EnhancedWalletConnect from "./EnhancedWalletConnect";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MobileOptimizedNavbarProps {
  showDocumentation: () => void;
}

export default function MobileOptimizedNavbar({ showDocumentation }: MobileOptimizedNavbarProps) {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <nav className="z-50 border-b border-gray-800 backdrop-blur-md bg-black/95 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <CustomIcon name="logo" size={20} className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">SmartLend</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Features
            </Button>
            <Button 
              variant="ghost" 
              onClick={showDocumentation}
              className="text-gray-300 hover:text-white"
            >
              Documentation
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Your Score
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Products
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>AI Trust Scoring</DropdownMenuItem>
                <DropdownMenuItem>Onchain Verification</DropdownMenuItem>
                <DropdownMenuItem>Smart Lending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {!user?.loggedIn && (
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Get Started
              </Button>
            )}
            <EnhancedWalletConnect />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-gray-800">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <CustomIcon name="logo" size={20} className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white">SmartLend</span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Features
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={showDocumentation}
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      Documentation
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Your Score
                    </Button>
                    
                    <div className="pt-4 border-t border-gray-800 space-y-3">
                      {!user?.loggedIn && (
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                          Get Started
                        </Button>
                      )}
                      <EnhancedWalletConnect />
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