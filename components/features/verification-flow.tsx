"use client";

import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import {
  CheckCircle,
  X,
  Shield,
  AlertCircle,
  Loader2,
  Globe,
  Mail,
  Phone,
  CreditCard,
  Building,
  ArrowRight,
  Info,
  Star,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerificationFlowProps {
  onClose: () => void;
  user?: fcl.CurrentUser | null;
}

interface VerificationMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  boost: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  isAvailable: boolean;
  requirements: string[];
  isCompleted: boolean;
}

const verificationMethods: VerificationMethod[] = [
  {
    id: "email",
    name: "Email Verification",
    description: "Verify your email address for basic trust boost",
    icon: <Mail className="w-6 h-6 text-blue-400" />,
    boost: 10,
    difficulty: "Easy",
    estimatedTime: "2 minutes",
    isAvailable: true,
    requirements: ["Valid email address", "Access to email inbox"],
    isCompleted: false
  },
  {
    id: "phone",
    name: "Phone Verification",
    description: "Verify your phone number via SMS",
    icon: <Phone className="w-6 h-6 text-green-400" />,
    boost: 15,
    difficulty: "Easy",
    estimatedTime: "3 minutes",
    isAvailable: true,
    requirements: ["Valid phone number", "SMS access"],
    isCompleted: false
  },
  {
    id: "social",
    name: "Social Media Verification",
    description: "Connect and verify your social media accounts",
    icon: <Globe className="w-6 h-6 text-purple-400" />,
    boost: 20,
    difficulty: "Medium",
    estimatedTime: "5 minutes",
    isAvailable: true,
    requirements: ["Active social media accounts", "Public profile"],
    isCompleted: false
  },
  {
    id: "credit",
    name: "Credit History Check",
    description: "Link your traditional credit history (optional)",
    icon: <CreditCard className="w-6 h-6 text-yellow-400" />,
    boost: 30,
    difficulty: "Hard",
    estimatedTime: "10 minutes",
    isAvailable: false,
    requirements: ["Credit bureau authorization", "Identity documents"],
    isCompleted: false
  },
  {
    id: "business",
    name: "Business Verification",
    description: "Verify your business entity and credentials",
    icon: <Building className="w-6 h-6 text-indigo-400" />,
    boost: 25,
    difficulty: "Hard",
    estimatedTime: "15 minutes",
    isAvailable: false,
    requirements: ["Business registration", "Tax ID", "Business documents"],
    isCompleted: false
  }
];

export default function VerificationFlow({ onClose, user }: VerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState<"overview" | "method" | "process" | "complete">("overview");
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [methods, setMethods] = useState(verificationMethods);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationData, setVerificationData] = useState<Record<string, string>>({});
  const [totalScore, setTotalScore] = useState(0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-400 bg-green-500/20";
      case "Medium": return "text-yellow-400 bg-yellow-500/20";
      case "Hard": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const calculateTotalScore = () => {
    const completed = methods.filter(m => m.isCompleted);
    return completed.reduce((sum, method) => sum + method.boost, 0);
  };

  useEffect(() => {
    setTotalScore(calculateTotalScore());
  }, [methods]);

  const handleMethodSelect = (method: VerificationMethod) => {
    if (!method.isAvailable) {
      toast.error("This verification method is not available yet");
      return;
    }
    setSelectedMethod(method);
    setCurrentStep("method");
  };

  const handleStartVerification = () => {
    if (!selectedMethod) return;
    setCurrentStep("process");
  };

  const handleVerificationComplete = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update method as completed
      setMethods(prev => prev.map(m =>
        m.id === selectedMethod.id
          ? { ...m, isCompleted: true }
          : m
      ));

      setCurrentStep("complete");
      toast.success(`${selectedMethod.name} completed successfully!`);

    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const OverviewStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-400/20">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Build Your Trust Score</h3>
          <p className="text-gray-400">
            Complete verification steps to increase your trust score and unlock better lending terms
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
          <Star className="w-6 h-6 text-yellow-400" />
          <div className="text-left">
            <p className="text-sm text-gray-400">Current Trust Score</p>
            <p className="text-2xl font-bold text-white">{totalScore} / 100</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-white">Available Verification Methods</h4>
        <div className="grid gap-3">
          {methods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all duration-200 border-gray-600/30 backdrop-blur-sm ${
                method.isAvailable
                  ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/30 hover:from-gray-800/60 hover:to-gray-700/40'
                  : 'bg-gray-900/20 opacity-50'
              } ${method.isCompleted ? 'ring-2 ring-green-400/30' : ''}`}
              onClick={() => handleMethodSelect(method)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {method.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-white truncate">{method.name}</h5>
                      {method.isCompleted && (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{method.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-xs ${getDifficultyColor(method.difficulty)}`}>
                        {method.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/30">
                        +{method.boost} points
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {method.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const MethodStep = () => (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => setCurrentStep("overview")}
        className="text-gray-400 hover:text-white p-0"
      >
        ← Back to overview
      </Button>

      {selectedMethod && (
        <>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-400/20">
              {selectedMethod.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedMethod.name}</h3>
              <p className="text-gray-400">{selectedMethod.description}</p>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Requirements & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Trust Boost</p>
                  <p className="text-lg font-bold text-green-400">+{selectedMethod.boost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Difficulty</p>
                  <Badge className={`${getDifficultyColor(selectedMethod.difficulty)}`}>
                    {selectedMethod.difficulty}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Time Required</p>
                  <p className="text-sm font-medium text-white">{selectedMethod.estimatedTime}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {selectedMethod.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleStartVerification}
            className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm"
          >
            Start Verification
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )}
    </div>
  );

  const ProcessStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-400/20">
          {selectedMethod?.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Verify {selectedMethod?.name}</h3>
          <p className="text-gray-400">Please complete the verification process below</p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-600/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          {selectedMethod?.id === "email" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={verificationData.email || ""}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600/30 text-white mt-1"
                />
              </div>
            </div>
          )}

          {selectedMethod?.id === "phone" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={verificationData.phone || ""}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600/30 text-white mt-1"
                />
              </div>
            </div>
          )}

          {selectedMethod?.id === "social" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="twitter" className="text-white">Twitter/X Username</Label>
                <Input
                  id="twitter"
                  type="text"
                  placeholder="@username"
                  value={verificationData.twitter || ""}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, twitter: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600/30 text-white mt-1"
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleVerificationComplete}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90 text-white border border-green-400/30 backdrop-blur-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Verification
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const CompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-green-400/20">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Verification Complete!</h3>
          <p className="text-gray-400">
            Your {selectedMethod?.name} has been successfully verified
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">Trust Score Increased</p>
              <p className="text-2xl font-bold text-white">+{selectedMethod?.boost} points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={() => setCurrentStep("overview")}
          className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-blue-400/30 backdrop-blur-sm"
        >
          Continue Verification
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-gray-600/30 hover:border-gray-400/50 bg-gray-900/30 hover:bg-gray-800/40 text-gray-300 hover:text-white backdrop-blur-sm"
        >
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14] border-gray-600/30 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Trust Score Verification
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {currentStep === "overview" && <OverviewStep />}
          {currentStep === "method" && <MethodStep />}
          {currentStep === "process" && <ProcessStep />}
          {currentStep === "complete" && <CompleteStep />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
