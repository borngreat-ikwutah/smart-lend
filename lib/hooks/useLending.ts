import { useState, useCallback } from 'react';
import { borrowFunds, repayLoan, getTransactionStatus } from '../lending-transactions';

export interface LoanData {
  id: string;
  asset: string;
  principal: number;
  currentBalance: number;
  interestRate: number;
  interestAccrued: number;
  nextPaymentDate: Date;
  minimumPayment: number;
  collateralAmount: number;
  collateralAsset: string;
  healthFactor: number;
  daysOverdue: number;
}

export interface TransactionState {
  isLoading: boolean;
  error: string | null;
  transactionId: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export function useLending() {
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isLoading: false,
    error: null,
    transactionId: null,
    status: 'idle'
  });

  const executeBorrow = useCallback(async (amount: string, asset: string) => {
    setTransactionState({
      isLoading: true,
      error: null,
      transactionId: null,
      status: 'pending'
    });

    try {
      const txId = await borrowFunds(amount, asset);

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

  const executeRepay = useCallback(async (amount: string, asset: string) => {
    setTransactionState({
      isLoading: true,
      error: null,
      transactionId: null,
      status: 'pending'
    });

    try {
      const txId = await repayLoan(amount, asset);

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

  const resetTransaction = useCallback(() => {
    setTransactionState({
      isLoading: false,
      error: null,
      transactionId: null,
      status: 'idle'
    });
  }, []);

  return {
    transactionState,
    executeBorrow,
    executeRepay,
    resetTransaction
  };
}
