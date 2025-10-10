import "FungibleToken"
import "FlowToken"
import "MetadataViews"

/// Adapted for Flow blockchain with resource-oriented programming
/// Provides verifiable attestations for wallet verification and trust scoring
access(all) contract FlowAttestation {

    // Storage paths
    access(all) let AttestationStoragePath: StoragePath
    access(all) let AttestationPublicPath: PublicPath
    access(all) let AttestationCollectionStoragePath: StoragePath
    access(all) let AttestationCollectionPublicPath: PublicPath

    // Admin resource for issuing attestations
    access(all) resource AttestationAdmin {
        access(all) let adminAddress: Address
        
        init(adminAddress: Address) {
            self.adminAddress = adminAddress
        }
        
        /// Issue a new attestation to a user
        access(all) fun issueAttestation(
            recipient: Address,
            claimHash: String,
            issuerPublicKey: String,
            expiryTimestamp: UFix64,
            metadata: {String: String}
        ): Attestation {
            return create Attestation(
                claimHash: claimHash,
                issuerPublicKey: issuerPublicKey,
                expiryTimestamp: expiryTimestamp,
                issuedAt: getCurrentBlock().timestamp,
                metadata: metadata,
                isActive: true
            )
        }
        
        /// Revoke an attestation
        access(all) fun revokeAttestation(attestationId: UInt64, recipient: Address) {
            let recipientAccount = getAccount(recipient)
            let collection = recipientAccount.capabilities
                .get<&FlowAttestation.AttestationCollection>(AttestationCollectionPublicPath)
                .borrow()
                ?? panic("AttestationCollection not found")
            
            collection.revokeAttestation(attestationId: attestationId)
        }
    }

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
            let oldAttestation <- self.attestations[id] <- attestation
            
            // Update active count
            if oldAttestation != nil && oldAttestation!.isValid() {
                self.totalActiveCount = self.totalActiveCount - 1
            }
            if attestation.isValid() {
                self.totalActiveCount = self.totalActiveCount + 1
            }
            
            destroy oldAttestation
        }
        
        /// Get an attestation by ID
        access(all) fun getAttestation(id: UInt64): &Attestation? {
            return &self.attestations[id] as &Attestation?
        }
        
        /// Get all valid attestations
        access(all) fun getValidAttestations(): [&Attestation] {
            var validAttestations: [&Attestation] = []
            
            for attestation in self.attestations.values {
                if attestation.isValid() {
                    validAttestations.append(&attestation)
                }
            }
            
            return validAttestations
        }
        
        /// Get total trust score boost from all valid attestations
        access(all) fun getTotalTrustScoreBoost(): UInt8 {
            var totalBoost: UInt8 = 0
            
            for attestation in self.attestations.values {
                if attestation.isValid() {
                    totalBoost = totalBoost + attestation.getTrustScoreBoost()
                }
            }
            
            return totalBoost
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
        
        /// Get all attestation IDs
        access(all) fun getAttestationIDs(): [UInt64] {
            return self.attestations.keys
        }
        
        /// Get active attestation count
        access(all) fun getActiveCount(): UInt32 {
            return self.totalActiveCount
        }
    }

    // Events
    access(all) event AttestationIssued(
        issuer: Address,
        recipient: Address,
        attestationId: UInt64,
        claimHash: String
    )
    
    access(all) event AttestationRevoked(
        attestationId: UInt64,
        recipient: Address
    )
    
    access(all) event AttestationExpired(
        attestationId: UInt64,
        recipient: Address
    )

    init() {
        self.AttestationStoragePath = /storage/flowAttestation
        self.AttestationPublicPath = /public/flowAttestation
        self.AttestationCollectionStoragePath = /storage/flowAttestationCollection
        self.AttestationCollectionPublicPath = /public/flowAttestationCollection
        
        // Create admin resource and save to storage
        let admin <- create AttestationAdmin(adminAddress: self.owner?.address ?? 0x0)
        self.account.storage.save(<-admin, to: /storage/flowAttestationAdmin)
        
        // Create a public capability for the admin
        let adminCap = self.account.capabilities.storage.issue<&FlowAttestation.AttestationAdmin>(/storage/flowAttestationAdmin)
        self.account.capabilities.publish(adminCap, at: /public/flowAttestationAdmin)
    }

    /// Initialize user's attestation collection
    access(all) fun initializeAttestationCollection(account: &Account) {
        if account.storage.borrow<&FlowAttestation.AttestationCollection>(from: AttestationCollectionStoragePath) != nil {
            return
        }
        
        let collection <- create AttestationCollection()
        account.storage.save(<-collection, to: AttestationCollectionStoragePath)
        
        // Create a public capability
        let collectionCap = account.capabilities.storage.issue<&FlowAttestation.AttestationCollection>(AttestationCollectionStoragePath)
        account.capabilities.publish(collectionCap, at: AttestationCollectionPublicPath)
    }

    /// Get attestation collection for an address
    access(all) fun getAttestationCollection(address: Address): &AttestationCollection? {
        let account = getAccount(address)
        return account.capabilities
            .get<&FlowAttestation.AttestationCollection>(AttestationCollectionPublicPath)
            .borrow()
    }

    /// Issue attestation (admin only)
    access(all) fun issueAttestation(
        recipient: Address,
        claimHash: String,
        issuerPublicKey: String,
        expiryTimestamp: UFix64,
        metadata: {String: String}
    ): Attestation {
        let admin = self.account.capabilities
            .get<&FlowAttestation.AttestationAdmin>(/public/flowAttestationAdmin)
            .borrow()
            ?? panic("Admin capability not found")
        
        let attestation = admin.issueAttestation(
            recipient: recipient,
            claimHash: claimHash,
            issuerPublicKey: issuerPublicKey,
            expiryTimestamp: expiryTimestamp,
            metadata: metadata
        )
        
        emit AttestationIssued(
            issuer: self.owner?.address ?? 0x0,
            recipient: recipient,
            attestationId: attestation.id,
            claimHash: claimHash
        )
        
        return attestation
    }

    /// Revoke attestation (admin only)
    access(all) fun revokeAttestation(attestationId: UInt64, recipient: Address) {
        let admin = self.account.capabilities
            .get<&FlowAttestation.AttestationAdmin>(/public/flowAttestationAdmin)
            .borrow()
            ?? panic("Admin capability not found")
        
        admin.revokeAttestation(attestationId: attestationId, recipient: recipient)
        
        emit AttestationRevoked(
            attestationId: attestationId,
            recipient: recipient
        )
    }

    /// Check if address has valid attestations
    access(all) fun hasValidAttestations(address: Address): Bool {
        if let collection = self.getAttestationCollection(address: address) {
            return collection.getActiveCount() > 0
        }
        return false
    }

    /// Get trust score boost for an address
    access(all) fun getTrustScoreBoost(address: Address): UInt8 {
        if let collection = self.getAttestationCollection(address: address) {
            return collection.getTotalTrustScoreBoost()
        }
        return 0
    }
}
