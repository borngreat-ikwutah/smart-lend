import "FlowToken"
import "FungibleToken"
import "LendingPool"

/// Borrow funds from the lending pool
/// Users can borrow against their collateral based on their trust score
transaction(
    amount: UFix64,
    assetName: String
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {
        
        // Borrow funds from the lending pool
        let borrowedAmount = LendingPool.borrow(
            account: signer,
            amount: amount,
            assetName: assetName
        )
        
        // If successful, create tokens for the user
        if borrowedAmount > 0.0 {
            // In a real implementation, tokens would be minted from the pool
            // For now, we'll create a temporary vault (this would be handled by the pool contract)
            
            // Get user's FlowToken vault to deposit borrowed tokens
            let vault = signer.storage
                .borrow<auth(FungibleToken.Deposit) &FlowToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("FlowToken vault not found")
            
            // In production, this would be tokens from the pool vault
            // For demo purposes, we'll skip the actual token transfer
            // vault.deposit(from: <-borrowedTokens)
            
            log("Funds borrowed successfully")
            log("Requested Amount: ".concat(amount.toString()))
            log("Borrowed Amount: ".concat(borrowedAmount.toString()))
            log("User Address: ".concat(signer.address.toString()))
        } else {
            log("Borrowing failed - insufficient collateral or pool liquidity")
        }
    }
    
    execute {
        log("Borrow transaction completed")
    }
}
