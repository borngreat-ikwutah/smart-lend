"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Toaster } from "react-hot-toast";
import CustomIcon from "@/components/CustomIcon";
import MobileOptimizedParticleBackground from "@/components/MobileOptimizedParticleBackground";
import MobileOptimizedHeroBackground from "@/components/MobileOptimizedHeroBackground";
import MobileOptimizedFeatureModal from "@/components/MobileOptimizedFeatureModal";
import DocumentationModal from "@/components/DocumentationModal";
import MobileOptimizedDashboard from "@/components/MobileOptimizedDashboard";
import MobileOptimizedNavbar from "@/components/MobileOptimizedNavbar";
import VerificationFlow from "@/components/VerificationFlow";
import { 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Play
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<fcl.CurrentUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<"ai-trust" | "verification" | "smart-lending" | null>(null);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showVerificationFlow, setShowVerificationFlow] = useState(false);

  useEffect(() => {
    // Subscribe to FCL user state
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    setIsLoaded(true);
    
    return () => unsubscribe();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          },
        }}
      />
      
      {/* Mobile-Optimized Hero Background */}
      <MobileOptimizedHeroBackground />
      <MobileOptimizedParticleBackground />
      
      {/* Mobile-Optimized Navigation */}
      <MobileOptimizedNavbar showDocumentation={() => setShowDocumentation(true)} />

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-16 sm:pt-20 pb-16 sm:pb-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              <span className="block">Onchain Credit Risk,</span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quantified.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Credit Scoring, Credit Reporting and Monitoring informed by realtime onchain analytics.
            </p>
            
            {!user?.loggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
                <button className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-2xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-105 active:scale-95">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="hidden sm:inline">SIGN UP AND START BUILDING</span>
                  <span className="sm:hidden">START BUILDING</span>
                </button>
                
                <button 
                  onClick={() => setShowDocumentation(true)}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white border-2 border-white/20 rounded-xl hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm active:scale-95"
                >
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="hidden sm:inline">View Documentation</span>
                  <span className="sm:hidden">Documentation</span>
                </button>
              </div>
            ) : (
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Wallet Connected - Welcome to SmartLend!
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Trusted By Industry Leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-60">
                <div className="text-white font-semibold text-sm sm:text-base">Flow Protocol</div>
                <div className="text-white font-semibold text-sm sm:text-base">Blocto</div>
                <div className="text-white font-semibold text-sm sm:text-base">Lilico</div>
                <div className="text-white font-semibold text-sm sm:text-base">FCL</div>
                <div className="text-white font-semibold text-sm sm:text-base">Cadence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16">
        {user?.loggedIn ? (
          <MobileOptimizedDashboard user={user} />
        ) : (
          /* Features Section for Non-Connected Users */
          <div className="space-y-16 sm:space-y-20">
            {/* Features Grid */}
            <div className="text-center mb-12 sm:mb-16 px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                One-stop for on-chain credit analytics
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive AI-powered credit scoring and lending infrastructure. 
                Use our advanced analytics to access better rates and reduced collateral requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* AI Trust Scoring */}
              <div 
                onClick={() => setSelectedFeature("ai-trust")}
                className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CustomIcon name="ai-trust" size={48} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">AI Trust Scoring</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Advanced machine learning models analyze your onchain behavior to provide 
                  transparent, real-time credit scores from 0-100.
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFeature("ai-trust");
                  }}
                  className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Onchain Verification */}
              <div 
                onClick={() => setSelectedFeature("verification")}
                className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-green-500/50 hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CustomIcon name="verification" size={48} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Onchain Verification</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Link your wallet to verified external accounts for enhanced trust scores 
                  and access to premium lending features.
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFeature("verification");
                  }}
                  className="flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors cursor-pointer"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Smart Lending */}
              <div 
                onClick={() => setSelectedFeature("smart-lending")}
                className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CustomIcon name="smart-lending" size={48} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Smart Lending</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Borrow with reduced collateral requirements based on your trust score. 
                  Higher scores unlock better rates and lower collateral needs.
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFeature("smart-lending");
                  }}
                  className="flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 border border-slate-700/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">200M+</div>
                  <div className="text-gray-300 text-xs sm:text-sm md:text-base">Scorable addresses</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">8</div>
                  <div className="text-gray-300 text-xs sm:text-sm md:text-base">Blockchains</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">30+</div>
                  <div className="text-gray-300 text-xs sm:text-sm md:text-base">Lending protocols</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">95%+</div>
                  <div className="text-gray-300 text-xs sm:text-sm md:text-base">Repayment rate</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/30 mt-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <CustomIcon name="logo" size={32} className="w-8 h-8" />
              <span className="text-xl font-bold text-white">SmartLend</span>
            </div>
            <p className="text-gray-400 mb-6">
              Bringing trust and transparency to digital assets through decentralized credit scoring.
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
              <button 
                onClick={() => setShowDocumentation(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Documentation
              </button>
              <a href="https://github.com/smartlend" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="https://twitter.com/smartlend" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
              <a href="https://discord.gg/smartlend" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile-Optimized Feature Modal */}
      <MobileOptimizedFeatureModal 
        isOpen={selectedFeature !== null}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
        onStartVerification={() => setShowVerificationFlow(true)}
      />

      {/* Documentation Modal */}
      <DocumentationModal 
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />

      {/* Verification Flow Modal */}
      <VerificationFlow 
        isOpen={showVerificationFlow}
        onClose={() => setShowVerificationFlow(false)}
        user={user}
      />
    </div>
  );
}
