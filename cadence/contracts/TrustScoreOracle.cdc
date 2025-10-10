import "FungibleToken"
import "FlowToken"
import "MetadataViews"
import "TrustScore"
import "FlowAttestation"

/// TrustScoreOracle - AI-powered credit scoring oracle for Flow blockchain
/// Integrates with external AI services to provide real-time credit assessments
/// Inspired by Spectral Labs' AI agent architecture and Cred Protocol's data infrastructure
access(all) contract TrustScoreOracle {

    // Storage paths
    access(all) let OracleStoragePath: StoragePath
    access(all) let OraclePublicPath: PublicPath

    // Oracle configuration
    access(all) let MIN_UPDATE_INTERVAL: UFix64 = 86400.0 // 24 hours in seconds
    access(all) let MAX_BATCH_SIZE: UInt32 = 100
    access(all) let ORACLE_FEE: UFix64 = 0.01 // 0.01 FLOW per update

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

    /// AI model configuration
    access(all) resource AIModelConfig {
        access(all) var modelVersion: String
        access(all) var modelEndpoint: String
        access(all) var modelParameters: {String: String}
        access(all) var isActive: Bool
        access(all) var lastTrainingTime: UFix64
        access(all) var accuracy: UFix64
        
        init() {
            self.modelVersion = "1.0.0"
            self.modelEndpoint = "https://api.smartlend.ai/score"
            self.modelParameters = {}
            self.isActive = true
            self.lastTrainingTime = 0.0
            self.accuracy = 0.85 // 85% accuracy
        }
        
        /// Update model configuration
        access(all) fun updateConfig(
            version: String,
            endpoint: String,
            parameters: {String: String}
        ) {
            self.modelVersion = version
            self.modelEndpoint = endpoint
            self.modelParameters = parameters
        }
        
        /// Update accuracy metrics
        access(all) fun updateAccuracy(newAccuracy: UFix64) {
            self.accuracy = newAccuracy
        }
        
        /// Record model training
        access(all) fun recordTraining() {
            self.lastTrainingTime = getCurrentBlock().timestamp
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

    /// Onchain data aggregator for AI analysis
    access(all) resource DataAggregator {
        access(all) var userMetrics: {Address: {String: AnyStruct}}
        access(all) var globalMetrics: {String: AnyStruct}
        
        init() {
            self.userMetrics = {}
            self.globalMetrics = {}
        }
        
        /// Update user metrics
        access(all) fun updateUserMetrics(
            address: Address,
            metrics: {String: AnyStruct}
        ) {
            self.userMetrics[address] = metrics
        }
        
        /// Get user metrics for AI analysis
        access(all) fun getUserMetrics(address: Address): {String: AnyStruct} {
            return self.userMetrics[address] ?? {}
        }
        
        /// Update global metrics
        access(all) fun updateGlobalMetrics(metrics: {String: AnyStruct}) {
            self.globalMetrics = metrics
        }
        
        /// Aggregate onchain data for AI analysis
        access(all) fun aggregateOnchainData(address: Address): {String: AnyStruct} {
            // This would integrate with Flow Access API to fetch:
            // - Transaction history
            // - Token transfers
            // - Contract interactions
            // - DeFi protocol usage
            // - NFT trading activity
            
            var aggregatedData: {String: AnyStruct} = {}
            
            // Get existing user metrics
            let userMetrics = self.getUserMetrics(address: address)
            
            // Add onchain data points
            aggregatedData["address"] = address
            aggregatedData["blockHeight"] = getCurrentBlock().height
            aggregatedData["timestamp"] = getCurrentBlock().timestamp
            aggregatedData["userMetrics"] = userMetrics
            
            // Add global market context
            aggregatedData["globalMetrics"] = self.globalMetrics
            
            return aggregatedData
        }
    }

    /// Oracle fee collector
    access(all) resource FeeCollector {
        access(all) var collectedFees: UFix64
        access(all) var feeVault: @FlowToken.Vault
        
        init() {
            self.collectedFees = 0.0
            self.feeVault <- create FlowToken.Vault(balance: 0.0)
        }
        
        /// Collect fee
        access(all) fun collectFee(fee: UFix64, vault: &FlowToken.Vault) {
            let feeTokens <- vault.withdraw(amount: fee) as! @FlowToken.Vault
            self.feeVault.deposit(from: <-feeTokens)
            self.collectedFees = self.collectedFees + fee
        }
        
        /// Get total collected fees
        access(all) fun getCollectedFees(): UFix64 {
            return self.collectedFees
        }
        
        /// Withdraw fees to admin
        access(all) fun withdrawFees(amount: UFix64): @FlowToken.Vault {
            return <-self.feeVault.withdraw(amount: amount) as! @FlowToken.Vault
        }
    }

    // Global state
    access(all) var oracleAdmin: OracleAdmin
    access(all) var modelConfig: AIModelConfig
    access(all) var dataAggregator: DataAggregator
    access(all) var feeCollector: FeeCollector
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
    
    access(all) event ModelConfigUpdated(
        version: String,
        endpoint: String,
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
        
        // Initialize oracle components
        self.oracleAdmin = OracleAdmin(adminAddress: self.owner?.address ?? 0x0)
        self.modelConfig = AIModelConfig()
        self.dataAggregator = DataAggregator()
        self.feeCollector = FeeCollector()
        self.pendingRequests = {}
        self.completedRequests = {}
        
        // Save oracle admin to storage
        self.account.storage.save(<-self.oracleAdmin, to: /storage/oracleAdmin)
        
        // Create public capability for oracle admin
        let adminCap = self.account.capabilities.storage.issue<&TrustScoreOracle.OracleAdmin>(/storage/oracleAdmin)
        self.account.capabilities.publish(adminCap, at: /public/oracleAdmin)
    }

    /// Request score update from AI oracle
    access(all) fun requestScoreUpdate(
        account: &Account,
        priority: UInt8,
        fee: UFix64
    ) {
        pre {
            self.oracleAdmin.isActive: "Oracle is not active"
            fee >= ORACLE_FEE: "Insufficient fee"
            priority <= 2: "Invalid priority level"
        }
        
        let userAddress = account.address
        
        // Check if enough time has passed since last update
        if let existingRequest = self.pendingRequests[userAddress] {
            let timeSinceLastRequest = getCurrentBlock().timestamp - existingRequest.requestedAt
            assert(timeSinceLastRequest >= MIN_UPDATE_INTERVAL, message: "Update too frequent")
        }
        
        // Collect fee
        let vault = account.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("FlowToken vault not found")
        
        self.feeCollector.collectFee(fee: fee, vault: vault)
        
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
        request.updateStatus("processing")
        
        // Get current score from TrustScore contract
        let trustScoreContract = getAccount(0x01).getContract(name: "TrustScore")
            ?? panic("TrustScore contract not found")
        
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
        
        // Update trust score in TrustScore contract
        // This would be a cross-contract call in production
        // For now, we'll emit an event that the backend can listen to
        
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

    /// Batch process score updates
    access(all) fun batchProcessScoreUpdates(
        updates: [OracleResponse]
    ) {
        pre {
            updates.length <= MAX_BATCH_SIZE: "Batch size too large"
            self.oracleAdmin.isActive: "Oracle is not active"
        }
        
        for update in updates {
            self.processScoreUpdate(
                userAddress: update.userAddress,
                newScore: update.newScore,
                confidence: update.confidence,
                factors: update.factors,
                modelVersion: update.modelVersion
            )
        }
    }

    /// Update model configuration (admin only)
    access(all) fun updateModelConfig(
        version: String,
        endpoint: String,
        parameters: {String: String}
    ) {
        self.modelConfig.updateConfig(
            version: version,
            endpoint: endpoint,
            parameters: parameters
        )
        
        emit ModelConfigUpdated(
            version: version,
            endpoint: endpoint,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Update global metrics
    access(all) fun updateGlobalMetrics(metrics: {String: AnyStruct}) {
        self.dataAggregator.updateGlobalMetrics(metrics: metrics)
    }

    /// Update user metrics
    access(all) fun updateUserMetrics(
        address: Address,
        metrics: {String: AnyStruct}
    ) {
        self.dataAggregator.updateUserMetrics(address: address, metrics: metrics)
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
            "modelVersion": self.modelConfig.modelVersion,
            "modelAccuracy": self.modelConfig.accuracy
        }
    }

    /// Get aggregated data for AI analysis
    access(all) fun getAggregatedData(address: Address): {String: AnyStruct} {
        return self.dataAggregator.aggregateOnchainData(address: address)
    }

    /// Activate/deactivate oracle (admin only)
    access(all) fun setOracleActive(active: Bool) {
        self.oracleAdmin.setActive(active: active)
        
        emit OracleStatusChanged(
            isActive: active,
            timestamp: getCurrentBlock().timestamp
        )
    }

    /// Withdraw collected fees (admin only)
    access(all) fun withdrawFees(): @FlowToken.Vault {
        let totalFees = self.feeCollector.getCollectedFees()
        let withdrawnAmount = self.oracleAdmin.withdrawFees()
        
        emit FeesCollected(
            amount: withdrawnAmount.balance,
            totalCollected: totalFees,
            timestamp: getCurrentBlock().timestamp
        )
        
        return withdrawnAmount
    }

    /// Emergency pause oracle
    access(all) fun emergencyPause() {
        self.oracleAdmin.setActive(false)
        
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
