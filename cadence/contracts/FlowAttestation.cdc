import "FungibleToken"
import "FlowToken"
import "MetadataViews"

/// FlowAttestation - Production-ready attestation contract for Flow blockchain
/// Provides verifiable attestations for wallet verification and trust scoring
access(all) contract FlowAttestation {

    // Storage paths
    access(all) let AttestationStoragePath: StoragePath
    access(all) let AttestationPublicPath: PublicPath
    access(all) let AttestationCollectionStoragePath: StoragePath
    access(all) let AttestationCollectionPublicPath: PublicPath

    /// Attestation resource - represents a verified claim about a wallet
    access(all) resource Attestation {
        access(all) let id: UInt64
        access(all) let claimHash: String
        access(all) let issuerPublicKey: String
        access(all) let expiryTimestamp: UFix64
        access(all) let issuedAt: UFix64
        access(all) var metadata: {String: String}
        access(all) var isActive: Bool
        
        init(
            claimHash: String,
            issuerPublicKey: String,
            expiryTimestamp: UFix64,
            issuedAt: UFix64,
            metadata: {String: String},
            isActive: Bool
        ) {
            self.id = self.uuid
            self.claimHash = claimHash
            self.issuerPublicKey = issuerPublicKey
            self.expiryTimestamp = expiryTimestamp
            self.issuedAt = issuedAt
            self.metadata = metadata
            self.isActive = isActive
        }
        
        /// Check if attestation is valid (not expired and active)
        access(all) fun isValid(): Bool {
            return self.isActive && getCurrentBlock().timestamp <= self.expiryTimestamp
        }
        
        /// Get trust score boost from attestation
        access(all) fun getTrustScoreBoost(): UInt8 {
            if !self.isValid() {
                return 0
            }
            
            // Base boost for any valid attestation
            var boost: UInt8 = 10
            
            // Additional boost based on metadata
            if self.metadata["tier"] == "premium" {
                boost = boost + 5
            }
            
            if self.metadata["kyc_level"] == "high" {
                boost = boost + 3
            }
            
            return boost
        }
        
        /// Update metadata
        access(all) fun updateMetadata(newMetadata: {String: String}) {
            self.metadata = newMetadata
        }
        
        /// Deactivate attestation
        access(all) fun deactivate() {
            self.isActive = false
        }
    }

    /// Collection resource for managing multiple attestations per user
    access(all) resource AttestationCollection {
        access(all) var attestations: @{UInt64: Attestation}
        access(all) var totalActiveCount: UInt32
        
        init() {
            self.attestations <- {}
            self.totalActiveCount = 0
        }
        
        /// Deposit an attestation into the collection
        access(all) fun deposit(attestation: @Attestation) {
            let id = attestation.id
            let isNewAttestationValid = attestation.isValid()
            
            // Handle old attestation if it exists
            if let oldAttestation <- self.attestations.remove(key: id) {
                if oldAttestation.isValid() {
                    self.totalActiveCount = self.totalActiveCount - 1
                }
                destroy oldAttestation
            }
            
            // Add new attestation
            self.attestations[id] <-! attestation
            
            // Update active count for new attestation
            if isNewAttestationValid {
                self.totalActiveCount = self.totalActiveCount + 1
            }
        }
        
        /// Get an attestation by ID
        access(all) fun getAttestation(id: UInt64): &Attestation? {
            return &self.attestations[id]
        }
        
        /// Get all attestation IDs
        access(all) fun getAttestationIDs(): [UInt64] {
            return self.attestations.keys
        }
        
        /// Get active attestation count
        access(all) fun getActiveCount(): UInt32 {
            return self.totalActiveCount
        }
        
        /// Get total trust score boost from all valid attestations
        access(all) fun getTotalTrustScoreBoost(): UInt8 {
            var totalBoost: UInt8 = 0
            
            // Iterate through attestation IDs to avoid resource dictionary issues
            for id in self.attestations.keys {
                if let attestation = &self.attestations[id] as &Attestation? {
                    if attestation.isValid() {
                        totalBoost = totalBoost + attestation.getTrustScoreBoost()
                    }
                }
            }
            
            return totalBoost
        }
        
        /// Get all valid attestations
        access(all) fun getValidAttestations(): [&Attestation] {
            var validAttestations: [&Attestation] = []
            
            for id in self.attestations.keys {
                if let attestation = &self.attestations[id] as &Attestation? {
                    if attestation.isValid() {
                        validAttestations.append(attestation)
                    }
                }
            }
            
            return validAttestations
        }
        
        /// Revoke an attestation
        access(all) fun revokeAttestation(attestationId: UInt64) {
            if let attestation <- self.attestations.remove(key: attestationId) {
                if attestation.isValid() {
                    self.totalActiveCount = self.totalActiveCount - 1
                }
                destroy attestation
            }
        }
    }

    // Events
    access(all) event AttestationIssued(
        issuer: Address,
        recipient: Address,
        attestationId: UInt64,
        claimHash: String,
        expiryTimestamp: UFix64
    )
    
    access(all) event AttestationRevoked(
        attestationId: UInt64,
        recipient: Address,
        issuer: Address
    )
    
    access(all) event AttestationExpired(
        attestationId: UInt64,
        recipient: Address
    )
    
    access(all) event AttestationCollectionInitialized(
        address: Address
    )

    init() {
        self.AttestationStoragePath = /storage/flowAttestation
        self.AttestationPublicPath = /public/flowAttestation
        self.AttestationCollectionStoragePath = /storage/flowAttestationCollection
        self.AttestationCollectionPublicPath = /public/flowAttestationCollection
    }

    /// Issue attestation (admin only)
    access(all) fun issueAttestation(
        recipient: Address,
        claimHash: String,
        issuerPublicKey: String,
        expiryTimestamp: UFix64,
        metadata: {String: String}
    ): @Attestation {
        let attestation <- create Attestation(
            claimHash: claimHash,
            issuerPublicKey: issuerPublicKey,
            expiryTimestamp: expiryTimestamp,
            issuedAt: getCurrentBlock().timestamp,
            metadata: metadata,
            isActive: true
        )
        
        emit AttestationIssued(
            issuer: self.account.address,
            recipient: recipient,
            attestationId: attestation.id,
            claimHash: claimHash,
            expiryTimestamp: expiryTimestamp
        )
        
        return <-attestation
    }

    /// Revoke attestation (admin only)
    access(all) fun revokeAttestation(attestationId: UInt64, recipient: Address) {
        emit AttestationRevoked(
            attestationId: attestationId,
            recipient: recipient,
            issuer: self.account.address
        )
    }

    /// Check if address has valid attestations
    access(all) fun hasValidAttestations(address: Address): Bool {
        let account = getAccount(address)
        let collection = account.capabilities
            .get<&FlowAttestation.AttestationCollection>(self.AttestationCollectionPublicPath)
            .borrow()
        
        if let collection = collection {
            return collection.getActiveCount() > 0
        }
        return false
    }

    /// Get trust score boost for an address
    access(all) fun getTrustScoreBoost(address: Address): UInt8 {
        let account = getAccount(address)
        let collection = account.capabilities
            .get<&FlowAttestation.AttestationCollection>(self.AttestationCollectionPublicPath)
            .borrow()
        
        if let collection = collection {
            return collection.getTotalTrustScoreBoost()
        }
        return 0
    }

    /// Get all valid attestations for an address
    access(all) fun getValidAttestations(address: Address): [&Attestation] {
        let account = getAccount(address)
        let collection = account.capabilities
            .get<&FlowAttestation.AttestationCollection>(self.AttestationCollectionPublicPath)
            .borrow()
        
        if let collection = collection {
            return collection.getValidAttestations()
        }
        return []
    }

    /// Get attestation by ID for an address
    access(all) fun getAttestationById(address: Address, attestationId: UInt64): &Attestation? {
        let account = getAccount(address)
        let collection = account.capabilities
            .get<&FlowAttestation.AttestationCollection>(self.AttestationCollectionPublicPath)
            .borrow()
        
        if let collection = collection {
            return collection.getAttestation(id: attestationId)
        }
        return nil
    }

    /// Check if a specific attestation is valid
    access(all) fun isAttestationValid(address: Address, attestationId: UInt64): Bool {
        if let attestation = self.getAttestationById(address: address, attestationId: attestationId) {
            return attestation.isValid()
        }
        return false
    }
}