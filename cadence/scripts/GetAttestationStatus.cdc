import "FlowAttestation"

/// Script to get a user's attestation status and verification details
access(all) fun main(address: Address): {String: AnyStruct} {
    
    // Get user's attestation collection
    let collection = FlowAttestation.getAttestationCollection(address: address)
    
    if collection == nil {
        return {
            "address": address,
            "hasAttestations": false,
            "totalAttestations": 0,
            "activeAttestations": 0,
            "trustScoreBoost": 0,
            "verificationStatus": "UNVERIFIED",
            "attestations": []
        }
    }
    
    let attestationCollection = collection!
    
    // Get all valid attestations
    let validAttestations = attestationCollection.getValidAttestations()
    let totalBoost = attestationCollection.getTotalTrustScoreBoost()
    let activeCount = attestationCollection.getActiveCount()
    let totalCount = attestationCollection.getAttestationIDs().length
    
    // Determine verification status
    let verificationStatus = if totalBoost > 0 {
        if totalBoost >= 15 { "PREMIUM_VERIFIED" }
        else { "VERIFIED" }
    } else {
        "UNVERIFIED"
    }
    
    // Build attestation details
    var attestationDetails: [{String: AnyStruct}] = []
    for attestation in validAttestations {
        attestationDetails.append({
            "id": attestation.id,
            "claimHash": attestation.claimHash,
            "issuerPublicKey": attestation.issuerPublicKey,
            "expiryTimestamp": attestation.expiryTimestamp,
            "issuedAt": attestation.issuedAt,
            "metadata": attestation.metadata,
            "isValid": attestation.isValid(),
            "trustScoreBoost": attestation.getTrustScoreBoost()
        })
    }
    
    return {
        "address": address,
        "hasAttestations": true,
        "totalAttestations": totalCount,
        "activeAttestations": activeCount,
        "trustScoreBoost": totalBoost,
        "verificationStatus": verificationStatus,
        "attestations": attestationDetails,
        "isVerified": totalBoost > 0
    }
}
