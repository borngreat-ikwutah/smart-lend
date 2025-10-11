import "FungibleToken"
import "FlowToken"
import "MetadataViews"

/// TrustScore - AI-driven credit scoring system for Flow blockchain
/// Provides transparent, auditable credit scoring with real-time updates
access(all) contract TrustScore {

    // Storage paths
    access(all) let TrustScoreStoragePath: StoragePath
    access(all) let TrustScorePublicPath: PublicPath

    /// User's trust score resource
    access(all) resource TrustScoreData {
        access(all) var currentScore: UInt8
        access(all) var previousScore: UInt8
        access(all) var lastUpdateTime: UFix64
        access(all) var attestationBoost: UInt8
        access(all) var isActive: Bool
        
        // Onchain behavior metrics
        access(all) var totalRepayments: UInt32
        access(all) var successfulRepayments: UInt32
        access(all) var defaults: UInt32
        access(all) var latePayments: UInt32
        access(all) var tradingVolume: UFix64
        access(all) var accountAgeDays: UInt32
        access(all) var lastActivityTime: UFix64
        
        init(initialScore: UInt8) {
            self.currentScore = initialScore
            self.previousScore = initialScore
            self.lastUpdateTime = getCurrentBlock().timestamp
            self.attestationBoost = 0
            self.isActive = true
            
            // Initialize metrics
            self.totalRepayments = 0
            self.successfulRepayments = 0
            self.defaults = 0
            self.latePayments = 0
            self.tradingVolume = 0.0
            self.accountAgeDays = 0
            self.lastActivityTime = getCurrentBlock().timestamp
        }
        
        /// Update score with new calculation
        access(all) fun updateScore(newScore: UInt8, reason: String) {
            self.previousScore = self.currentScore
            self.currentScore = newScore
            self.lastUpdateTime = getCurrentBlock().timestamp
        }
        
        /// Record successful repayment
        access(all) fun recordRepayment(amount: UFix64, isOnTime: Bool) {
            self.totalRepayments = self.totalRepayments + 1
            self.successfulRepayments = self.successfulRepayments + 1
            
            if !isOnTime {
                self.latePayments = self.latePayments + 1
            }
            
            self.lastActivityTime = getCurrentBlock().timestamp
        }
        
        /// Record default
        access(all) fun recordDefault() {
            self.defaults = self.defaults + 1
            self.lastActivityTime = getCurrentBlock().timestamp
        }
        
        /// Update trading volume
        access(all) fun updateTradingVolume(amount: UFix64) {
            self.tradingVolume = self.tradingVolume + amount
            self.lastActivityTime = getCurrentBlock().timestamp
        }
        
        /// Update account age
        access(all) fun updateAccountAge(days: UInt32) {
            self.accountAgeDays = days
        }
        
        /// Calculate score based on current metrics
        access(all) fun calculateScore(): UInt8 {
            var score: UFix64 = UFix64(50) // Base score
            
            // Repayment history bonus
            if self.totalRepayments > 0 {
                let repaymentRate = UFix64(self.successfulRepayments) / UFix64(self.totalRepayments)
                score = score + (UFix64(10) * repaymentRate) // 10 point bonus
            }
            
            // Trading volume bonus
            let volumeBonus = (self.tradingVolume / 1000.0) * 2.0
            score = score + volumeBonus
            
            // Account age bonus
            let ageBonus = (UFix64(self.accountAgeDays) / 30.0) * 1.0
            score = score + ageBonus
            
            // Verification bonus
            score = score + UFix64(self.attestationBoost)
            
            // Penalties
            score = score - (UFix64(self.defaults) * UFix64(20))
            score = score - (UFix64(self.latePayments) * UFix64(5))
            
            // Ensure score is within bounds
            let finalScore = score < 0.0 ? 0.0 : (score > 100.0 ? 100.0 : score)
            
            return UInt8(finalScore)
        }
        
        /// Get effective score (including attestation boost)
        access(all) fun getEffectiveScore(): UInt8 {
            let effectiveScore = self.currentScore + self.attestationBoost
            return effectiveScore > 100 ? 100 : effectiveScore
        }
        
        /// Update attestation boost
        access(all) fun updateAttestationBoost(boost: UInt8) {
            self.attestationBoost = boost
        }
        
        /// Get score tier
        access(all) fun getScoreTier(): String {
            let effectiveScore = self.getEffectiveScore()
            
            if effectiveScore >= 80 {
                return "HIGH"
            } else if effectiveScore >= 50 {
                return "MEDIUM"
            } else {
                return "LOW"
            }
        }
        
        /// Check if score is in good standing
        access(all) fun isGoodStanding(): Bool {
            return self.getEffectiveScore() >= 50 && self.isActive
        }
        
        /// Get score change from previous
        access(all) fun getScoreChange(): Int {
            return Int(self.currentScore) - Int(self.previousScore)
        }
        
        /// Deactivate score (for account closure)
        access(all) fun deactivate() {
            self.isActive = false
        }
    }

    // Events
    access(all) event TrustScoreInitialized(
        user: Address,
        initialScore: UInt8,
        timestamp: UFix64
    )
    
    access(all) event TrustScoreUpdated(
        user: Address,
        oldScore: UInt8,
        newScore: UInt8,
        reason: String,
        timestamp: UFix64
    )
    
    access(all) event RepaymentRecorded(
        user: Address,
        amount: UFix64,
        isOnTime: Bool,
        newScore: UInt8
    )
    
    access(all) event DefaultRecorded(
        user: Address,
        newScore: UInt8
    )
    
    access(all) event TradingVolumeUpdated(
        user: Address,
        amount: UFix64,
        totalVolume: UFix64
    )
    
    access(all) event AttestationBoostUpdated(
        user: Address,
        oldBoost: UInt8,
        newBoost: UInt8,
        effectiveScore: UInt8
    )

    // Global state
    access(all) var totalUsers: UInt32
    access(all) var averageScore: UFix64

    init() {
        self.TrustScoreStoragePath = /storage/trustScore
        self.TrustScorePublicPath = /public/trustScore
        
        self.totalUsers = 0
        self.averageScore = 0.0
    }

    /// Get user's trust score data
    access(all) fun getTrustScoreData(address: Address): &TrustScoreData? {
        let account = getAccount(address)
        return account.capabilities
            .get<&TrustScore.TrustScoreData>(self.TrustScorePublicPath)
            .borrow()
    }

    /// Update trust score (called by oracle or admin)
    access(all) fun updateTrustScore(
        address: Address,
        newScore: UInt8,
        reason: String
    ) {
        if let scoreData = self.getTrustScoreData(address: address) {
            let oldScore = scoreData.currentScore
            scoreData.updateScore(newScore: newScore, reason: reason)
            
            emit TrustScoreUpdated(
                user: address,
                oldScore: oldScore,
                newScore: newScore,
                reason: reason,
                timestamp: getCurrentBlock().timestamp
            )
        }
    }

    /// Record a repayment
    access(all) fun recordRepayment(
        address: Address,
        amount: UFix64,
        isOnTime: Bool
    ) {
        if let scoreData = self.getTrustScoreData(address: address) {
            scoreData.recordRepayment(amount: amount, isOnTime: isOnTime)
            
            // Recalculate and update score
            let newScore = scoreData.calculateScore()
            let oldScore = scoreData.currentScore
            scoreData.updateScore(newScore: newScore, reason: "Repayment recorded")
            
            emit RepaymentRecorded(
                user: address,
                amount: amount,
                isOnTime: isOnTime,
                newScore: newScore
            )
        }
    }

    /// Record a default
    access(all) fun recordDefault(address: Address) {
        if let scoreData = self.getTrustScoreData(address: address) {
            scoreData.recordDefault()
            
            // Recalculate and update score
            let newScore = scoreData.calculateScore()
            scoreData.updateScore(newScore: newScore, reason: "Default recorded")
            
            emit DefaultRecorded(
                user: address,
                newScore: newScore
            )
        }
    }

    /// Update trading volume
    access(all) fun updateTradingVolume(
        address: Address,
        amount: UFix64
    ) {
        if let scoreData = self.getTrustScoreData(address: address) {
            scoreData.updateTradingVolume(amount: amount)
            
            emit TradingVolumeUpdated(
                user: address,
                amount: amount,
                totalVolume: scoreData.tradingVolume
            )
        }
    }

    /// Update attestation boost
    access(all) fun updateAttestationBoost(
        address: Address,
        boost: UInt8
    ) {
        if let scoreData = self.getTrustScoreData(address: address) {
            let oldBoost = scoreData.attestationBoost
            scoreData.updateAttestationBoost(boost: boost)
            
            emit AttestationBoostUpdated(
                user: address,
                oldBoost: oldBoost,
                newBoost: boost,
                effectiveScore: scoreData.getEffectiveScore()
            )
        }
    }

    /// Get user's current trust score
    access(all) fun getTrustScore(address: Address): UInt8 {
        if let scoreData = self.getTrustScoreData(address: address) {
            return scoreData.getEffectiveScore()
        }
        return 50 // Default base score
    }

    /// Get user's score tier
    access(all) fun getScoreTier(address: Address): String {
        if let scoreData = self.getTrustScoreData(address: address) {
            return scoreData.getScoreTier()
        }
        return "LOW"
    }

    /// Check if user is in good standing
    access(all) fun isGoodStanding(address: Address): Bool {
        if let scoreData = self.getTrustScoreData(address: address) {
            return scoreData.isGoodStanding()
        }
        return false
    }

    /// Get score metrics for a user
    access(all) fun getScoreMetrics(address: Address): {String: AnyStruct} {
        if let scoreData = self.getTrustScoreData(address: address) {
            return {
                "currentScore": scoreData.currentScore,
                "effectiveScore": scoreData.getEffectiveScore(),
                "previousScore": scoreData.previousScore,
                "scoreChange": scoreData.getScoreChange(),
                "scoreTier": scoreData.getScoreTier(),
                "totalRepayments": scoreData.totalRepayments,
                "successfulRepayments": scoreData.successfulRepayments,
                "defaults": scoreData.defaults,
                "latePayments": scoreData.latePayments,
                "tradingVolume": scoreData.tradingVolume,
                "accountAgeDays": scoreData.accountAgeDays,
                "attestationBoost": scoreData.attestationBoost,
                "isGoodStanding": scoreData.isGoodStanding(),
                "lastUpdateTime": scoreData.lastUpdateTime,
                "lastActivityTime": scoreData.lastActivityTime
            }
        }
        return {}
    }

    /// Get global statistics
    access(all) fun getGlobalStats(): {String: AnyStruct} {
        return {
            "totalUsers": self.totalUsers,
            "averageScore": self.averageScore,
            "baseScore": 50,
            "maxScore": 100,
            "minScore": 0
        }
    }
}