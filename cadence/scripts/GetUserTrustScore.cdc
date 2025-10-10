import "TrustScore"
import "FlowAttestation"

/// Script to get a user's current trust score and related information
access(all) fun main(address: Address): {String: AnyStruct} {
    
    // Get trust score data
    let trustScoreData = TrustScore.getTrustScoreData(address: address)
    
    if trustScoreData == nil {
        return {
            "error": "User not found or not initialized",
            "address": address,
            "trustScore": 0,
            "scoreTier": "UNKNOWN",
            "isGoodStanding": false
        }
    }
    
    let scoreData = trustScoreData!
    
    // Get attestation boost
    let attestationBoost = FlowAttestation.getTrustScoreBoost(address: address)
    
    // Get comprehensive score metrics
    let metrics = TrustScore.getScoreMetrics(address: address)
    
    return {
        "address": address,
        "trustScore": scoreData.getEffectiveScore(),
        "baseScore": scoreData.currentScore,
        "attestationBoost": attestationBoost,
        "effectiveScore": scoreData.getEffectiveScore(),
        "scoreTier": scoreData.getScoreTier(),
        "isGoodStanding": scoreData.isGoodStanding(),
        "scoreChange": scoreData.getScoreChange(),
        "lastUpdateTime": scoreData.lastUpdateTime,
        "totalRepayments": scoreData.totalRepayments,
        "successfulRepayments": scoreData.successfulRepayments,
        "defaults": scoreData.defaults,
        "latePayments": scoreData.latePayments,
        "tradingVolume": scoreData.tradingVolume,
        "accountAgeDays": scoreData.accountAgeDays,
        "scoreTrend": scoreData.getScoreTrend(),
        "detailedMetrics": metrics
    }
}
