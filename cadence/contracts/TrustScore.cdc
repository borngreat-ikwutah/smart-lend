import "FungibleToken"
import "FlowToken"
import "MetadataViews"
import "FlowAttestation"

/// TrustScore - AI-driven credit scoring system for Flow blockchain
/// Inspired by Cred Protocol's onchain credit analytics
/// Provides transparent, auditable credit scoring with real-time updates
access(all) contract TrustScore {

    // Storage paths
    access(all) let TrustScoreStoragePath: StoragePath
    access(all) let TrustScorePublicPath: PublicPath
    access(all) let ScoreHistoryStoragePath: StoragePath
    access(all) let ScoreHistoryPublicPath: PublicPath

    // Scoring parameters
    access(all) let BASE_SCORE: UInt8 = 50
    access(all) let MAX_SCORE: UInt8 = 100
    access(all) let MIN_SCORE: UInt8 = 0
    
    // Score adjustment factors
    access(all) let REPAYMENT_BONUS: UInt8 = 10      // Per successful repayment
    access(all) let TRADING_VOLUME_FACTOR: UFix64 = 2.0 // Per 1000 FLOW traded
    access(all) let ACCOUNT_AGE_FACTOR: UFix64 = 1.0   // Per 30 days
    access(all) let VERIFICATION_BONUS: UInt8 = 10   // For verified attestation
    access(all) let DEFAULT_PENALTY: UInt8 = 20      // Per default
    access(all) let LATE_PAYMENT_PENALTY: UInt8 = 5  // Per late payment

    /// User's trust score resource
    access(all) resource TrustScoreData {
        access(all) var currentScore: UInt8
        access(all) var previousScore: UInt8
        access(all) var lastUpdateTime: UFix64
        access(all) var scoreHistory: [ScoreSnapshot]
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
            self.scoreHistory = []
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
            
            // Add initial snapshot
            self.addScoreSnapshot(score: initialScore, reason: "Initial score")
        }
        
        /// Add a score snapshot to history
        access(all) fun addScoreSnapshot(score: UInt8, reason: String) {
            let snapshot = ScoreSnapshot(
                score: score,
                timestamp: getCurrentBlock().timestamp,
                reason: reason,
                blockHeight: getCurrentBlock().height
            )
            self.scoreHistory.append(snapshot)
        }
        
        /// Update score with new calculation
        access(all) fun updateScore(newScore: UInt8, reason: String) {
            self.previousScore = self.currentScore
            self.currentScore = newScore
            self.lastUpdateTime = getCurrentBlock().timestamp
            self.addScoreSnapshot(score: newScore, reason: reason)
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
            var score: UFix64 = UFix64(BASE_SCORE)
            
            // Repayment history bonus
            if self.totalRepayments > 0 {
                let repaymentRate = UFix64(self.successfulRepayments) / UFix64(self.totalRepayments)
                score = score + (UFix64(REPAYMENT_BONUS) * repaymentRate)
            }
            
            // Trading volume bonus
            let volumeBonus = (self.tradingVolume / 1000.0) * TRADING_VOLUME_FACTOR
            score = score + volumeBonus
            
            // Account age bonus
            let ageBonus = (UFix64(self.accountAgeDays) / 30.0) * ACCOUNT_AGE_FACTOR
            score = score + ageBonus
            
            // Verification bonus
            score = score + UFix64(self.attestationBoost)
            
            // Penalties
            score = score - (UFix64(self.defaults) * UFix64(DEFAULT_PENALTY))
            score = score - (UFix64(self.latePayments) * UFix64(LATE_PAYMENT_PENALTY))
            
            // Ensure score is within bounds
            let finalScore = max(UFix64(MIN_SCORE), min(UFix64(MAX_SCORE), score))
            
            return UInt8(finalScore)
        }
        
        /// Get effective score (including attestation boost)
        access(all) fun getEffectiveScore(): UInt8 {
            return min(MAX_SCORE, self.currentScore + self.attestationBoost)
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
        
        /// Get recent score trend (last 5 updates)
        access(all) fun getScoreTrend(): [Int] {
            var trend: [Int] = []
            let historyLength = self.scoreHistory.length
            
            if historyLength < 2 {
                return trend
            }
            
            let startIndex = max(0, historyLength - 6) // Last 5 changes
            for i in startIndex..<historyLength-1 {
                let current = self.scoreHistory[i]
                let next = self.scoreHistory[i + 1]
                trend.append(Int(next.score) - Int(current.score))
            }
            
            return trend
        }
        
        /// Deactivate score (for account closure)
        access(all) fun deactivate() {
            self.isActive = false
            self.addScoreSnapshot(score: 0, reason: "Account deactivated")
        }
    }

    /// Score snapshot for historical tracking
    access(all) struct ScoreSnapshot {
        access(all) let score: UInt8
        access(all) let timestamp: UFix64
        access(all) let reason: String
        access(all) let blockHeight: UInt64
        
        init(score: UInt8, timestamp: UFix64, reason: String, blockHeight: UInt64) {
            self.score = score
            self.timestamp = timestamp
            self.reason = reason
            self.blockHeight = blockHeight
        }
    }

    /// Score calculation parameters (updatable by admin)
    access(all) resource ScoreParameters {
        access(all) var repaymentWeight: UFix64
        access(all) var tradingWeight: UFix64
        access(all) var ageWeight: UFix64
        access(all) var defaultPenalty: UFix64
        access(all) var latePenalty: UFix64
        access(all) var maxBoost: UInt8
        
        init() {
            self.repaymentWeight = 1.0
            self.tradingWeight = 0.5
            self.ageWeight = 0.3
            self.defaultPenalty = 0.2
            self.latePenalty = 0.1
            self.maxBoost = 20
        }
        
        /// Update parameters (admin only)
        access(all) fun updateParameters(
            repaymentWeight: UFix64,
            tradingWeight: UFix64,
            ageWeight: UFix64,
            defaultPenalty: UFix64,
            latePenalty: UFix64,
            maxBoost: UInt8
        ) {
            self.repaymentWeight = repaymentWeight
            self.tradingWeight = tradingWeight
            self.ageWeight = ageWeight
            self.defaultPenalty = defaultPenalty
            self.latePenalty = latePenalty
            self.maxBoost = maxBoost
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
    access(all) var scoreParameters: ScoreParameters
    access(all) var totalUsers: UInt32
    access(all) var averageScore: UFix64

    init() {
        self.TrustScoreStoragePath = /storage/trustScore
        self.TrustScorePublicPath = /public/trustScore
        self.ScoreHistoryStoragePath = /storage/scoreHistory
        self.ScoreHistoryPublicPath = /public/scoreHistory
        
        self.scoreParameters = ScoreParameters()
        self.totalUsers = 0
        self.averageScore = 0.0
    }

    /// Initialize trust score for a new user
    access(all) fun initializeTrustScore(
        account: &Account,
        initialScore: UInt8
    ) {
        if account.storage.borrow<&TrustScore.TrustScoreData>(from: TrustScoreStoragePath) != nil {
            return
        }
        
        let trustScoreData <- create TrustScoreData(initialScore: initialScore)
        account.storage.save(<-trustScoreData, to: TrustScoreStoragePath)
        
        // Create public capability
        let scoreCap = account.capabilities.storage.issue<&TrustScore.TrustScoreData>(TrustScoreStoragePath)
        account.capabilities.publish(scoreCap, at: TrustScorePublicPath)
        
        self.totalUsers = self.totalUsers + 1
        self.updateAverageScore()
        
        emit TrustScoreInitialized(
            user: account.address,
            initialScore: initialScore,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Get user's trust score data
    access(all) fun getTrustScoreData(address: Address): &TrustScoreData? {
        let account = getAccount(address)
        return account.capabilities
            .get<&TrustScore.TrustScoreData>(TrustScorePublicPath)
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
            
            self.updateAverageScore()
            
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

    /// Update average score across all users
    access(all) fun updateAverageScore() {
        // This would be implemented with a more sophisticated calculation
        // For now, we'll use a simple approximation
        // In production, this would iterate through all users or use a more efficient method
    }

    /// Get user's current trust score
    access(all) fun getTrustScore(address: Address): UInt8 {
        if let scoreData = self.getTrustScoreData(address: address) {
            return scoreData.getEffectiveScore()
        }
        return BASE_SCORE
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

    /// Get score history for a user
    access(all) fun getScoreHistory(address: Address): [ScoreSnapshot] {
        if let scoreData = self.getTrustScoreData(address: address) {
            return scoreData.scoreHistory
        }
        return []
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
            "baseScore": BASE_SCORE,
            "maxScore": MAX_SCORE,
            "minScore": MIN_SCORE
        }
    }

    /// Batch update scores (for oracle efficiency)
    access(all) fun batchUpdateScores(
        updates: [{String: AnyStruct}]
    ) {
        for update in updates {
            let address = (update["address"] as? Address) ?? panic("Invalid address")
            let newScore = (update["score"] as? UInt8) ?? panic("Invalid score")
            let reason = (update["reason"] as? String) ?? "Batch update"
            
            self.updateTrustScore(address: address, newScore: newScore, reason: reason)
        }
    }

    /// Emergency pause for score updates
    access(all) fun pauseScoreUpdates() {
        // Implementation for emergency pause
    }

    /// Resume score updates
    access(all) fun resumeScoreUpdates() {
        // Implementation for resuming updates
    }
}
