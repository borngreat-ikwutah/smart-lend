import {
  User,
  LoanPosition,
  LiquidityPosition,
  Transaction,
  Portfolio,
  ProtocolStats,
  TokenBalance,
  LendingPool,
  YieldFarmingPool,
  NotificationItem,
  VerificationStatus,
  TrustScoreHistory,
  RiskMetrics
} from '@/lib/types/dashboard';

// Mock user data
export const mockUser: User = {
  address: '0x1234567890abcdef',
  isConnected: true,
  isVerified: false,
  trustScore: 75,
  tier: 'MEDIUM',
  createdAt: new Date('2024-01-15'),
};

// Mock loan positions
export const mockLoanPositions: LoanPosition[] = [
  {
    id: 'loan-1',
    amount: 5000,
    collateral: 7500,
    collateralToken: 'FLOW',
    borrowToken: 'FUSD',
    interestRate: 8.5,
    healthFactor: 1.85,
    liquidationPrice: 0.45,
    createdAt: new Date('2024-01-20'),
    dueDate: new Date('2024-04-20'),
    status: 'active',
  },
  {
    id: 'loan-2',
    amount: 2500,
    collateral: 3000,
    collateralToken: 'USDC',
    borrowToken: 'FUSD',
    interestRate: 6.2,
    healthFactor: 2.1,
    liquidationPrice: 0.95,
    createdAt: new Date('2024-02-01'),
    dueDate: new Date('2024-05-01'),
    status: 'active',
  },
];

// Mock liquidity positions
export const mockLiquidityPositions: LiquidityPosition[] = [
  {
    id: 'lp-1',
    poolId: 'flow-fusd',
    token0: 'FLOW',
    token1: 'FUSD',
    amount0: 1000,
    amount1: 850,
    lpTokens: 925.5,
    apy: 12.8,
    rewards: 45.2,
    impermanentLoss: -2.1,
    createdAt: new Date('2024-01-10'),
    status: 'active',
  },
  {
    id: 'lp-2',
    poolId: 'usdc-fusd',
    token0: 'USDC',
    token1: 'FUSD',
    amount0: 500,
    amount1: 500,
    lpTokens: 500,
    apy: 8.4,
    rewards: 18.7,
    impermanentLoss: 0.5,
    createdAt: new Date('2024-01-25'),
    status: 'active',
  },
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'deposit',
    amount: 1000,
    token: 'FLOW',
    hash: '0xabc123...',
    timestamp: new Date('2024-02-15T10:30:00'),
    status: 'confirmed',
    gasUsed: 0.001,
  },
  {
    id: 'tx-2',
    type: 'borrow',
    amount: 500,
    token: 'FUSD',
    hash: '0xdef456...',
    timestamp: new Date('2024-02-14T14:20:00'),
    status: 'confirmed',
    gasUsed: 0.002,
  },
  {
    id: 'tx-3',
    type: 'reward_claim',
    amount: 25.5,
    token: 'SMART',
    hash: '0xghi789...',
    timestamp: new Date('2024-02-13T09:15:00'),
    status: 'confirmed',
    gasUsed: 0.0015,
  },
  {
    id: 'tx-4',
    type: 'repay',
    amount: 100,
    token: 'FUSD',
    hash: '0xjkl012...',
    timestamp: new Date('2024-02-12T16:45:00'),
    status: 'pending',
  },
];

// Mock portfolio
export const mockPortfolio: Portfolio = {
  totalBorrowed: 7500,
  totalLent: 1500,
  totalCollateral: 10500,
  availableCollateral: 3000,
  totalRewards: 63.9,
  netWorth: 4563.9,
  healthFactor: 1.95,
  utilizationRatio: 0.71,
};

// Mock protocol stats
export const mockProtocolStats: ProtocolStats = {
  totalValueLocked: 125000000,
  totalBorrowed: 65000000,
  totalLiquidity: 95000000,
  activeUsers: 12500,
  averageApy: 9.2,
  protocolRevenue: 2500000,
};

// Mock token balances
export const mockTokenBalances: TokenBalance[] = [
  {
    token: 'FLOW',
    symbol: 'FLOW',
    balance: 2500,
    usdValue: 2125,
    decimals: 8,
  },
  {
    token: 'FUSD',
    symbol: 'FUSD',
    balance: 1200,
    usdValue: 1200,
    decimals: 8,
  },
  {
    token: 'USDC',
    symbol: 'USDC',
    balance: 800,
    usdValue: 800,
    decimals: 6,
  },
  {
    token: 'SMART',
    symbol: 'SMART',
    balance: 150,
    usdValue: 45,
    decimals: 8,
  },
];

// Mock lending pools
export const mockLendingPools: LendingPool[] = [
  {
    id: 'flow-pool',
    token: 'FLOW',
    totalSupply: 25000000,
    totalBorrowed: 15000000,
    supplyApy: 5.8,
    borrowApy: 8.2,
    utilizationRate: 0.6,
    collateralFactor: 0.75,
    liquidationThreshold: 0.8,
    reserveFactor: 0.15,
  },
  {
    id: 'fusd-pool',
    token: 'FUSD',
    totalSupply: 45000000,
    totalBorrowed: 28000000,
    supplyApy: 4.2,
    borrowApy: 6.8,
    utilizationRate: 0.62,
    collateralFactor: 0.8,
    liquidationThreshold: 0.85,
    reserveFactor: 0.1,
  },
  {
    id: 'usdc-pool',
    token: 'USDC',
    totalSupply: 35000000,
    totalBorrowed: 22000000,
    supplyApy: 3.9,
    borrowApy: 6.2,
    utilizationRate: 0.63,
    collateralFactor: 0.85,
    liquidationThreshold: 0.9,
    reserveFactor: 0.1,
  },
];

// Mock yield farming pools
export const mockYieldFarmingPools: YieldFarmingPool[] = [
  {
    id: 'flow-fusd-farm',
    name: 'FLOW-FUSD LP',
    token0: 'FLOW',
    token1: 'FUSD',
    apy: 15.6,
    tvl: 8500000,
    rewards: ['SMART'],
    multiplier: 2.5,
  },
  {
    id: 'usdc-fusd-farm',
    name: 'USDC-FUSD LP',
    token0: 'USDC',
    token1: 'FUSD',
    apy: 12.3,
    tvl: 12000000,
    rewards: ['SMART'],
    multiplier: 2.0,
  },
  {
    id: 'flow-usdc-farm',
    name: 'FLOW-USDC LP',
    token0: 'FLOW',
    token1: 'USDC',
    apy: 18.2,
    tvl: 6200000,
    rewards: ['SMART', 'FLOW'],
    lockPeriod: 30,
    multiplier: 3.0,
  },
];

// Mock notifications
export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'warning',
    title: 'Health Factor Alert',
    message: 'Your loan health factor has dropped below 2.0. Consider adding more collateral.',
    timestamp: new Date('2024-02-15T12:00:00'),
    read: false,
    actionUrl: '/dashboard/lending',
  },
  {
    id: 'notif-2',
    type: 'success',
    title: 'Rewards Available',
    message: 'You have 25.5 SMART tokens ready to claim from liquidity farming.',
    timestamp: new Date('2024-02-14T18:30:00'),
    read: false,
    actionUrl: '/dashboard/liquidity',
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'Trust Score Increased',
    message: 'Your trust score increased by 5 points due to consistent repayment history.',
    timestamp: new Date('2024-02-13T10:15:00'),
    read: true,
  },
  {
    id: 'notif-4',
    type: 'error',
    title: 'Transaction Failed',
    message: 'Your recent transaction failed due to insufficient gas. Please try again.',
    timestamp: new Date('2024-02-12T14:22:00'),
    read: true,
  },
];

// Mock verification status
export const mockVerificationStatus: VerificationStatus = {
  isVerified: false,
  level: 1,
  documents: {
    id: true,
    proof_of_address: false,
    financial_statement: false,
  },
  pendingReview: true,
};

// Mock trust score history
export const mockTrustScoreHistory: TrustScoreHistory[] = [
  { date: new Date('2024-01-15'), score: 60, change: 0, reason: 'Initial score' },
  { date: new Date('2024-01-22'), score: 65, change: 5, reason: 'First loan repaid on time' },
  { date: new Date('2024-01-30'), score: 68, change: 3, reason: 'Liquidity provision started' },
  { date: new Date('2024-02-05'), score: 72, change: 4, reason: 'Consistent activity' },
  { date: new Date('2024-02-12'), score: 75, change: 3, reason: 'Document verification completed' },
];

// Mock risk metrics
export const mockRiskMetrics: RiskMetrics = {
  healthFactor: 1.95,
  liquidationRisk: 'low',
  concentrationRisk: 0.35,
  volatilityExposure: 0.68,
  leverageRatio: 2.4,
};

// Utility functions to generate additional mock data
export const generateMockTransaction = (type: Transaction['type']): Transaction => ({
  id: `tx-${Date.now()}`,
  type,
  amount: Math.random() * 1000 + 100,
  token: ['FLOW', 'FUSD', 'USDC', 'SMART'][Math.floor(Math.random() * 4)],
  hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
  timestamp: new Date(),
  status: Math.random() > 0.1 ? 'confirmed' : 'pending',
  gasUsed: Math.random() * 0.01,
});

export const updateMockUserTrustScore = (currentScore: number, change: number): number => {
  return Math.max(0, Math.min(100, currentScore + change));
};

// Portfolio calculations
export const calculatePortfolioMetrics = (
  loanPositions: LoanPosition[],
  liquidityPositions: LiquidityPosition[],
  tokenBalances: TokenBalance[]
) => {
  const totalBorrowed = loanPositions.reduce((sum, loan) => sum + loan.amount, 0);
  const totalCollateral = loanPositions.reduce((sum, loan) => sum + loan.collateral, 0);
  const totalLiquidity = liquidityPositions.reduce((sum, pos) => sum + (pos.amount0 + pos.amount1), 0);
  const totalRewards = liquidityPositions.reduce((sum, pos) => sum + pos.rewards, 0);
  const totalBalance = tokenBalances.reduce((sum, balance) => sum + balance.usdValue, 0);

  return {
    totalBorrowed,
    totalLent: totalLiquidity,
    totalCollateral,
    availableCollateral: Math.max(0, totalCollateral - totalBorrowed * 1.2),
    totalRewards,
    netWorth: totalBalance + totalRewards - totalBorrowed,
    healthFactor: totalBorrowed > 0 ? totalCollateral / (totalBorrowed * 1.2) : 0,
    utilizationRatio: totalCollateral > 0 ? totalBorrowed / totalCollateral : 0,
  };
};
