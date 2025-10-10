import { config } from "@onflow/fcl";

// Flow network configuration
const FLOW_NETWORK = process.env.NEXT_PUBLIC_FLOW_NETWORK || "emulator";
const FLOW_ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "http://localhost:8080";

// Contract addresses (will be updated after deployment)
const CONTRACTS = {
  emulator: {
    FlowAttestation: "0xf8d6e0586b0a20c7",
    LendingPool: "0xf8d6e0586b0a20c7", 
    TrustScore: "0xf8d6e0586b0a20c7",
    TrustScoreOracle: "0xf8d6e0586b0a20c7",
  },
  testnet: {
    FlowAttestation: "0x01",
    LendingPool: "0x02",
    TrustScore: "0x03", 
    TrustScoreOracle: "0x04",
  },
  mainnet: {
    FlowAttestation: "0x01",
    LendingPool: "0x02",
    TrustScore: "0x03",
    TrustScoreOracle: "0x04",
  }
};

// Wallet discovery configuration
const WALLET_DISCOVERY = {
  wallets: [
    {
      name: "Blocto",
      icon: "https://dweb.link/ipfs/bafkreihqj7n7u4g3zqj4x5c7zqj4x5c7zqj4x5c7zqj4x5c7zqj4x5c7zqj4",
      supportsMobile: true,
      website: "https://blocto.portto.io/",
      platforms: ["web", "mobile"],
    },
    {
      name: "Lilico",
      icon: "https://dweb.link/ipfs/bafkreihqj7n7u4g3zqj4x5c7zqj4x5c7zqj4x5c7zqj4x5c7zqj4x5c7zqj5",
      supportsMobile: true,
      website: "https://lilico.app/",
      platforms: ["web", "mobile"],
    },
    {
      name: "Flow Wallet",
      icon: "https://dweb.link/ipfs/bafkreihqj7n7u4g3zqj4x5c7zqj4x5c7zqj4x5c7zqj4x5c7zqj4x5c7zqj6",
      supportsMobile: false,
      website: "https://flow.com/wallet",
      platforms: ["web"],
    }
  ]
};

// Configure FCL
export function configureFCL() {
  config({
    // Flow Access Node
    "accessNode.api": FLOW_ACCESS_NODE,
    
    // Wallet discovery
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
    
    // App details
    "app.detail.title": "SmartLend - AI-Powered Lending",
    "app.detail.icon": "/favicon.ico",
    
    // Network configuration
    "flow.network": FLOW_NETWORK,
    
    // Contract addresses
    "0xFlowAttestation": CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS].FlowAttestation,
    "0xLendingPool": CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS].LendingPool,
    "0xTrustScore": CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS].TrustScore,
    "0xTrustScoreOracle": CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS].TrustScoreOracle,
    
    // Wallet configuration
    "service.OpenID.scopes": "email",
    
    // Transaction configuration
    "fcl.limit": 1000,
    
    // Debug mode for development
    ...(FLOW_NETWORK === "emulator" && {
      "debug": true,
      "logger.level": 2,
    }),
  });
}

// Get contract addresses
export function getContractAddress(contractName: keyof typeof CONTRACTS.emulator): string {
  return CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS][contractName];
}

// Get wallet discovery configuration
export function getWalletDiscovery() {
  return WALLET_DISCOVERY;
}

// Network utilities
export const NETWORK_CONFIG = {
  network: FLOW_NETWORK,
  accessNode: FLOW_ACCESS_NODE,
  contracts: CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS],
  isEmulator: FLOW_NETWORK === "emulator",
  isTestnet: FLOW_NETWORK === "testnet", 
  isMainnet: FLOW_NETWORK === "mainnet",
};

export default config;
