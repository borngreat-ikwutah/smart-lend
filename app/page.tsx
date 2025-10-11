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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Play,
  Shield,
  Zap,
  TrendingUp,
  Star,
  ChevronRight
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#000000',
            color: '#fff',
            border: '1px solid #1f2937'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <div className="text-center">
            <Badge variant="outline" className="mb-8 bg-blue-500/10 border-blue-500/20 text-blue-400">
              <Star className="w-4 h-4 mr-2" />
              Powered by Flow Blockchain
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">Onchain Credit Risk,</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quantified.
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Credit Scoring, Credit Reporting and Monitoring informed by realtime onchain analytics.
            </p>
            
            {!user?.loggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Play className="w-5 h-5 mr-3" />
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowDocumentation(true)}
                  className="border-gray-600 hover:border-gray-400"
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  View Documentation
                </Button>
              </div>
            ) : (
              <div className="text-center mb-16">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Wallet Connected - Welcome to SmartLend!
                </Badge>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-gray-500 mb-8 text-sm">Trusted By Industry Leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-white font-semibold">Flow Protocol</div>
                <div className="text-white font-semibold">Blocto</div>
                <div className="text-white font-semibold">Lilico</div>
                <div className="text-white font-semibold">FCL</div>
                <div className="text-white font-semibold">Cadence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {user?.loggedIn ? (
          <MobileOptimizedDashboard user={user} />
        ) : (
          /* Features Section for Non-Connected Users */
          <div className="space-y-20">
            {/* Features Grid */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                One-stop for on-chain credit analytics
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive AI-powered credit scoring and lending infrastructure. 
                Use our advanced analytics to access better rates and reduced collateral requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* AI Trust Scoring */}
              <Card 
                className="group bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-blue-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setSelectedFeature("ai-trust")}
              >
                <CardHeader>
                  <div className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">AI Trust Scoring</CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    Advanced machine learning models analyze your onchain behavior to provide 
                    transparent, real-time credit scores from 0-100.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-blue-400 hover:text-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature("ai-trust");
                    }}
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Onchain Verification */}
              <Card 
                className="group bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-green-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setSelectedFeature("verification")}
              >
                <CardHeader>
                  <div className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">Onchain Verification</CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    Link your wallet to verified external accounts for enhanced trust scores 
                    and access to premium lending features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-green-400 hover:text-green-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature("verification");
                    }}
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Smart Lending */}
              <Card 
                className="group bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setSelectedFeature("smart-lending")}
              >
                <CardHeader>
                  <div className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">Smart Lending</CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    Borrow with reduced collateral requirements based on your trust score. 
                    Higher scores unlock better rates and lower collateral needs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-purple-400 hover:text-purple-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature("smart-lending");
                    }}
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-gray-800">
              <CardContent className="p-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">200M+</div>
                    <div className="text-gray-400">Scorable addresses</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">8</div>
                    <div className="text-gray-400">Blockchains</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">30+</div>
                    <div className="text-gray-400">Lending protocols</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">95%+</div>
                    <div className="text-gray-400">Repayment rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="p-12">
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
                <p className="text-gray-400 mb-8 text-lg">
                  Connect your wallet and start building your onchain credit profile today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Connect Wallet
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowDocumentation(true)}
                    className="border-gray-600 hover:border-gray-400"
                  >
                    Read Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <CustomIcon name="logo" size={20} className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">SmartLend</span>
            </div>
            <p className="text-gray-400 mb-6">
              Bringing trust and transparency to digital assets through decentralized credit scoring.
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDocumentation(true)}
                className="hover:text-white"
              >
                Documentation
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white">
                <a href="https://github.com/smartlend" target="_blank" rel="noopener noreferrer">GitHub</a>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white">
                <a href="https://twitter.com/smartlend" target="_blank" rel="noopener noreferrer">Twitter</a>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white">
                <a href="https://discord.gg/smartlend" target="_blank" rel="noopener noreferrer">Discord</a>
              </Button>
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