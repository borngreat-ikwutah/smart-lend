import { useState, useCallback } from 'react';
import {
  addLiquidity,
  removeLiquidity,
  claimRewards,
  stakeLPTokens,
  unstakeLPTokens,
  getTransactionStatus,
  getPoolInfo,
  getUserLPBalance
} from '../liquidity-transactions';

export interface PoolData {
  id: string;
  name: string;
  tokenA: string;
  tokenB: string;
  apy: string;
  totalLiquidity: string;
  volume24h: string;
  fees24h: string;
  userLiquidity: string;
  userShare: string;
  rewards: string;
  tokenABalance: string;
  tokenBBalance: string;
}

export interface LiquidityTransactionState {
  isLoading: boolean;
  error: string | null;
  transactionId: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export function useLiquidity() {
  const [transactionState, setTransactionState] = useState<LiquidityTransactionState>({
    isLoading: false,
    error: null,
    transactionId: null,
    status: 'idle'
  });

  const [poolData, setPoolData] = useState<PoolData[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState(false);

  const executeAddLiquidity = useCallback(async (
    tokenAAmount: string,
    tokenBAmount: string,
    tokenAName: string,
    tokenBName: string
  ) => {
    setTransactionState({
      isLoading: true,
      error: null,
      transactionId: null,
      status: 'pending'
    });

    try {
      const txId = await addLiquidity(tokenAAmount, tokenBAmount, tokenAName, tokenBName);

      setTransactionState(prev => ({
        ...prev,
        transactionId: txId
      }));

      // Wait for transaction to be sealed
      const result = await getTransactionStatus(txId);

      if (result.status === 4) { // Sealed
        setTransactionState({
          isLoading: false,
          error: null,
          transactionId: txId,
          status: 'success'
        });
        return { success: true, transactionId: txId };
      } else {
        throw new Error('Transaction failed or was reverted');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTransactionState({
        isLoading: false,
        error: errorMessage,
        transactionId: null,
        status: 'error'
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const executeRemoveLiquidity = useCallback(async (
    lpTokenAmount: string,
    poolName: string
  ) => {
    setTransactionState({
      isLoading: true,
      error: null,
      transactionId: null,
      status: 'pending'
    });

    try {
      const txId = await removeLiquidity(lpTokenAmount, poolName);

      setTransactionState(prev => ({
        ...prev,
        transactionId: txId
      }));

      // Wait for transaction to be sealed
      const result = await getTransactionStatus(txId);

      if (result.status === 4) { // Sealed
        setTransactionState({
          isLoading: false,
          error: null,
          transactionId: txId,
          status: 'success'
        });
        return { success: true, transactionId: txId };
      } else {
        throw new Error('Transaction failed or was reverted');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTransactionState({
        isLoading: false,
        error: errorMessage,
        transactionId: null,
        status: 'error'
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const executeClaimRewards = useCallback(async (poolName: string) => {
    setTransactionState({
      isLoading: true,
      error: null,
      transactionId: null,
      status: 'pending'
    });

    try {
      const txId = await claimRewards(poolName);

      setTransactionState(prev => ({
        ...prev,
        transactionId: txId
      }));

      // Wait for transaction to be sealed
      const result = await getTransactionStatus(txId);

      if (result.status === 4) { // Sealed
        setTransactionState({
          isLoading: false,
          error: null,
          transactionId: txId,
          status: 'success'
        });
        return { success: true, transactionId: txId };
      } else {
        throw new Error('Transaction failed or was reverted');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTransactionState({
        isLoading: false,
        error: errorMessage,
        transactionId: null,
        status: 'error'
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const executeStakeLPTokens = useCallback(async (
    lpTokenAmount: string,
    poolName: string,
    farmDuration: string
  ) => {
    setTransactionState({
      isLoading: true,
      error: null,
      transactionId: null,
      status: 'pending'
    });

    try {
      const txId = await stakeLPTokens(lpTokenAmount, poolName, farmDuration);

      setTransactionState(prev => ({
        ...prev,
        transactionId: txId
      }));

      // Wait for transaction to be sealed
      const result = await getTransactionStatus(txId);

      if (result.status === 4) { // Sealed
        setTransactionState({
          isLoading: false,
          error: null,
          transactionId: txId,
          status: 'success'
        });
        return { success: true, transactionId: txId };
      } else {
        throw new Error('Transaction failed or was reverted');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTransactionState({
        isLoading: false,
        error: errorMessage,
        transactionId: null,
        status: 'error'
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const executeUnstakeLPTokens = useCallback(async (
    lpTokenAmount: string,
    poolName: string
  ) => {
    setTransactionState({
      isLoading: true,
      error: null,
      transactionId: null,
      status: 'pending'
    });

    try {
      const txId = await unstakeLPTokens(lpTokenAmount, poolName);

      setTransactionState(prev => ({
        ...prev,
        transactionId: txId
      }));

      // Wait for transaction to be sealed
      const result = await getTransactionStatus(txId);

      if (result.status === 4) { // Sealed
        setTransactionState({
          isLoading: false,
          error: null,
          transactionId: txId,
          status: 'success'
        });
        return { success: true, transactionId: txId };
      } else {
        throw new Error('Transaction failed or was reverted');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTransactionState({
        isLoading: false,
        error: errorMessage,
        transactionId: null,
        status: 'error'
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const fetchPoolData = useCallback(async (poolName: string) => {
    setIsLoadingPools(true);
    try {
      const info = await getPoolInfo(poolName);
      // Update poolData state with fetched info
      // In a real implementation, this would update the specific pool in the array
      return info;
    } catch (error) {
      console.error('Failed to fetch pool data:', error);
      throw error;
    } finally {
      setIsLoadingPools(false);
    }
  }, []);

  const fetchUserLPBalance = useCallback(async (userAddress: string, poolName: string) => {
    try {
      const balance = await getUserLPBalance(userAddress, poolName);
      return balance;
    } catch (error) {
      console.error('Failed to fetch user LP balance:', error);
      throw error;
    }
  }, []);

  const resetTransaction = useCallback(() => {
    setTransactionState({
      isLoading: false,
      error: null,
      transactionId: null,
      status: 'idle'
    });
  }, []);

  const calculateLiquidityValue = useCallback((
    tokenAAmount: string,
    tokenBAmount: string,
    tokenAPrice: number,
    tokenBPrice: number
  ) => {
    const tokenAValue = parseFloat(tokenAAmount) * tokenAPrice;
    const tokenBValue = parseFloat(tokenBAmount) * tokenBPrice;
    return tokenAValue + tokenBValue;
  }, []);

  const calculateAPY = useCallback((
    poolFees: string,
    totalLiquidity: string,
    additionalRewards?: string
  ) => {
    const dailyFees = parseFloat(poolFees);
    const yearlyFees = dailyFees * 365;
    const liquidity = parseFloat(totalLiquidity.replace(/[,$]/g, ''));
    const baseAPY = (yearlyFees / liquidity) * 100;

    const rewardAPY = additionalRewards ? parseFloat(additionalRewards) : 0;

    return baseAPY + rewardAPY;
  }, []);

  const calculateImpermanentLoss = useCallback((
    initialPriceRatio: number,
    currentPriceRatio: number
  ) => {
    // Simplified impermanent loss calculation
    const priceRatioChange = currentPriceRatio / initialPriceRatio;
    const impermanentLoss = (2 * Math.sqrt(priceRatioChange)) / (1 + priceRatioChange) - 1;
    return Math.abs(impermanentLoss) * 100;
  }, []);

  return {
    transactionState,
    poolData,
    isLoadingPools,
    executeAddLiquidity,
    executeRemoveLiquidity,
    executeClaimRewards,
    executeStakeLPTokens,
    executeUnstakeLPTokens,
    fetchPoolData,
    fetchUserLPBalance,
    resetTransaction,
    calculateLiquidityValue,
    calculateAPY,
    calculateImpermanentLoss
  };
}
