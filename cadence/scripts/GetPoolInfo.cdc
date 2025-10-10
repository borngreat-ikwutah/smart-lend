import "LendingPool"

/// Script to get comprehensive information about a lending pool
access(all) fun main(assetName: String): {String: AnyStruct} {
    
    // Get pool information
    let poolInfo = LendingPool.getPoolInfo(assetName: assetName)
    
    return {
        "assetName": assetName,
        "totalLiquidity": poolInfo["totalLiquidity"],
        "totalBorrowed": poolInfo["totalBorrowed"],
        "utilizationRate": poolInfo["utilizationRate"],
        "interestRate": poolInfo["interestRate"],
        "availableLiquidity": poolInfo["totalLiquidity"] - poolInfo["totalBorrowed"],
        "isActive": true // In production, this would come from pool config
    }
}
