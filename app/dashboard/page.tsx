"use client";

import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import MobileNavbar from "@/components/layout/mobile-navbar";
import HeroBackground from "@/components/layout/hero-background";
import MobileDashboard from "@/components/dashboard/mobile-dashboard";
import DocumentationModal from "@/components/common/documentation-modal";
import NoSSR from "@/components/common/no-ssr";

export default function DashboardPage() {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to FCL user state
  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NoSSR>
      <div className="min-h-screen relative">
        {/* Background */}
        <HeroBackground />

        {/* Main Content */}
        <div className="relative z-10">
          {/* Navigation */}
          <MobileNavbar showDocumentation={() => setShowDocumentation(true)} />

          {/* Main Dashboard */}
          <main>
            {isLoading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <MobileDashboard user={user} />
            )}
          </main>
        </div>

        {/* Documentation Modal */}
        {showDocumentation && (
          <DocumentationModal onClose={() => setShowDocumentation(false)} />
        )}
      </div>
    </NoSSR>
  );
}
