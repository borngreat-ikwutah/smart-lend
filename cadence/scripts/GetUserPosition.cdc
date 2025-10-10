import "LendingPool"
import "TrustScore"
import "FlowAttestation"

/// Script to get a user's lending position and eligibility
access(all) fun main(address: Address, assetName: String): {String: AnyStruct} {
    
    // Get user's lending position
    let position = LendingPool.getUserPosition(address: address)
    
    if position == nil {
        return {
            "error": "User position not found or not initialized",
            "address": address,
            "assetName": assetName
        }
    }
    
    let userPosition = position!
    
    // Get trust score for additional context
    let trustScore = TrustScore.getTrustScore(address: address)
    let scoreTier = TrustScore.getScoreTier(address: address)
    
    // Get attestation boost
    let attestationBoost = FlowAttestation.getTrustScoreBoost(address: address)
    
    // Get position information
    let positionInfo = LendingPool.getUserPositionInfo(address: address)
    
    // Get pool information
    let poolInfo = LendingPool.getPoolInfo(assetName: assetName)
    
    // Calculate additional metrics
    let collateralRatio = userPosition.getCollateralRatio()
    let requiredRatio = userPosition.getRequiredCollateralRatio()
    let maxBorrowable = userPosition.getMaxBorrowableAmount()
    let isHealthy = userPosition.isHealthy()
    let healthStatus = isHealthy ? "HEALTHY" : "UNHEALTHY"
    
    return {
        "address": address,
        "assetName": assetName,
        "trustScore": trustScore,
        "scoreTier": scoreTier,
        "attestationBoost": attestationBoost,
        "collateralBalance": userPosition.collateralBalance,
        "borrowedAmount": userPosition.borrowedAmount,
        "interestOwed": userPosition.interestOwed,
        "collateralRatio": collateralRatio,
        "requiredRatio": requiredRatio,
        "maxBorrowable": maxBorrowable,
        "isHealthy": isHealthy,
        "healthStatus": healthStatus,
        "interestRate": userPosition.getInterestRate(),
        "lastUpdateTime": userPosition.lastUpdateTime,
        "positionInfo": positionInfo,
        "poolInfo": poolInfo
    }
}
