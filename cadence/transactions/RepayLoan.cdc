import "FlowToken"
import "FungibleToken"
import "LendingPool"
import "TrustScore"

/// Repay borrowed funds to the lending pool
/// Users can repay their loans to reduce interest and improve their trust score
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
            isOnTime: true // In production, this would check if payment is on time
        )
        
        // In a real implementation, repayTokens would be sent to the pool vault
        // For now, we'll destroy them as the pool contract handles the logic
        destroy repayTokens
        
        log("Loan repaid successfully")
        log("Amount: ".concat(repaidAmount.toString()))
        log("Asset: ".concat(assetName))
        log("User Address: ".concat(signer.address.toString()))
    }
    
    execute {
        log("Repay transaction completed")
    }
}
