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
  Info
} from "lucide-react";
import CustomIcon from "./CustomIcon";
import toast from "react-hot-toast";

interface VerificationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  user: fcl.CurrentUser | null;
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
    requirements: ["Valid email address", "Access to email inbox"]
  },
  {
    id: "phone",
    name: "Phone Verification",
    description: "Verify your phone number for enhanced trust",
    icon: <Phone className="w-6 h-6 text-green-400" />,
    boost: 15,
    difficulty: "Easy",
    estimatedTime: "3 minutes",
    isAvailable: true,
    requirements: ["Valid phone number", "SMS access"]
  },
  {
    id: "identity",
    name: "Government ID",
    description: "Verify with government-issued ID for maximum trust",
    icon: <CreditCard className="w-6 h-6 text-purple-400" />,
    boost: 25,
    difficulty: "Medium",
    estimatedTime: "10 minutes",
    isAvailable: true,
    requirements: ["Government-issued ID", "Clear photo of ID", "Selfie for verification"]
  },
  {
    id: "social",
    name: "Social Media",
    description: "Connect verified social media accounts",
    icon: <Globe className="w-6 h-6 text-pink-400" />,
    boost: 20,
    difficulty: "Easy",
    estimatedTime: "5 minutes",
    isAvailable: true,
    requirements: ["Active social media account", "Public profile", "Minimum 100 followers"]
  },
  {
    id: "employment",
    name: "Employment Verification",
    description: "Verify employment status for professional trust",
    icon: <Building className="w-6 h-6 text-orange-400" />,
    boost: 30,
    difficulty: "Hard",
    estimatedTime: "2-3 days",
    isAvailable: false,
    requirements: ["Employment contract", "Pay stub", "HR verification"]
  },
  {
    id: "financial",
    name: "Financial Institution",
    description: "Connect verified bank or financial account",
    icon: <CreditCard className="w-6 h-6 text-cyan-400" />,
    boost: 35,
    difficulty: "Hard",
    estimatedTime: "1-2 days",
    isAvailable: false,
    requirements: ["Bank account", "Financial statements", "Institution verification"]
  }
];

export default function VerificationFlow({ isOpen, onClose, user }: VerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState<'select' | 'verify' | 'processing' | 'success' | 'error'>('select');
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [verificationData, setVerificationData] = useState<Record<string, string>>({});
  const [currentAttestations, setCurrentAttestations] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && user?.loggedIn) {
      // Fetch current attestations for the user
      fetchCurrentAttestations();
    }
  }, [isOpen, user]);

  const fetchCurrentAttestations = async () => {
    try {
      // In a real implementation, this would query the FlowAttestation contract
      // For now, we'll use mock data
      setCurrentAttestations(['email', 'phone']); // Mock: user has email and phone verified
    } catch (error) {
      console.error('Failed to fetch attestations:', error);
    }
  };

  const handleMethodSelect = (method: VerificationMethod) => {
    if (!method.isAvailable) {
      toast.error(`${method.name} is not yet available. Coming soon!`);
      return;
    }
    
    if (currentAttestations.includes(method.id)) {
      toast.error(`You already have ${method.name} verification`);
      return;
    }

    setSelectedMethod(method);
    setCurrentStep('verify');
  };

  const handleVerificationSubmit = async () => {
    if (!selectedMethod || !user?.loggedIn) return;

    setCurrentStep('processing');

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, this would:
      // 1. Validate the provided data
      // 2. Call external verification services
      // 3. Create an attestation on Flow blockchain
      // 4. Update user's trust score

      // Mock successful verification
      setCurrentStep('success');
      toast.success(`${selectedMethod.name} verification completed successfully!`);
      
      // Update current attestations
      setCurrentAttestations(prev => [...prev, selectedMethod.id]);
      
    } catch (error) {
      console.error('Verification failed:', error);
      setCurrentStep('error');
      toast.error('Verification failed. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getBoostColor = (boost: number) => {
    if (boost >= 30) return 'text-green-400';
    if (boost >= 20) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const renderSelectStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Identity</h2>
        <p className="text-gray-300">Choose a verification method to boost your trust score and unlock better lending terms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verificationMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method)}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              method.isAvailable && !currentAttestations.includes(method.id)
                ? 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/70'
                : 'bg-slate-800/30 border-slate-700/30 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-start gap-3">
              {method.icon}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{method.name}</h3>
                  {currentAttestations.includes(method.id) && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  {!method.isAvailable && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">{method.description}</p>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(method.difficulty)}`}>
                    {method.difficulty}
                  </span>
                  <span className={`font-medium ${getBoostColor(method.boost)}`}>
                    +{method.boost} points
                  </span>
                  <span className="text-gray-500">{method.estimatedTime}</span>
                </div>

                {method.requirements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Requirements:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {method.requirements.slice(0, 2).map((req, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {req}
                        </li>
                      ))}
                      {method.requirements.length > 2 && (
                        <li className="text-gray-500">+{method.requirements.length - 2} more...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">Why Verify?</h4>
            <p className="text-sm text-blue-300">
              Verified users get better interest rates, higher borrowing limits, and reduced collateral requirements. 
              Your verification data is encrypted and stored securely on the Flow blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerifyStep = () => {
    if (!selectedMethod) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            {selectedMethod.icon}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify {selectedMethod.name}</h2>
          <p className="text-gray-300">Complete the verification process to boost your trust score by +{selectedMethod.boost} points.</p>
        </div>

        <div className="space-y-4">
          {selectedMethod.id === 'email' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={verificationData.email || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={verificationData.fullName || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </>
          )}

          {selectedMethod.id === 'phone' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={verificationData.phone || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <select
                  value={verificationData.country || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="SG">Singapore</option>
                </select>
              </div>
            </>
          )}

          {selectedMethod.id === 'identity' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID Type</label>
                <select
                  value={verificationData.idType || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, idType: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select ID type</option>
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver&apos;s License</option>
                  <option value="national_id">National ID</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID Number</label>
                <input
                  type="text"
                  value={verificationData.idNumber || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, idNumber: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter ID number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name (as on ID)</label>
                <input
                  type="text"
                  value={verificationData.idName || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, idName: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter full name as shown on ID"
                />
              </div>
            </>
          )}

          {selectedMethod.id === 'social' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                <select
                  value={verificationData.platform || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select platform</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username/Handle</label>
                <input
                  type="text"
                  value={verificationData.username || ''}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  placeholder="@username or handle"
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">Privacy Notice</h4>
              <p className="text-sm text-yellow-300">
                Your verification data is encrypted and stored securely on the Flow blockchain. 
                We never store sensitive information on our servers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentStep('select')}
            className="flex-1 py-3 px-4 border border-slate-700 text-gray-300 rounded-lg hover:border-slate-600 hover:text-white transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleVerificationSubmit}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Start Verification
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Verifying Your {selectedMethod?.name}</h2>
        <p className="text-gray-300">This may take a few moments. Please don&apos;t close this window.</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Validating information...
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          Creating blockchain attestation...
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          Updating trust score...
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Verification Successful!</h2>
        <p className="text-gray-300">
          Your {selectedMethod?.name} has been verified and your trust score has been increased by +{selectedMethod?.boost} points.
        </p>
      </div>
      
      <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <h4 className="font-semibold text-green-400">Attestation Created</h4>
            <p className="text-sm text-green-300">
              Your verification has been recorded on the Flow blockchain as an immutable attestation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep('select')}
          className="flex-1 py-3 px-4 border border-slate-700 text-gray-300 rounded-lg hover:border-slate-600 hover:text-white transition-colors"
        >
          Verify Another Method
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );

  const renderErrorStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
        <X className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
        <p className="text-gray-300">
          We couldn&apos;t verify your {selectedMethod?.name}. Please check your information and try again.
        </p>
      </div>
      
      <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-400 mb-1">What went wrong?</h4>
            <p className="text-sm text-red-300">
              Common issues include incorrect information, network problems, or temporary service unavailability.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep('verify')}
          className="flex-1 py-3 px-4 border border-slate-700 text-gray-300 rounded-lg hover:border-slate-600 hover:text-white transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => setCurrentStep('select')}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200"
        >
          Choose Different Method
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700/50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CustomIcon name="verification" size={32} />
              <div>
                <h1 className="text-xl font-bold text-white">Identity Verification</h1>
                <p className="text-sm text-gray-400">
                  {user?.addr ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}` : 'Connect wallet first'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'select' && renderSelectStep()}
          {currentStep === 'verify' && renderVerifyStep()}
          {currentStep === 'processing' && renderProcessingStep()}
          {currentStep === 'success' && renderSuccessStep()}
          {currentStep === 'error' && renderErrorStep()}
        </div>
      </div>
    </div>
  );
}
