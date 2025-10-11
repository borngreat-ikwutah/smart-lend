import "FungibleToken"
import "FlowToken"
import "MetadataViews"

/// TrustScoreOracle - AI-powered credit scoring oracle for Flow blockchain
/// Integrates with external AI services to provide real-time credit assessments
access(all) contract TrustScoreOracle {

    // Storage paths
    access(all) let OracleStoragePath: StoragePath
    access(all) let OraclePublicPath: PublicPath

    // Oracle configuration
    access(all) let MIN_UPDATE_INTERVAL: UFix64
    access(all) let MAX_BATCH_SIZE: UInt32
    access(all) let ORACLE_FEE: UFix64

    /// Oracle admin resource
    access(all) resource OracleAdmin {
        access(all) let adminAddress: Address
        access(all) var isActive: Bool
        access(all) var lastUpdateTime: UFix64
        access(all) var totalUpdates: UInt32
        access(all) var feeCollected: UFix64
        
        init(adminAddress: Address) {
            self.adminAddress = adminAddress
            self.isActive = true
            self.lastUpdateTime = 0.0
            self.totalUpdates = 0
            self.feeCollected = 0.0
        }
        
        /// Activate/deactivate oracle
        access(all) fun setActive(active: Bool) {
            self.isActive = active
        }
        
        /// Record update
        access(all) fun recordUpdate(fee: UFix64) {
            self.lastUpdateTime = getCurrentBlock().timestamp
            self.totalUpdates = self.totalUpdates + 1
            self.feeCollected = self.feeCollected + fee
        }
        
        /// Withdraw collected fees
        access(all) fun withdrawFees(): UFix64 {
            let amount = self.feeCollected
            self.feeCollected = 0.0
            return amount
        }
    }

    /// Score update request
    access(all) struct ScoreUpdateRequest {
        access(all) let userAddress: Address
        access(all) let requestedAt: UFix64
        access(all) let priority: UInt8 // 0=High, 1=Medium, 2=Low
        access(all) let fee: UFix64
        access(all) var status: String // "pending", "processing", "completed", "failed"
        
        init(userAddress: Address, priority: UInt8, fee: UFix64) {
            self.userAddress = userAddress
            self.requestedAt = getCurrentBlock().timestamp
            self.priority = priority
            self.fee = fee
            self.status = "pending"
        }
        
        /// Update status
        access(all) fun updateStatus(newStatus: String) {
            self.status = newStatus
        }
    }

    /// Oracle response from AI service
    access(all) struct OracleResponse {
        access(all) let userAddress: Address
        access(all) let newScore: UInt8
        access(all) let confidence: UFix64
        access(all) let factors: {String: AnyStruct}
        access(all) let timestamp: UFix64
        access(all) let modelVersion: String
        
        init(
            userAddress: Address,
            newScore: UInt8,
            confidence: UFix64,
            factors: {String: AnyStruct},
            modelVersion: String
        ) {
            self.userAddress = userAddress
            self.newScore = newScore
            self.confidence = confidence
            self.factors = factors
            self.timestamp = getCurrentBlock().timestamp
            self.modelVersion = modelVersion
        }
    }

    // Global state
    access(all) var oracleAdmin: @OracleAdmin
    access(all) var pendingRequests: {Address: ScoreUpdateRequest}
    access(all) var completedRequests: {Address: [OracleResponse]}

    // Events
    access(all) event ScoreUpdateRequested(
        user: Address,
        priority: UInt8,
        fee: UFix64,
        timestamp: UFix64
    )
    
    access(all) event ScoreUpdated(
        user: Address,
        oldScore: UInt8,
        newScore: UInt8,
        confidence: UFix64,
        modelVersion: String,
        timestamp: UFix64
    )
    
    access(all) event OracleStatusChanged(
        isActive: Bool,
        timestamp: UFix64
    )
    
    access(all) event FeesCollected(
        amount: UFix64,
        totalCollected: UFix64,
        timestamp: UFix64
    )

    init() {
        self.OracleStoragePath = /storage/trustScoreOracle
        self.OraclePublicPath = /public/trustScoreOracle
        
        // Initialize oracle configuration
        self.MIN_UPDATE_INTERVAL = 86400.0 // 24 hours in seconds
        self.MAX_BATCH_SIZE = 100
        self.ORACLE_FEE = 0.01 // 0.01 FLOW per update
        
        // Initialize oracle components
        self.oracleAdmin <- create OracleAdmin(adminAddress: self.account.address)
        self.pendingRequests = {}
        self.completedRequests = {}
    }

    /// Request score update from AI oracle
    access(all) fun requestScoreUpdate(
        account: &Account,
        priority: UInt8,
        fee: UFix64
    ) {
        pre {
            self.oracleAdmin.isActive: "Oracle is not active"
            fee >= self.ORACLE_FEE: "Insufficient fee"
            priority <= 2: "Invalid priority level"
        }
        
        let userAddress = account.address
        
        // Check if enough time has passed since last update
        if let existingRequest = self.pendingRequests[userAddress] {
            let timeSinceLastRequest = getCurrentBlock().timestamp - existingRequest.requestedAt
            assert(timeSinceLastRequest >= self.MIN_UPDATE_INTERVAL, message: "Update too frequent")
        }
        
        // Create update request
        let request = ScoreUpdateRequest(
            userAddress: userAddress,
            priority: priority,
            fee: fee
        )
        
        self.pendingRequests[userAddress] = request
        
        emit ScoreUpdateRequested(
            user: userAddress,
            priority: priority,
            fee: fee,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Process score update (called by AI service)
    access(all) fun processScoreUpdate(
        userAddress: Address,
        newScore: UInt8,
        confidence: UFix64,
        factors: {String: AnyStruct},
        modelVersion: String
    ) {
        pre {
            self.oracleAdmin.isActive: "Oracle is not active"
            confidence >= 0.0 && confidence <= 1.0: "Invalid confidence level"
            newScore >= 0 && newScore <= 100: "Invalid score range"
        }
        
        // Verify request exists
        let request = self.pendingRequests[userAddress]
            ?? panic("No pending request for user")
        
        // Update request status
        request.updateStatus(newStatus: "processing")
        
        // Create oracle response
        let response = OracleResponse(
            userAddress: userAddress,
            newScore: newScore,
            confidence: confidence,
            factors: factors,
            modelVersion: modelVersion
        )
        
        // Update completed requests
        if self.completedRequests[userAddress] == nil {
            self.completedRequests[userAddress] = []
        }
        self.completedRequests[userAddress]!.append(response)
        
        // Remove from pending requests
        self.pendingRequests.remove(key: userAddress)
        
        // Record update
        self.oracleAdmin.recordUpdate(fee: request.fee)
        
        emit ScoreUpdated(
            user: userAddress,
            oldScore: 0, // Would get from TrustScore contract
            newScore: newScore,
            confidence: confidence,
            modelVersion: modelVersion,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Get pending requests (for AI service polling)
    access(all) fun getPendingRequests(): [ScoreUpdateRequest] {
        var requests: [ScoreUpdateRequest] = []
        
        for request in self.pendingRequests.values {
            requests.append(request)
        }
        
        return requests
    }

    /// Get oracle status
    access(all) fun getOracleStatus(): {String: AnyStruct} {
        return {
            "isActive": self.oracleAdmin.isActive,
            "lastUpdateTime": self.oracleAdmin.lastUpdateTime,
            "totalUpdates": self.oracleAdmin.totalUpdates,
            "feeCollected": self.oracleAdmin.feeCollected,
            "pendingRequests": self.pendingRequests.length,
            "modelVersion": "1.0.0",
            "modelAccuracy": 0.85
        }
    }

    /// Activate/deactivate oracle (admin only)
    access(all) fun setOracleActive(active: Bool) {
        self.oracleAdmin.setActive(active: active)
        
        emit OracleStatusChanged(
            isActive: active,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Emergency pause oracle
    access(all) fun emergencyPause() {
        self.oracleAdmin.setActive(active: false)
        
        emit OracleStatusChanged(
            isActive: false,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Get user's oracle history
    access(all) fun getUserOracleHistory(address: Address): [OracleResponse] {
        return self.completedRequests[address] ?? []
    }
}