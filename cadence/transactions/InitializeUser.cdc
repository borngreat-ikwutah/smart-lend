import "FlowToken"
import "FungibleToken"
import "FlowAttestation"
import "LendingPool"
import "TrustScore"

/// Initialize user accounts with all necessary resources for SmartLend
/// This transaction sets up the user's attestation collection, trust score, and lending position
transaction {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {
        
        // Initialize Attestation Collection
        FlowAttestation.initializeAttestationCollection(account: signer)
        
        // Initialize Trust Score with base score of 30 (unverified user)
        let initialScore: UInt8 = 30
        TrustScore.initializeTrustScore(account: signer, initialScore: initialScore)
        
        // Initialize Lending Position for FlowToken
        LendingPool.initializeUserPosition(
            account: signer,
            collateralType: Type<@FlowToken.Vault>(),
            borrowedType: Type<@FlowToken.Vault>(),
            trustScore: initialScore
        )
        
        log("User initialized successfully for SmartLend")
        log("Initial Trust Score: ".concat(initialScore.toString()))
        log("User Address: ".concat(signer.address.toString()))
    }
    
    execute {
        log("User initialization completed")
    }
}
