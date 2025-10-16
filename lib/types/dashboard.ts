export interface User {
  address: string | null;
  isConnected: boolean;
  isVerified: boolean;
  trustScore: number;
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt?: Date;
}

export interface LoanPosition {
  id: string;
  amount: number;
  collateral: number;
  collateralToken: string;
  borrowToken: string;
  interestRate: number;
  healthFactor: number;
  liquidationPrice: number;
  createdAt: Date;
  dueDate: Date;
  status: 'active' | 'repaid' | 'liquidated' | 'defaulted';
}

export interface LiquidityPosition {
  id: string;
  poolId: string;
  token0: string;
  token1: string;
  amount0: number;
  amount1: number;
  lpTokens: number;
  apy: number;
  rewards: number;
  impermanentLoss: number;
  createdAt: Date;
  status: 'active' | 'withdrawn';
}

export interface Transaction {
  id: string;
  type: 'borrow' | 'repay' | 'deposit' | 'withdraw' | 'liquidation' | 'reward_claim';
  amount: number;
  token: string;
  hash: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
}

export interface Portfolio {
  totalBorrowed: number;
  totalLent: number;
  totalCollateral: number;
  availableCollateral: number;
  totalRewards: number;
  netWorth: number;
  healthFactor: number;
  utilizationRatio: number;
}

export interface ProtocolStats {
  totalValueLocked: number;
  totalBorrowed: number;
  totalLiquidity: number;
  activeUsers: number;
  averageApy: number;
  protocolRevenue: number;
}

export interface TokenBalance {
  token: string;
  symbol: string;
  balance: number;
  usdValue: number;
  decimals: number;
}

export interface LendingPool {
  id: string;
  token: string;
  totalSupply: number;
  totalBorrowed: number;
  supplyApy: number;
  borrowApy: number;
  utilizationRate: number;
  collateralFactor: number;
  liquidationThreshold: number;
  reserveFactor: number;
}

export interface YieldFarmingPool {
  id: string;
  name: string;
  token0: string;
  token1: string;
  apy: number;
  tvl: number;
  rewards: string[];
  lockPeriod?: number;
  multiplier: number;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface VerificationStatus {
  isVerified: boolean;
  level: number;
  documents: {
    id: boolean;
    proof_of_address: boolean;
    financial_statement: boolean;
  };
  pendingReview: boolean;
  rejectionReason?: string;
}

export interface TrustScoreHistory {
  date: Date;
  score: number;
  change: number;
  reason: string;
}

export interface RiskMetrics {
  healthFactor: number;
  liquidationRisk: 'low' | 'medium' | 'high' | 'critical';
  concentrationRisk: number;
  volatilityExposure: number;
  leverageRatio: number;
}

export type DashboardTab = 'overview' | 'lending' | 'liquidity' | 'portfolio' | 'analytics';

export interface DashboardState {
  activeTab: DashboardTab;
  user: User | null;
  portfolio: Portfolio;
  loanPositions: LoanPosition[];
  liquidityPositions: LiquidityPosition[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  isLoading: boolean;
  error: string | null;
}
