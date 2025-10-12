"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  DollarSign,
  Droplets,
  PieChart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Shield,
  TrendingUp,
  Activity
} from "lucide-react";
import CustomIcon from "@/components/CustomIcon";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics"
  },
  {
    name: "Lending",
    href: "/lending",
    icon: DollarSign,
    description: "Borrow and repay loans"
  },
  {
    name: "Liquidity",
    href: "/liquidity",
    icon: Droplets,
    description: "Provide liquidity and earn"
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: PieChart,
    description: "Manage your positions"
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Subscribe to FCL user state
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    setIsLoaded(true);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check if user is logged in, redirect if not
    if (isLoaded && !user?.loggedIn) {
      router.push("/");
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await fcl.unauthenticate();
    router.push("/");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user?.loggedIn) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          },
        }}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        md:relative md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <CustomIcon name="logo" size={24} className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">SmartLend</span>
            </Link>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  {user.addr ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}` : 'Loading...'}
                </div>
                <div className="text-sm text-gray-400">Connected Wallet</div>
              </div>
            </div>

            {/* Trust Score Badge */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Trust Score:</span>
              <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/10">
                75
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group
                      ${isActive
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                    <div className="flex-1">
                      <div className={`font-medium ${isActive ? 'text-blue-400' : 'text-white'}`}>
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white"
                onClick={() => router.push("/settings")}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isMobile ? 'ml-0' : 'md:ml-72'}`}>
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">SmartLend</span>
                <span className="text-gray-500">/</span>
                <span className="text-white capitalize">
                  {pathname?.split('/')[1] || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hidden sm:flex"
              >
                <Search className="w-4 h-4" />
                <span className="ml-2 hidden lg:inline">Search</span>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">APY:</span>
                  <span className="text-sm font-semibold text-green-400">12.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">TVL:</span>
                  <span className="text-sm font-semibold text-blue-400">$2.4M</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
