import "FungibleToken"
import "FlowToken"
import "MetadataViews"
import "FlowAttestation"

/// LendingPool - Core DeFi Lending Protocol with AI-driven collateral requirements
/// Supports multiple asset types with dynamic interest rates based on trust scores
/// Inspired by Aave/Compound but optimized for Flow's resource model
access(all) contract LendingPool {

    // Storage paths
    access(all) let PoolStoragePath: StoragePath
    access(all) let PoolPublicPath: PublicPath
    access(all) let UserPositionStoragePath: StoragePath
    access(all) let UserPositionPublicPath: PublicPath

    // Interest rate configuration
    access(all) let BASE_RATE: UFix64 = 0.02 // 2% base rate
    access(all) let SLOPE_RATE_1: UFix64 = 0.10 // 10% slope rate 1
    access(all) let SLOPE_RATE_2: UFix64 = 0.30 // 30% slope rate 2
    access(all) let OPTIMAL_UTILIZATION: UFix64 = 0.80 // 80% optimal utilization
    
    // Collateral requirements by trust score tier
    access(all) let LOW_SCORE_COLLATERAL: UFix64 = 1.50    // 150% for scores 0-49
    access(all) let MEDIUM_SCORE_COLLATERAL: UFix64 = 1.20 // 120% for scores 50-79
    access(all) let HIGH_SCORE_COLLATERAL: UFix64 = 1.00   // 100% for scores 80-100

    /// Pool configuration for different assets
    access(all) struct PoolConfig {
        access(all) let assetType: Type
        access(all) let maxLTV: UFix64 // Maximum Loan-to-Value ratio
        access(all) let liquidationThreshold: UFix64
        access(all) let liquidationPenalty: UFix64
        access(all) var isActive: Bool
        
        init(
            assetType: Type,
            maxLTV: UFix64,
            liquidationThreshold: UFix64,
            liquidationPenalty: UFix64
        ) {
            self.assetType = assetType
            self.maxLTV = maxLTV
            self.liquidationThreshold = liquidationThreshold
            self.liquidationPenalty = liquidationPenalty
            self.isActive = true
        }
        
        access(all) fun deactivate() {
            self.isActive = false
        }
        
        access(all) fun activate() {
            self.isActive = true
        }
    }

    /// User's lending position
    access(all) resource UserPosition {
        access(all) var collateralBalance: UFix64
        access(all) var borrowedAmount: UFix64
        access(all) var collateralType: Type
        access(all) var borrowedType: Type
        access(all) var lastUpdateTime: UFix64
        access(all) var interestOwed: UFix64
        access(all) var trustScore: UInt8
        access(all) var attestationBoost: UInt8
        
        init(collateralType: Type, borrowedType: Type, trustScore: UInt8) {
            self.collateralBalance = 0.0
            self.borrowedAmount = 0.0
            self.collateralType = collateralType
            self.borrowedType = borrowedType
            self.lastUpdateTime = getCurrentBlock().timestamp
            self.interestOwed = 0.0
            self.trustScore = trustScore
            self.attestationBoost = 0
        }
        
        /// Calculate current collateral ratio
        access(all) fun getCollateralRatio(): UFix64 {
            if self.borrowedAmount == 0.0 {
                return 0.0
            }
            
            let collateralValue = self.getCollateralValue()
            return collateralValue / self.borrowedAmount
        }
        
        /// Get collateral value (simplified - in production, use oracle)
        access(all) fun getCollateralValue(): UFix64 {
            // For now, assume 1:1 ratio between collateral and borrowed asset
            // In production, integrate with price oracles
            return self.collateralBalance
        }
        
        /// Calculate required collateral based on trust score
        access(all) fun getRequiredCollateralRatio(): UFix64 {
            let effectiveScore = self.trustScore + self.attestationBoost
            if effectiveScore >= 80 {
                return HIGH_SCORE_COLLATERAL
            } else if effectiveScore >= 50 {
                return MEDIUM_SCORE_COLLATERAL
            } else {
                return LOW_SCORE_COLLATERAL
            }
        }
        
        /// Check if position is healthy
        access(all) fun isHealthy(): Bool {
            let collateralRatio = self.getCollateralRatio()
            let requiredRatio = self.getRequiredCollateralRatio()
            return collateralRatio >= requiredRatio
        }
        
        /// Update trust score and recalculate requirements
        access(all) fun updateTrustScore(newScore: UInt8) {
            self.trustScore = newScore
            self.updateInterest()
        }
        
        /// Update attestation boost
        access(all) fun updateAttestationBoost(boost: UInt8) {
            self.attestationBoost = boost
            self.updateInterest()
        }
        
        /// Calculate accrued interest
        access(all) fun calculateInterest(currentTime: UFix64): UFix64 {
            if self.borrowedAmount == 0.0 {
                return 0.0
            }
            
            let timeDelta = currentTime - self.lastUpdateTime
            let secondsInYear: UFix64 = 365.25 * 24.0 * 3600.0
            let annualRate = self.getInterestRate()
            
            // Simple interest calculation (compound in production)
            let interestRate = annualRate * (timeDelta / secondsInYear)
            return self.borrowedAmount * interestRate
        }
        
        /// Get interest rate based on utilization and trust score
        access(all) fun getInterestRate(): UFix64 {
            // Base rate calculation (simplified)
            let baseRate = BASE_RATE
            
            // Trust score adjustment (better score = lower rate)
            let scoreAdjustment = UFix64(self.trustScore + self.attestationBoost) / 100.0
            let adjustedRate = baseRate * (1.0 - scoreAdjustment * 0.5) // Up to 50% reduction
            
            return adjustedRate
        }
        
        /// Update interest owed
        access(all) fun updateInterest() {
            let currentTime = getCurrentBlock().timestamp
            let newInterest = self.calculateInterest(currentTime: currentTime)
            self.interestOwed = self.interestOwed + newInterest
            self.lastUpdateTime = currentTime
        }
        
        /// Add collateral
        access(all) fun addCollateral(amount: UFix64) {
            self.collateralBalance = self.collateralBalance + amount
            self.updateInterest()
        }
        
        /// Remove collateral
        access(all) fun removeCollateral(amount: UFix64): UFix64 {
            self.updateInterest()
            
            let maxRemovable = self.getMaxRemovableCollateral()
            let actualAmount = min(amount, maxRemovable)
            
            self.collateralBalance = self.collateralBalance - actualAmount
            return actualAmount
        }
        
        /// Calculate maximum removable collateral
        access(all) fun getMaxRemovableCollateral(): UFix64 {
            if self.borrowedAmount == 0.0 {
                return self.collateralBalance
            }
            
            let requiredRatio = self.getRequiredCollateralRatio()
            let minRequiredCollateral = self.borrowedAmount * requiredRatio
            
            if self.collateralBalance <= minRequiredCollateral {
                return 0.0
            }
            
            return self.collateralBalance - minRequiredCollateral
        }
        
        /// Borrow funds
        access(all) fun borrow(amount: UFix64): UFix64 {
            self.updateInterest()
            
            let maxBorrowable = self.getMaxBorrowableAmount()
            let actualAmount = min(amount, maxBorrowable)
            
            self.borrowedAmount = self.borrowedAmount + actualAmount
            return actualAmount
        }
        
        /// Calculate maximum borrowable amount
        access(all) fun getMaxBorrowableAmount(): UFix64 {
            if self.collateralBalance == 0.0 {
                return 0.0
            }
            
            let requiredRatio = self.getRequiredCollateralRatio()
            return self.collateralBalance / requiredRatio
        }
        
        /// Repay borrowed funds
        access(all) fun repay(amount: UFix64): UFix64 {
            self.updateInterest()
            
            let totalOwed = self.borrowedAmount + self.interestOwed
            let actualRepayment = min(amount, totalOwed)
            
            if actualRepayment >= self.interestOwed {
                let principalRepayment = actualRepayment - self.interestOwed
                self.borrowedAmount = self.borrowedAmount - principalRepayment
                self.interestOwed = 0.0
            } else {
                self.interestOwed = self.interestOwed - actualRepayment
            }
            
            return actualRepayment
        }
    }

    /// Pool state for tracking liquidity and utilization
    access(all) resource PoolState {
        access(all) var totalLiquidity: UFix64
        access(all) var totalBorrowed: UFix64
        access(all) var reserveFactor: UFix64
        access(all) var lastUpdateTime: UFix64
        access(all) var poolConfig: PoolConfig
        
        init(poolConfig: PoolConfig) {
            self.totalLiquidity = 0.0
            self.totalBorrowed = 0.0
            self.reserveFactor = 0.1 // 10% reserve factor
            self.lastUpdateTime = getCurrentBlock().timestamp
            self.poolConfig = poolConfig
        }
        
        /// Calculate current utilization rate
        access(all) fun getUtilizationRate(): UFix64 {
            if self.totalLiquidity == 0.0 {
                return 0.0
            }
            return self.totalBorrowed / self.totalLiquidity
        }
        
        /// Calculate current interest rate
        access(all) fun getCurrentInterestRate(): UFix64 {
            let utilization = self.getUtilizationRate()
            
            if utilization <= OPTIMAL_UTILIZATION {
                return BASE_RATE + (utilization * SLOPE_RATE_1 / OPTIMAL_UTILIZATION)
            } else {
                let excessUtilization = utilization - OPTIMAL_UTILIZATION
                return BASE_RATE + SLOPE_RATE_1 + (excessUtilization * SLOPE_RATE_2 / (1.0 - OPTIMAL_UTILIZATION))
            }
        }
        
        /// Add liquidity to pool
        access(all) fun addLiquidity(amount: UFix64) {
            self.totalLiquidity = self.totalLiquidity + amount
            self.lastUpdateTime = getCurrentBlock().timestamp
        }
        
        /// Remove liquidity from pool
        access(all) fun removeLiquidity(amount: UFix64): UFix64 {
            let availableLiquidity = self.totalLiquidity - self.totalBorrowed
            let actualAmount = min(amount, availableLiquidity)
            
            self.totalLiquidity = self.totalLiquidity - actualAmount
            self.lastUpdateTime = getCurrentBlock().timestamp
            
            return actualAmount
        }
        
        /// Update borrowed amount
        access(all) fun updateBorrowed(amount: UFix64, isIncrease: Bool) {
            if isIncrease {
                self.totalBorrowed = self.totalBorrowed + amount
            } else {
                self.totalBorrowed = self.totalBorrowed - amount
            }
            self.lastUpdateTime = getCurrentBlock().timestamp
        }
    }

    // Events
    access(all) event PositionCreated(
        user: Address,
        collateralType: String,
        borrowedType: String,
        trustScore: UInt8
    )
    
    access(all) event CollateralDeposited(
        user: Address,
        amount: UFix64,
        newBalance: UFix64
    )
    
    access(all) event CollateralWithdrawn(
        user: Address,
        amount: UFix64,
        newBalance: UFix64
    )
    
    access(all) event FundsBorrowed(
        user: Address,
        amount: UFix64,
        newDebt: UFix64,
        interestRate: UFix64
    )
    
    access(all) event FundsRepaid(
        user: Address,
        amount: UFix64,
        remainingDebt: UFix64
    )
    
    access(all) event TrustScoreUpdated(
        user: Address,
        oldScore: UInt8,
        newScore: UInt8
    )
    
    access(all) event LiquidationExecuted(
        user: Address,
        liquidatedAmount: UFix64,
        collateralSeized: UFix64,
        liquidator: Address
    )

    // Pool configurations
    access(all) var poolConfigs: {String: PoolConfig}
    access(all) var poolStates: {String: PoolState}

    init() {
        self.PoolStoragePath = /storage/lendingPool
        self.PoolPublicPath = /public/lendingPool
        self.UserPositionStoragePath = /storage/userPosition
        self.UserPositionPublicPath = /public/userPosition
        
        self.poolConfigs = {}
        self.poolStates = {}
        
        // Initialize Flow Token pool
        self.initializePool(
            assetName: "FlowToken",
            assetType: Type<@FlowToken.Vault>(),
            maxLTV: 0.80,
            liquidationThreshold: 0.85,
            liquidationPenalty: 0.08
        )
    }

    /// Initialize a new lending pool
    access(all) fun initializePool(
        assetName: String,
        assetType: Type,
        maxLTV: UFix64,
        liquidationThreshold: UFix64,
        liquidationPenalty: UFix64
    ) {
        let config = PoolConfig(
            assetType: assetType,
            maxLTV: maxLTV,
            liquidationThreshold: liquidationThreshold,
            liquidationPenalty: liquidationPenalty
        )
        
        let poolState = PoolState(poolConfig: config)
        
        self.poolConfigs[assetName] = config
        self.poolStates[assetName] = poolState
    }

    /// Initialize user position
    access(all) fun initializeUserPosition(
        account: &Account,
        collateralType: Type,
        borrowedType: Type,
        trustScore: UInt8
    ) {
        if account.storage.borrow<&LendingPool.UserPosition>(from: UserPositionStoragePath) != nil {
            return
        }
        
        let position <- create UserPosition(
            collateralType: collateralType,
            borrowedType: borrowedType,
            trustScore: trustScore
        )
        
        account.storage.save(<-position, to: UserPositionStoragePath)
        
        // Create public capability
        let positionCap = account.capabilities.storage.issue<&LendingPool.UserPosition>(UserPositionStoragePath)
        account.capabilities.publish(positionCap, at: UserPositionPublicPath)
        
        emit PositionCreated(
            user: account.address,
            collateralType: collateralType.identifier,
            borrowedType: borrowedType.identifier,
            trustScore: trustScore
        )
    }

    /// Get user position
    access(all) fun getUserPosition(address: Address): &UserPosition? {
        let account = getAccount(address)
        return account.capabilities
            .get<&LendingPool.UserPosition>(UserPositionPublicPath)
            .borrow()
    }

    /// Deposit collateral
    access(all) fun depositCollateral(
        account: &Account,
        amount: UFix64,
        assetName: String
    ) {
        let position = account.capabilities
            .get<&LendingPool.UserPosition>(UserPositionPublicPath)
            .borrow()
            ?? panic("User position not found")
        
        position.addCollateral(amount: amount)
        
        emit CollateralDeposited(
            user: account.address,
            amount: amount,
            newBalance: position.collateralBalance
        )
    }

    /// Withdraw collateral
    access(all) fun withdrawCollateral(
        account: &Account,
        amount: UFix64
    ): UFix64 {
        let position = account.capabilities
            .get<&LendingPool.UserPosition>(UserPositionPublicPath)
            .borrow()
            ?? panic("User position not found")
        
        let withdrawnAmount = position.removeCollateral(amount: amount)
        
        emit CollateralWithdrawn(
            user: account.address,
            amount: withdrawnAmount,
            newBalance: position.collateralBalance
        )
        
        return withdrawnAmount
    }

    /// Borrow funds
    access(all) fun borrow(
        account: &Account,
        amount: UFix64,
        assetName: String
    ): UFix64 {
        let position = account.capabilities
            .get<&LendingPool.UserPosition>(UserPositionPublicPath)
            .borrow()
            ?? panic("User position not found")
        
        let poolState = self.poolStates[assetName]
            ?? panic("Pool not found")
        
        if !poolState.poolConfig.isActive {
            panic("Pool is not active")
        }
        
        let borrowedAmount = position.borrow(amount: amount)
        
        if borrowedAmount > 0.0 {
            poolState.updateBorrowed(amount: borrowedAmount, isIncrease: true)
            
            emit FundsBorrowed(
                user: account.address,
                amount: borrowedAmount,
                newDebt: position.borrowedAmount,
                interestRate: position.getInterestRate()
            )
        }
        
        return borrowedAmount
    }

    /// Repay borrowed funds
    access(all) fun repay(
        account: &Account,
        amount: UFix64,
        assetName: String
    ): UFix64 {
        let position = account.capabilities
            .get<&LendingPool.UserPosition>(UserPositionPublicPath)
            .borrow()
            ?? panic("User position not found")
        
        let poolState = self.poolStates[assetName]
            ?? panic("Pool not found")
        
        let repaidAmount = position.repay(amount: amount)
        
        if repaidAmount > 0.0 {
            let principalRepaid = min(repaidAmount, position.borrowedAmount)
            if principalRepaid > 0.0 {
                poolState.updateBorrowed(amount: principalRepaid, isIncrease: false)
            }
            
            emit FundsRepaid(
                user: account.address,
                amount: repaidAmount,
                remainingDebt: position.borrowedAmount + position.interestOwed
            )
        }
        
        return repaidAmount
    }

    /// Update user trust score
    access(all) fun updateTrustScore(address: Address, newScore: UInt8) {
        if let position = self.getUserPosition(address: address) {
            let oldScore = position.trustScore
            position.updateTrustScore(newScore: newScore)
            
            emit TrustScoreUpdated(
                user: address,
                oldScore: oldScore,
                newScore: newScore
            )
        }
    }

    /// Update attestation boost
    access(all) fun updateAttestationBoost(address: Address, boost: UInt8) {
        if let position = self.getUserPosition(address: address) {
            position.updateAttestationBoost(boost: boost)
        }
    }

    /// Check if position needs liquidation
    access(all) fun needsLiquidation(address: Address): Bool {
        if let position = self.getUserPosition(address: address) {
            return !position.isHealthy()
        }
        return false
    }

    /// Execute liquidation
    access(all) fun executeLiquidation(
        targetAddress: Address,
        liquidatedAmount: UFix64,
        liquidator: Address
    ): UFix64 {
        if let position = self.getUserPosition(address: targetAddress) {
            if position.isHealthy() {
                panic("Position is healthy, no liquidation needed")
            }
            
            let collateralToSeize = liquidatedAmount * (1.0 + 0.08) // 8% penalty
            
            if collateralToSeize > position.collateralBalance {
                panic("Not enough collateral to seize")
            }
            
            position.collateralBalance = position.collateralBalance - collateralToSeize
            position.borrowedAmount = position.borrowedAmount - liquidatedAmount
            
            emit LiquidationExecuted(
                user: targetAddress,
                liquidatedAmount: liquidatedAmount,
                collateralSeized: collateralToSeize,
                liquidator: liquidator
            )
            
            return collateralToSeize
        }
        
        panic("Position not found")
    }

    /// Get pool information
    access(all) fun getPoolInfo(assetName: String): {String: UFix64} {
        let poolState = self.poolStates[assetName]
            ?? panic("Pool not found")
        
        return {
            "totalLiquidity": poolState.totalLiquidity,
            "totalBorrowed": poolState.totalBorrowed,
            "utilizationRate": poolState.getUtilizationRate(),
            "interestRate": poolState.getCurrentInterestRate()
        }
    }

    /// Get user position info
    access(all) fun getUserPositionInfo(address: Address): {String: UFix64} {
        let position = self.getUserPosition(address: address)
            ?? panic("User position not found")
        
        return {
            "collateralBalance": position.collateralBalance,
            "borrowedAmount": position.borrowedAmount,
            "interestOwed": position.interestOwed,
            "collateralRatio": position.getCollateralRatio(),
            "requiredRatio": position.getRequiredCollateralRatio(),
            "maxBorrowable": position.getMaxBorrowableAmount(),
            "trustScore": UFix64(position.trustScore),
            "interestRate": position.getInterestRate()
        }
    }
}
