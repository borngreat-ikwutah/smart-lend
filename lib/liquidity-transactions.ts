import * as fcl from "@onflow/fcl";

// Transaction templates for liquidity provider operations
export const ADD_LIQUIDITY_TRANSACTION = `
import "FlowToken"
import "FungibleToken"
import "LendingPool"
import "TrustScore"

transaction(
    tokenAAmount: UFix64,
    tokenBAmount: UFix64,
    tokenAName: String,
    tokenBName: String
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {

        // Get user's token vaults
        let tokenAVault = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("TokenA vault not found")

        let tokenBVault = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("TokenB vault not found")

        // Check if user has sufficient balance
        assert(tokenAVault.balance >= tokenAAmount, message: "Insufficient TokenA balance")
        assert(tokenBVault.balance >= tokenBAmount, message: "Insufficient TokenB balance")

        // Withdraw tokens for liquidity provision
        let tokenADeposit <- tokenAVault.withdraw(amount: tokenAAmount) as! @FlowToken.Vault
        let tokenBDeposit <- tokenBVault.withdraw(amount: tokenBAmount) as! @FlowToken.Vault

        // Add liquidity to the pool
        let lpTokens = LendingPool.addLiquidity(
            account: signer,
            tokenAAmount: tokenAAmount,
            tokenBAmount: tokenBAmount,
            tokenAName: tokenAName,
            tokenBName: tokenBName
        )

        // Record liquidity provision in TrustScore (this would improve the user's score)
        TrustScore.recordLiquidityProvision(
            address: signer.address,
            tokenAAmount: tokenAAmount,
            tokenBAmount: tokenBAmount,
            poolName: tokenAName.concat("-").concat(tokenBName)
        )

        // In a real implementation, tokens would be sent to the pool vault
        destroy tokenADeposit
        destroy tokenBDeposit

        log("Liquidity added successfully")
        log("TokenA Amount: ".concat(tokenAAmount.toString()))
        log("TokenB Amount: ".concat(tokenBAmount.toString()))
        log("LP Tokens Received: ".concat(lpTokens.toString()))
        log("User Address: ".concat(signer.address.toString()))
    }

    execute {
        log("Add liquidity transaction completed")
    }
}`;

export const REMOVE_LIQUIDITY_TRANSACTION = `
import "FlowToken"
import "FungibleToken"
import "LendingPool"
import "TrustScore"

transaction(
    lpTokenAmount: UFix64,
    poolName: String
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {

        // Remove liquidity from the pool
        let withdrawnTokens = LendingPool.removeLiquidity(
            account: signer,
            lpTokenAmount: lpTokenAmount,
            poolName: poolName
        )

        // Get user's FlowToken vault to deposit withdrawn tokens
        let vault = signer.storage
            .borrow<auth(FungibleToken.Deposit) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("FlowToken vault not found")

        // Record liquidity removal in TrustScore
        TrustScore.recordLiquidityRemoval(
            address: signer.address,
            lpTokenAmount: lpTokenAmount,
            poolName: poolName
        )

        log("Liquidity removed successfully")
        log("LP Tokens Burned: ".concat(lpTokenAmount.toString()))
        log("Pool: ".concat(poolName))
        log("User Address: ".concat(signer.address.toString()))
    }

    execute {
        log("Remove liquidity transaction completed")
    }
}`;

export const CLAIM_REWARDS_TRANSACTION = `
import "FlowToken"
import "FungibleToken"
import "LendingPool"
import "TrustScore"

transaction(
    poolName: String
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {

        // Claim rewards from the pool
        let rewardAmount = LendingPool.claimRewards(
            account: signer,
            poolName: poolName
        )

        // Get user's FlowToken vault to deposit rewards
        let vault = signer.storage
            .borrow<auth(FungibleToken.Deposit) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("FlowToken vault not found")

        // Record reward claim in TrustScore
        TrustScore.recordRewardClaim(
            address: signer.address,
            rewardAmount: rewardAmount,
            poolName: poolName
        )

        log("Rewards claimed successfully")
        log("Reward Amount: ".concat(rewardAmount.toString()))
        log("Pool: ".concat(poolName))
        log("User Address: ".concat(signer.address.toString()))
    }

    execute {
        log("Claim rewards transaction completed")
    }
}`;

export const STAKE_LP_TOKENS_TRANSACTION = `
import "FlowToken"
import "FungibleToken"
import "LendingPool"
import "TrustScore"

transaction(
    lpTokenAmount: UFix64,
    poolName: String,
    farmDuration: UInt64
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {

        // Stake LP tokens for yield farming
        let stakingResult = LendingPool.stakeLPTokens(
            account: signer,
            lpTokenAmount: lpTokenAmount,
            poolName: poolName,
            duration: farmDuration
        )

        // Record LP token staking in TrustScore (this would improve the user's score)
        TrustScore.recordLPStaking(
            address: signer.address,
            lpTokenAmount: lpTokenAmount,
            poolName: poolName,
            duration: farmDuration
        )

        log("LP tokens staked successfully")
        log("LP Token Amount: ".concat(lpTokenAmount.toString()))
        log("Pool: ".concat(poolName))
        log("Farm Duration: ".concat(farmDuration.toString()))
        log("User Address: ".concat(signer.address.toString()))
    }

    execute {
        log("Stake LP tokens transaction completed")
    }
}`;

export const UNSTAKE_LP_TOKENS_TRANSACTION = `
import "FlowToken"
import "FungibleToken"
import "LendingPool"
import "TrustScore"

transaction(
    lpTokenAmount: UFix64,
    poolName: String
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {

        // Unstake LP tokens and claim farming rewards
        let unstakingResult = LendingPool.unstakeLPTokens(
            account: signer,
            lpTokenAmount: lpTokenAmount,
            poolName: poolName
        )

        // Get user's FlowToken vault to deposit rewards
        let vault = signer.storage
            .borrow<auth(FungibleToken.Deposit) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("FlowToken vault not found")

        // Record LP token unstaking in TrustScore
        TrustScore.recordLPUnstaking(
            address: signer.address,
            lpTokenAmount: lpTokenAmount,
            poolName: poolName
        )

        log("LP tokens unstaked successfully")
        log("LP Token Amount: ".concat(lpTokenAmount.toString()))
        log("Pool: ".concat(poolName))
        log("User Address: ".concat(signer.address.toString()))
    }

    execute {
        log("Unstake LP tokens transaction completed")
    }
}`;

// Function to execute add liquidity transaction
export async function addLiquidity(
  tokenAAmount: string,
  tokenBAmount: string,
  tokenAName: string,
  tokenBName: string,
): Promise<string> {
  try {
    const transactionId = await fcl.mutate({
      cadence: ADD_LIQUIDITY_TRANSACTION,
      args: (arg, t) => [
        arg(tokenAAmount, t.UFix64),
        arg(tokenBAmount, t.UFix64),
        arg(tokenAName, t.String),
        arg(tokenBName, t.String),
      ],
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000,
    });

    console.log("Add liquidity transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Add liquidity transaction failed:", error);
    throw error;
  }
}

// Function to execute remove liquidity transaction
export async function removeLiquidity(
  lpTokenAmount: string,
  poolName: string,
): Promise<string> {
  try {
    const transactionId = await fcl.mutate({
      cadence: REMOVE_LIQUIDITY_TRANSACTION,
      args: (arg, t) => [
        arg(lpTokenAmount, t.UFix64),
        arg(poolName, t.String),
      ],
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000,
    });

    console.log("Remove liquidity transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Remove liquidity transaction failed:", error);
    throw error;
  }
}

// Function to execute claim rewards transaction
export async function claimRewards(poolName: string): Promise<string> {
  try {
    const transactionId = await fcl.mutate({
      cadence: CLAIM_REWARDS_TRANSACTION,
      args: (arg, t) => [arg(poolName, t.String)],
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000,
    });

    console.log("Claim rewards transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Claim rewards transaction failed:", error);
    throw error;
  }
}

// Function to execute stake LP tokens transaction
export async function stakeLPTokens(
  lpTokenAmount: string,
  poolName: string,
  farmDuration: string,
): Promise<string> {
  try {
    const transactionId = await fcl.mutate({
      cadence: STAKE_LP_TOKENS_TRANSACTION,
      args: (arg, t) => [
        arg(lpTokenAmount, t.UFix64),
        arg(poolName, t.String),
        arg(farmDuration, t.UInt64),
      ],
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000,
    });

    console.log("Stake LP tokens transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Stake LP tokens transaction failed:", error);
    throw error;
  }
}

// Function to execute unstake LP tokens transaction
export async function unstakeLPTokens(
  lpTokenAmount: string,
  poolName: string,
): Promise<string> {
  try {
    const transactionId = await fcl.mutate({
      cadence: UNSTAKE_LP_TOKENS_TRANSACTION,
      args: (arg, t) => [
        arg(lpTokenAmount, t.UFix64),
        arg(poolName, t.String),
      ],
      payer: fcl.currentUser,
      proposer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 1000,
    });

    console.log("Unstake LP tokens transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Unstake LP tokens transaction failed:", error);
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

// Helper function to get pool information (would normally query the blockchain)
export async function getPoolInfo(poolName: string) {
  try {
    // In a real implementation, this would query the blockchain for pool data
    // For now, return mock data
    return {
      totalLiquidity: "5200000",
      volume24h: "124000",
      fees24h: "372",
      apy: "12.5",
      userLiquidity: "2450.00",
      userShare: "0.047",
      rewards: "15.23"
    };
  } catch (error) {
    console.error("Failed to get pool info:", error);
    throw error;
  }
}

// Helper function to get user's LP token balance
export async function getUserLPBalance(userAddress: string, poolName: string) {
  try {
    // In a real implementation, this would query the blockchain for user's LP token balance
    // For now, return mock data
    return {
      lpTokenBalance: "125.45",
      stakedAmount: "75.30",
      unstakedAmount: "50.15",
      pendingRewards: "5.67"
    };
  } catch (error) {
    console.error("Failed to get user LP balance:", error);
    throw error;
  }
}
