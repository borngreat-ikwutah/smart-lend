import * as fcl from "@onflow/fcl";

// Transaction templates for borrowing and repaying
export const BORROW_FUNDS_TRANSACTION = `
import "FlowToken"
import "FungibleToken"
import "LendingPool"

transaction(
    amount: UFix64,
    assetName: String
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {

        // Borrow funds from the lending pool
        let borrowedAmount = LendingPool.borrow(
            account: signer,
            amount: amount,
            assetName: assetName
        )

        // If successful, create tokens for the user
        if borrowedAmount > 0.0 {
            // Get user's FlowToken vault to deposit borrowed tokens
            let vault = signer.storage
                .borrow<auth(FungibleToken.Deposit) &FlowToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("FlowToken vault not found")

            log("Funds borrowed successfully")
            log("Requested Amount: ".concat(amount.toString()))
            log("Borrowed Amount: ".concat(borrowedAmount.toString()))
            log("User Address: ".concat(signer.address.toString()))
        } else {
            log("Borrowing failed - insufficient collateral or pool liquidity")
        }
    }

    execute {
        log("Borrow transaction completed")
    }
}`;

export const REPAY_LOAN_TRANSACTION = `
import "FlowToken"
import "FungibleToken"
import "LendingPool"
import "TrustScore"

transaction(
    amount: UFix64,
    assetName: String
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {

        // Get user's FlowToken vault
        let vault = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("FlowToken vault not found")

        // Check if user has sufficient balance
        assert(vault.balance >= amount, message: "Insufficient FlowToken balance")

        // Withdraw tokens for repayment
        let repayTokens <- vault.withdraw(amount: amount) as! @FlowToken.Vault

        // Repay funds to the lending pool
        let repaidAmount = LendingPool.repay(
            account: signer,
            amount: amount,
            assetName: assetName
        )

        // Record repayment in TrustScore (this would improve the user's score)
        TrustScore.recordRepayment(
            address: signer.address,
            amount: repaidAmount,
            isOnTime: true
        )

        // In a real implementation, repayTokens would be sent to the pool vault
        destroy repayTokens

        log("Loan repaid successfully")
        log("Amount: ".concat(repaidAmount.toString()))
        log("Asset: ".concat(assetName))
        log("User Address: ".concat(signer.address.toString()))
    }

    execute {
        log("Repay transaction completed")
    }
}`;

// Function to execute borrow transaction
export async function borrowFunds(
  amount: string,
  asset: string,
): Promise<string> {
  try {
    const transactionId = await fcl.mutate({
      cadence: BORROW_FUNDS_TRANSACTION,
      args: (arg, t) => [arg(amount, t.UFix64), arg(asset, t.String)],
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000,
    });

    console.log("Borrow transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Borrow transaction failed:", error);
    throw error;
  }
}

// Function to execute repay transaction
export async function repayLoan(
  amount: string,
  asset: string,
): Promise<string> {
  try {
    const transactionId = await fcl.mutate({
      cadence: REPAY_LOAN_TRANSACTION,
      args: (arg, t) => [arg(amount, t.UFix64), arg(asset, t.String)],
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000,
    });

    console.log("Repay transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Repay transaction failed:", error);
    throw error;
  }
}

// Function to get transaction status
export async function getTransactionStatus(transactionId: string) {
  try {
    return await fcl.tx(transactionId).onceSealed();
  } catch (error) {
    console.error("Failed to get transaction status:", error);
    throw error;
  }
}
