import "FlowToken"
import "FungibleToken"
import "LendingPool"

/// Deposit collateral into the lending pool
/// Users can deposit Flow tokens as collateral to borrow against
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
        
        // Withdraw tokens from user's vault
        let tokens <- vault.withdraw(amount: amount) as! @FlowToken.Vault
        
        // Deposit collateral into lending pool
        LendingPool.depositCollateral(
            account: signer,
            amount: amount,
            assetName: assetName
        )
        
        // In a real implementation, tokens would be sent to the pool vault
        // For now, we'll destroy them as the pool contract handles the logic
        destroy tokens
        
        log("Collateral deposited successfully")
        log("Amount: ".concat(amount.toString()))
        log("Asset: ".concat(assetName))
        log("User Address: ".concat(signer.address.toString()))
    }
    
    execute {
        log("Collateral deposit completed")
    }
}
