"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Menu, X } from "lucide-react";
import CustomIcon from "./CustomIcon";
import EnhancedWalletConnect from "./EnhancedWalletConnect";

interface MobileOptimizedNavbarProps {
  showDocumentation: () => void;
}

export default function MobileOptimizedNavbar({ showDocumentation }: MobileOptimizedNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <nav className="relative z-50 border-b border-white/10 backdrop-blur-md bg-slate-900/95 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <CustomIcon name="logo" size={32} className="w-8 h-8" />
            <span className="text-xl font-bold text-white">SmartLend</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">
              Features
            </a>
            <button 
              onClick={showDocumentation}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Documentation
            </button>
            <a href="#score" className="text-gray-300 hover:text-white transition-colors font-medium">
              Your Score
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {!user?.loggedIn && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get Started
              </button>
            )}
            <EnhancedWalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10">
            <div className="py-4 space-y-4">
              <a 
                href="#features" 
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <button 
                onClick={() => {
                  showDocumentation();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Documentation
              </button>
              <a 
                href="#score" 
                className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Score
              </a>
              
              <div className="px-4 pt-4 border-t border-white/10 space-y-3">
                {!user?.loggedIn && (
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Get Started
                  </button>
                )}
                <EnhancedWalletConnect />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}