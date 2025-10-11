import "FungibleToken"
import "FlowToken"
import "MetadataViews"
import "FlowAttestation"

/// LendingPool - Core DeFi Lending Protocol
/// Supports multiple asset types with dynamic interest rates
access(all) contract LendingPool {

    // Storage paths
    access(all) let PoolStoragePath: StoragePath
    access(all) let PoolPublicPath: PublicPath
    access(all) let UserPositionStoragePath: StoragePath
    access(all) let UserPositionPublicPath: PublicPath

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
                return 1.0   // 100% for scores 80-100
            } else if effectiveScore >= 50 {
                return 1.2  // 120% for scores 50-79
            } else {
                return 1.5  // 150% for scores 0-49
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
        }
        
        /// Update attestation boost
        access(all) fun updateAttestationBoost(boost: UInt8) {
            self.attestationBoost = boost
        }
        
        /// Get interest rate based on utilization and trust score
        access(all) fun getInterestRate(): UFix64 {
            // Base rate calculation (simplified)
            let baseRate = 0.02 // 2%
            
            // Trust score adjustment (better score = lower rate)
            let scoreAdjustment = UFix64(self.trustScore + self.attestationBoost) / 100.0
            let adjustedRate = baseRate * (1.0 - scoreAdjustment * 0.5) // Up to 50% reduction
            
            return adjustedRate
        }
        
        /// Add collateral
        access(all) fun addCollateral(amount: UFix64) {
            self.collateralBalance = self.collateralBalance + amount
        }
        
        /// Remove collateral
        access(all) fun removeCollateral(amount: UFix64): UFix64 {
            let maxRemovable = self.getMaxRemovableCollateral()
            let actualAmount = amount < maxRemovable ? amount : maxRemovable
            
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
            let maxBorrowable = self.getMaxBorrowableAmount()
            let actualAmount = amount < maxBorrowable ? amount : maxBorrowable
            
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
            let totalOwed = self.borrowedAmount + self.interestOwed
            let actualRepayment = amount < totalOwed ? amount : totalOwed
            
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
    
    access(all) event AttestationBoostUpdated(
        user: Address,
        boost: UInt8,
        hasAttestations: Bool
    )

    init() {
        self.PoolStoragePath = /storage/lendingPool
        self.PoolPublicPath = /public/lendingPool
        self.UserPositionStoragePath = /storage/userPosition
        self.UserPositionPublicPath = /public/userPosition
    }

    /// Get user position
    access(all) fun getUserPosition(address: Address): &UserPosition? {
        let account = getAccount(address)
        return account.capabilities
            .get<&LendingPool.UserPosition>(self.UserPositionPublicPath)
            .borrow()
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

    /// Get attestation boost from FlowAttestation contract
    access(all) fun getAttestationBoost(address: Address): UInt8 {
        let attestationContract = getAccount(0xc217963c0db98c89)
        let attestationRef = attestationContract.capabilities
            .get<&FlowAttestation>(/public/flowAttestation)
            .borrow()
            ?? panic("FlowAttestation contract not found")
        
        return attestationRef.getTrustScoreBoost(address: address)
    }

    /// Check if user has valid attestations
    access(all) fun hasValidAttestations(address: Address): Bool {
        let attestationContract = getAccount(0xc217963c0db98c89)
        let attestationRef = attestationContract.capabilities
            .get<&FlowAttestation>(/public/flowAttestation)
            .borrow()
            ?? panic("FlowAttestation contract not found")
        
        return attestationRef.hasValidAttestations(address: address)
    }

    /// Update user's attestation boost automatically
    access(all) fun updateUserAttestationBoost(address: Address) {
        let attestationBoost = self.getAttestationBoost(address: address)
        let hasAttestations = self.hasValidAttestations(address: address)
        
        self.updateAttestationBoost(address: address, boost: attestationBoost)
        
        emit AttestationBoostUpdated(
            user: address,
            boost: attestationBoost,
            hasAttestations: hasAttestations
        )
    }

    /// Check if position needs liquidation
    access(all) fun needsLiquidation(address: Address): Bool {
        if let position = self.getUserPosition(address: address) {
            return !position.isHealthy()
        }
        return false
    }

    /// Get user position info
    access(all) fun getUserPositionInfo(address: Address): {String: UFix64} {
        let position = self.getUserPosition(address: address)
            ?? panic("User position not found")
        
        let attestationBoost = self.getAttestationBoost(address: address)
        let hasAttestations = self.hasValidAttestations(address: address)
        
        return {
            "collateralBalance": position.collateralBalance,
            "borrowedAmount": position.borrowedAmount,
            "interestOwed": position.interestOwed,
            "collateralRatio": position.getCollateralRatio(),
            "requiredRatio": position.getRequiredCollateralRatio(),
            "maxBorrowable": position.getMaxBorrowableAmount(),
            "trustScore": UFix64(position.trustScore),
            "attestationBoost": UFix64(attestationBoost),
            "hasAttestations": hasAttestations ? 1.0 : 0.0,
            "interestRate": position.getInterestRate()
        }
    }
}