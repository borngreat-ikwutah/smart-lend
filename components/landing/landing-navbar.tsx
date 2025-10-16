"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Zap,
  ChevronDown,
  ExternalLink,
  Github,
  Twitter,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Security", href: "#security" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-[#0A0C14]/95 via-[#1A1F2C]/95 to-[#0A0C14]/95 backdrop-blur-lg border-b border-gray-600/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/80 to-purple-500/80 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-400/20 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                SmartLend
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}

              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200"
                  >
                    Resources
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/95 border-gray-600/30 backdrop-blur-sm">
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Launch App Button - Desktop */}
            <div className="hidden lg:block">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm font-medium px-6 py-2 transition-all duration-200 hover:scale-105">
                  Launch App
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
                  className="bg-gradient-to-b from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14] border-gray-600/30 backdrop-blur-sm w-80"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/80 to-purple-500/80 rounded-lg flex items-center justify-center backdrop-blur-sm border border-blue-400/20">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                          SmartLend
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 space-y-4">
                      {navItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-lg transition-all duration-200"
                        >
                          {item.name}
                        </a>
                      ))}

                      {/* Mobile Resources */}
                      <div className="border-t border-gray-700/50 pt-4 space-y-2">
                        <p className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                          Resources
                        </p>
                        <a
                          href="#"
                          className="flex items-center py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-lg transition-all duration-200"
                        >
                          <BookOpen className="w-4 h-4 mr-3" />
                          Documentation
                        </a>
                        <a
                          href="#"
                          className="flex items-center py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-lg transition-all duration-200"
                        >
                          <Github className="w-4 h-4 mr-3" />
                          GitHub
                        </a>
                        <a
                          href="#"
                          className="flex items-center py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-lg transition-all duration-200"
                        >
                          <Twitter className="w-4 h-4 mr-3" />
                          Twitter
                        </a>
                      </div>
                    </div>

                    {/* Mobile Launch App Button */}
                    <div className="pt-6 border-t border-gray-700/50">
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm font-medium py-3">
                          Launch App
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
