import "FlowAttestation"
import "TrustScore"
import "LendingPool"

/// Claim an attestation for wallet verification
/// This transaction allows users to claim attestations issued by verified partners
transaction(
    attestation: @FlowAttestation.Attestation
) {
    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, SaveValue, GetStorageCapabilityController, PublishCapability) &Account) {
        
        // Get user's attestation collection
        let collection = signer.capabilities
            .get<&FlowAttestation.AttestationCollection>(FlowAttestation.AttestationCollectionPublicPath)
            .borrow()
            ?? panic("AttestationCollection not found. Please initialize your account first.")
        
        // Deposit the attestation into the collection
        collection.deposit(attestation: <-attestation)
        
        // Update attestation boost in TrustScore
        let totalBoost = collection.getTotalTrustScoreBoost()
        TrustScore.updateAttestationBoost(address: signer.address, boost: totalBoost)
        
        // Update attestation boost in LendingPool
        LendingPool.updateAttestationBoost(address: signer.address, boost: totalBoost)
        
        log("Attestation claimed successfully")
        log("Trust Score Boost: ".concat(totalBoost.toString()))
        log("User Address: ".concat(signer.address.toString()))
    }
    
    execute {
        log("Attestation claim completed")
    }
}
